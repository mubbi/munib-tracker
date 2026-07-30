import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// ku overlay for janazah-guide. Index-aligned with JANAZAH_GUIDE_TOPICS in ../janazah-guide.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const JANAZAH_GUIDE_TOPICS_KU: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Mecburek komînal",
    summary: "Cenazah fard kifaye ye - divê civak wê pêk bîne.",
    body: [
      "Nimêja cinazê (Selata Cenazeyê) wacibeke komî ye (ferd kifaye): Heke hinek ji civatê wê bikin, wezîfe ji yên mayî tê rakirin; eger yek neke, hemû sûcdar in. Di nimêjê de rawestayî, bê ruku û sucûd tê nimêj kirin - di nav nimêjan de celebek cihêreng e.",
      'Ebû Hureyre radigihîne ku Resûlê Xuda [dirûd û silavên Xuda lê bin] [dirûd û silavên Xuda lê bin] gotiye: "Kî ku heta nimêjê biçe cenazeyan, wî qirat (xelat) jê re heye û ji kesê ku heta definkirinê beşdar bibe du qirat jê re heye." Ji wî hat pirsîn ku qirat çi ye, wî got: "Wek du çiyayên mezin" (Sahih el-Buxarî 1325; Sahih Muslim 945). ﷺ',
      "Piştî merasîma cenaze, alîkariya şuştin û definkirinê li gorî îmkana xwe û duakirina miriyan ji mafên misilmanan li ser yekî din e. Bi laş bi rûmet derman bikin û ji zêdeperedanê an kiryarên bê delîl dûr bixin.",
    ],
    actions: [
      "Gava ku di civata we de cenazeyek hat ragihandin zû bersiv bidin.",
      "Nimêj û çûna xwe ji bo Xwedê mebest bikin, ne ji bo nîşandana civakî.",
      "Ji bo hewcedariyên pratîk ên malbatê gava ku hûn dikarin bi rêzdarî bikin, bibin alîkar.",
    ],
    hadith: [
      {
        excerpt:
          "Heya ku nimêja cinazê bike, kesê ku heta nimêja cenazê bike, qiratekî wî û yê ku heta definkirinê biçe, du qirat jê re hebe, her yek wek çiyayekî mezin.",
      },
      {
        excerpt:
          "Kî ji ber îmanê û ji bo îkramê li pey cenazê misilmanekî biçe û heta nimêj bê kirin û definkirin biqede, bi du qiratan vegere...",
      },
    ],
  },
  {
    title: "Şuştin û kefenkirin",
    summary: "Gusla mirî û kafanek sade - rûmeta bê zêdegavî.",
    body: [
      "Misilmanên ku dimirin (ji bilî şehîdên qada şer di hukmê klasîk de) bi şuştina paqijkirinê têne şuştin, paşê bi qumaşê spî yê paqij têne pêçandin. Umm Atiye radigihîne ku Pêxember (s.a.a) di derbarê şuştina keça xwe de wiha gotiye: “Sê an jî pênc caran, yan jî zêdetir, ger te guncav dît, wê bi av û sidr bişo û di dawîyê de kamfor an jî hinek kefûr bişo.” (Sahih el-Buxarî 1253). ﷺ",
      "Aîşe radigihîne ku Resûlê Xuda [dirûd û silavên Xuda lê bin] di sê cil û bergên pembû yên spî yên Yemenî de, ku di nav wan de ne kiras û ne jî turban hebû (Sahih el-Buxarî 1264; Sahih Muslim 941). Sadebûn sunnet e; pêşandanên giranbuha mînaka pêxemberî berovajî dikin. ﷺ",
      "Kî kê dişo, çend cil û bergên jin û mêran, û hûrguliyên girêdayî wan ferqên medhhebî hene. Pêdivî ye ku malbat rêberek herêmî ya zanyar an karûbarê cenazeyê ku bi pratîka dibistanê dizane bişopînin - ev pêşnuma ne pirtûkek şuştinê ye.",
    ],
    actions: [
      "Dema ku gengaz be kesên pêbawer ên ji heman zayendê yên mirî tayîn bikin.",
      "Kefen sade û paqij bihêlin - qumaşê spî modela pêxemberî ye.",
      "Ji wênekêşandin an eşkerekirina laş bêyî hewcedariyê dûr bixin.",
    ],
    hadith: [
      {
        excerpt:
          "Ger we pêwîst dît, wê sê caran, an pênc, an jî zêdetir bi av û sidrê bişo û di şuştina dawî de bixin kamforê an hindek kamforê.",
      },
      {
        excerpt:
          "Resûlê Xuda [dirûd û silavên Xuda lê bin] di sê kincên pembû yên spî yên Yemenê de bû; ne kirasek û ne jî turbanek di nav wan de bû. ﷺ",
      },
    ],
  },
  {
    title: "Dema girtina çavên mirî",
    summary: "Duayek pêxemberî di dema mirinê de.",
    body: [
      'Ummu Seleme radigihîne ku Resûlê Xuda [dirûd û silavên Xuda lê bin] dema ku çavên wî li Ebû Seleme dibûn hat. Wî ew girt û got: "Dema ku can tê girtin, çav li pey wî tê" û mirovên mala wî giriyan. Paşê wî hînî wan kir ku tenê tiştên qenc bibêjin, ji ber ku melaîket ji gotina wan re amîn dibêjin, û wî ji Ebû Seleme re dua kir (Sahih Muslim 920). ﷺ',
      "Ketina Hisnul Muslim a li jêr hevokê peyva ku di girtina çavan de tê bikar anîn diparêze. Bi nermî biaxive, ji nalîna ku Pêxember ﷺ qedexe kiriye dûr bikevin û bi gotinên xweş û lêborînê bipeyivin.",
    ],
    actions: [
      "Çavên xwe bi nermî bigrin û duaya rastîn bikin.",
      "Bînin bîra malbatê ku baş biaxivin.",
    ],
    hadith: [
      {
        excerpt:
          "Dema ku çavên Ebû Seleme li ber çavan bûn, Pêxember (s.a.a) ew girtin û got ku dema ku can tê girtin çav li pey wî tê, paşê hînî malbetê kir ku tenê bi tiştên qenc biaxivin. ﷺ",
      },
    ],
  },
  {
    title: "Meriv çawa Janazah dua bike",
    summary: "Bi çar tekbîran nimêja rawestayî - bê ruku û sucûd.",
    body: [
      "Nimêja cinazê li ser piyan tê kirin. Ne ruku, ne sucûd û ne jî ezan û îqamet heye. Li gorî raporên Enes û Semûrah (li Ebû Dawûd 3194 û rîwayetên pê ve binere) îmam li serê mirîyekî nêr an jî li nîvê mirîyekî jin radiweste, û civat li paş rêzan çêdike.",
      "Nimêj ji çar tekbîran pêk tê. Piştî ya yekem sûreya Fatîhê tê xwendin (Buxarî 1335). Piştî tekbîrên paşî selewat li ser Pêxember (s.a.w) û ji bo miriyan dua tê kirin. Nimêj bi teslimê diqede. Cabir daye zanîn ku Pêxember (s.a.a) nimêja cenazê ya Negus (Padîşahê Eyyûbiyan) kiriye û çar tekbîr gotiye (Sahih el-Buxarî 1334). ﷺ ﷺ",
      "Kesên ku dereng ji tekbîrê derdixin, divê li pey mela bikevin û tiştên ku ji dest dane li gorî qaîdeya dibistana xwe ji bo girtina deqê temam bikin - ji îmam an mamosteyek herêmî bipirsin ka nebawer in.",
    ],
    actions: [
      "Di rêzan de rawestin; ruk û secdê neke.",
      "Bi îmam re çar tekbîran bêje.",
      "Piştî tekbîra minasib ji bo mirî duayên dilpak bikin.",
    ],
    hadith: [
      {
        excerpt: "Pêxember (s.a.a) nimêja cenazê Negus kir û çar tekbîr got. ﷺ",
      },
      {
        excerpt: "Îbn Ebbas nimêja cinazê kir û Fatîhe xwend û got ji sunnetê ye.",
      },
    ],
  },
  {
    title: "Duas di nimêja cenaze de (mezin)",
    summary: "Peyvên rastîn ên Hisnul Muslim ji bo miriyan.",
    body: [
      "Piştî tekbîran, dilê Cenazeyê ji bo miriyan dua ye - ji Xwedê bixwaze ku wan efû bike, rehmê li wan bike û bihiştê bide wan. Di Hisnul Muslim de ji Pêxember (s.a.a) çend peyvên resen hatine parastin. ﷺ",
      "Duaya girêdayî li jêr vekin da ku bi Erebî, wergêr û wateyê bixwînin. Hûn dikarin ji yek peyvek rastîn hîn bibin; dilpakiyê ji dirêjbûnê zêdetir girîng e.",
    ],
    actions: [
      "Bi kêmanî yek dua Janazah ya rastîn ji bîr bikin.",
      "Dema ku hûn beşdar bibin ji bo hemî miriyên misilman dua giştî bikin.",
    ],
  },
  {
    title: "Zêdetir duayên nimêja cenaze",
    summary: "Gotinên din ên rast ji Hisnul Muslim.",
    body: [
      "Hisnul Muslim gotinên din ên cenaz-nimêjê yên ku ji Pêxember ﷺ hatine hînkirin diparêze. Wan di zivirandinê de bikar bînin an yê ku civata we çêtirîn dizane fêr bibin.",
      "Ji bo zarokek mirî, duayên taybetî ji Xwedê dixwazin ku zarok ji dêûbavan re bibe pêşeng û xelata hilanîn - li mijara din binêre.",
    ],
  },
  {
    title: "Dua nimêja cenazê #3",
    summary: "Gotinek din a rastîn ji bo miriyê mezin.",
    body: [
      "Ji bo nimêja cenazê gotineke din a Hisnul Muslim. Piştî tekbîra minasib wek ehlaqê melayê we bixwîne.",
    ],
  },
  {
    title: "Dua nimêja cenazê #4",
    summary: "Peyveke çaremîn a rast ji qanûnê sunnetê.",
    body: [
      "Hisnul Muslim vê duaya cinaz-nimêjê ya din jî vedihewîne. Rastî û hebûna dil li ser berhevkirina her gotinê bi yekcarî hilbijêrin.",
    ],
  },
  {
    title: "Dua ji bo zarokek mirî",
    summary: "Duayên pêxemberî yên taybetî dema ku mirî zarokek e.",
    body: [
      "Dema ku mirî zarok be, duayên resen ji Xweda dixwazin ku zarok ji dêûbavan re bike xezîneyek embarkirî, pêşeng û şefaetkarê bersivdayînê. Nivîsên Hisnul Muslim li jêr wan gotinan diparêzin.",
      "Malbatê bi hêviya rehma Xwedê teselî bikin û ji ayînên îcadkirî dûr bikevin. Heman pêkhateya Cenazeyê ya çar-tekbîr derbas dibe; naveroka dua ew e ku diguhere.",
    ],
    actions: [
      "Dema ku pêdivî ye duayên taybetî yên zarokan bikar bînin.",
      "Piştgiriya dêûbavên xemgîn bi hebûn û alîkariya helal bikin.",
    ],
  },
  {
    title: "Cenazeyê zarok dua #2",
    summary: "Peyva duyemîn Hisnul Muslim ji bo zarokek mirî.",
    body: [
      "Gotineke din a rast ji bo nimêja cenazeyê zarokek, ku di Hisnul Muslim de hatî parastin.",
    ],
  },
  {
    title: "Gor û gor",
    summary: "Daxistina laş, ber bi qibleyê ve û piştî definkirinê dua.",
    body: [
      "Mirî li erdê ber bi qibleyê ve, bi rûmet û bêyî ku dereng bikeve ji ya ku amadekarî hewce dike, tê veşartin. Pêxemberê Xuda [dirûd û silavên Xuda lê bin] gotiye: «Li ser cenazê bilez be...» (Sahih el-Buxarî 1315 - Lezkirina cenazê). ﷺ",
      "Dema ku mirî di gorê de tê danîn, di Hisnul Muslim de duayek rastîn tê parastin. Piştî definkirinê, Pêxember (s.a.a.) li ser gorê radiwestiya û digot: 'Ji birayê xwe re efûyê bixwaze û jê bixwaze ku ew sax be, ji ber ku niha jê tê pirsîn. ﷺ",
      "Çêkirina avahiyên xemilandî yên li ser goran, çîpkirina wan ji bo xemilandinê, an nivîsandina ku mezinbûnê teşwîq dike, di raporên rastîn de hişyarî tê dayîn. Li cihê ku qanûn û adetên herêmî destûr didin nasnameyê, nîşana hêsan bihêlin.",
    ],
    hadith: [
      {
        excerpt:
          "Di merasîma cenaze de bilez be: eger ew rast bû, hûn wê berbi qenciyê bilezînin; eger wekî din, hûn xerabiyê ji stûyê xwe derdixin.",
      },
      {
        excerpt: "Ji bo birayê xwe efûyê bixwaze û sax be, çimkî niha jê tê pirsîn.",
      },
    ],
  },
  {
    title: "Piştî definkirina miriyan",
    summary: "Dua ji bo bîhnfirehiya li ser gorê.",
    body: [
      "Piştî definkirinê, ji Pêxember (s.a.a). Gotina Hisnul Muslim li jêr ji bo piştî definkirinê ye. ﷺ",
      "Sedeqeya domdar, dua, û cîbicîkirina îradeyên rewa yên mirî bi izna Xwedê feydeyê dide wan - bêyî îcadkirina merasîmên salane yên ku delîl tune.",
    ],
    actions: [
      "Piştî definkirinê li ser gorê dua bikin.",
      "Ji bo miriyan dua û sedeqeya taybet bidomînin.",
    ],
  },
  {
    title: "Serdana goran",
    summary: "Di dema serdana goran de silava pêxemberî.",
    body: [
      "Ziyareta goran jiyana axretê tîne bîra mirov. Buraideh radigihîne ku Resûlê Xuda [dirûd û silavên Xuda lê bin] wan hîn dikir ku dema derdiketin goristanê digotin: silava silavê li rûniştvanên xaniyan ên di nav bawermend û mislimanan de be, bi îzna Xwedê em ê bi wan re bibin yek û selametiyê ji me û wan re bixwaze (Sahih Muslim; ﷺ",
      "Ketina Hisnul Muslim li jêr wê silavê diparêze. Serdanê bêyî girî, alîkarî ji miriyan, an rîtuelên bê delîl bihêlin.",
    ],
    actions: [
      "Bi gotina rast silavan li niştecihên goran bikin.",
      "Li mirinê bifikire û kirinên rast nû bike.",
    ],
    hadith: [
      {
        excerpt:
          "Silav li we be ey ey rûniştevanên xaniyan di nav bawermend û misilmanan de. Em ê - bi îzna Xwedê - bi we re bibin. Em ji Xweda re sebrê ji bo me û we dixwazin.",
      },
    ],
  },
  {
    title: "Bîranîn û xeletiyên hevpar",
    summary: "Ji şînê, ji derengmayîna pêşandanê û rîtuelên bêbingeh dûr bisekinin.",
    body: [
      "Pêxemberê Xuda [dirûd û silavên Xuda lê bin] girî li ser miriyan heram kiriye û şînê bi hêsir girtiye. Ebdullah îbn Umer ragihandiye ku Se'd ibn Ubadeh di merasîmekê de giriyaye û Pêxember (s.a.a) gotiye ku Xwedê ne ji ber rondikên çavan û ne jî ji xemgîniya dil ceza dike, lê ji ber vê yekê ew ceza dide zimanê xwe (Sahih el-Buxarî 1304). ﷺ ﷺ",
      "Ji bo kombûnên bi prestîj definkirinê dereng mekin, li ser kefen û cejnê xerc nekin dema ku xizanan îhmal nekin. Nûjeniyên ku ji cenazeyan re bêyî bingehek rastîn têne veguheztin nexwînin an jî pratîk nekin. Sersaxiyê, duaya bêdeng û alîkariya pratîkî ya ji bo malbatê rêya sunnetê ye.",
      "Di dibistan û serdeman de tevlêbûna jinan a nimêj û definkirinê bi hûrgulî tê nirxandin; rêberiya herêmî ya pêbawer bişopînin ku hem dilovanî û hem jî sînorên pêxemberî rêz digire.",
    ],
    disclaimer:
      "Pêşniyara perwerdehiyê - ne pirtûkek rêveberê cenaze an fetwa. Divê pratîka dibistana herêmî ya ji bo şuştin, kefen û qaîdeyên goristanê bi kesên jêhatî re bêne pejirandin.",
    actions: [
      "Bêyî girî an axaftina qedexe xemgîn bibin.",
      "Lezgîniya definkirina bi rûmet.",
      "Bi xwarin û kar û baran re alîkariya malbatê bikin bêyî ku wan bi zêdegaviyê bar bikin.",
    ],
    hadith: [
      {
        excerpt:
          "Xwedê ne ji ber rondikên çavan û ne jî ji xemgîniya dil ceza dike, lê ji ber vê yekê ceza dike an rehmê dike - û bi zimanê xwe îşaret kir.",
      },
    ],
  },
  // --- v2 appended topics (keep index-aligned with English) ---
  {
    title: "Tekbîr bi tekbîr — gavên nimêjê",
    summary: "Lîsteya pratîk a çar tekbîran û ya di navbera wan de.",
    body: [
      "Tekbîra yekem: destan rake (li gorî dibistana xwe), Allahu Ekber bêje, paşê Sûreya el-Fatîhê bixwîne. Îbn Ebbas di nimêja cenazê de Fatîhe xwend û got ku ew ji sunnetê ye (Sahih el-Buxarî 1335).",
      "Tekbîra duyem: li ser Pêxember ﷺ selewat bişîne — heman selewata Îbrahîmî ya di teşehhudê de ji bo vê gavê bi berfirehî tê hînkirin. Tekbîra sêyem: ji bo mirî duaya dilpak bike (gotinên Hisnul Muslim di vê rêberê de). Tekbîra çarem: gelek zanyar paşê duayeke kurt a giştî dikin, paşê bi teslimê ber bi rastê (û çepê, li gorî dibistanê) diqedînin.",
      "Ruku, sucûd an rûniştin nîne. Hemû demê raweste. Heke çend cenaze hebin, di gelek civatan de yek Janazah bi nîyetê ji bo hemûyan tê kirin — li pey îmamê bikeve. Cihê selewat û duayê dikare hinekî bi medhhebê biguhere; çarçoveya çar tekbîran hevpar e.",
    ],
    madhhabNote:
      "Pirtûkên Hanefî, Malikî, Şafiî û Hanbelî li ser rakirina destan di her tekbîrê de û dema rastîn a duayê cuda ne. Li pey îmamê li ber xwe bikeve.",
    actions: [
      "Rêza çar tekbîran berî ku hewce bike fêr bibe.",
      "Fatîhe, selewat û herî kêm yek duaya cenazê ji bîr bike.",
    ],
    hadith: [
      {
        excerpt: "Îbn Ebbas nimêja cenazê kir û Fatîhe xwend û got ku ew ji sunnetê ye.",
      },
    ],
  },
  {
    title: "Duayên ji bo mêr, jin û zarokan",
    summary: "Heman gotinên pêxemberî — cînavên erebî li mirî biguncîne.",
    body: [
      "Hisnul Muslim (û berhevokên klasik ên hedîsê) duayên Janazah bi piranî bi şêweya nêr tomar dikin. Ev ne wateya duayeke veqetandî û 'afirandî' ji bo jinan e. Zanyarên sereke hîn dikin ku tu dikarî gotina nêr bi nîyetê ji bo kesî bihêlî, an — çêtir û bi gelemperî — rêzimanê li mirî biguherînî: لَهُ / هُ / هِ → لَهَا / هَا; عَبْدُكَ → أَمَتُكَ; ابْنُ أَمَتِكَ → ابْنَةُ أَمَتِكَ; û ji bo keçekê اجْعَلْهُ → اجْعَلْهَا, شَفِيعًا مُجَابًا → شَفِيعَةً مُجَابَةً.",
      "Ji bo jineke mirî, hin zanyar li ser hevoka 'hevalekî ji hevalê wê çêtir' (زَوْجًا خَيْرًا مِنْ زَوْجِهَا) baldarî pêşniyar dikin — dibe ku ew di Bihiştê de bi mêrê xwe ve were yekkirin; tu dikarî wê bendê derxînî an gotineke giştî bihêlî. Ji bo zarokan, têketinên Hisnul ên taybet ên zarokan (hisn-160, hisn-161) bikar bîne, ne tenê nivîsên mezinan ên li ser lêborînê.",
      "Gotina hevpar 'nêr û jinên me efû bike' (hisn-157) jixwe her du zayendan bê guhertin digire. Em ji guncandina rêzimanî ya nivîsên rastîn zêdetir Erebîya nû nafirînin — duaya mezin a girêdayî wek bingeh veke û nexşeya cînavên jorîn bikar bîne.",
    ],
    madhhabNote:
      "Hem hiştina şêweyên nêr bi nîyetê û hem guncandina şêweyên mê di nav zanyarên sereke de qebûl e. Heke nebawer bî, hisn-157 (nêr û jin) bikar bîne an ji îmamê bipirse.",
    actions: [
      "Ji bo duaya ku tu ji bîr dikî, guhertina cînavên mê pratîk bike.",
      "Ji bo yên ku negihîştine pêgihîştinê duayên taybet ên zarokan bikar bîne.",
      "Rastîniyê ji pirtûkên dirêj ên nepejirandî çêtir bibîne.",
    ],
    appLinks: [{ label: "Duaya cenazê ya mezin #1" }],
  },
  {
    title: "Şehîd, windabûna zarokê û rewşên taybet",
    summary: "Gava hukmên şuştin an Janazah ji rewşa asayî cuda dibin.",
    body: [
      "Şehîdên qada şer ên ku di şer de dimirin, di hukmê klasîk ê ji Uhudê de, bêyî gusla asayî di kincên xwe de têne definkirin; Pêxember ﷺ ferman da ku şehîdên Uhudê bi xwîna xwe û bêyî şuştinê werin definkirin (Sahih el-Buxarî 1346). Kategoriyên din ên ku di xelatê de 'şehîd' têne gotin (mînak, taûn, xeniqîn) bi asayî şuştin û Janazah digirin — ji bo rewşên sînorî ji zanyarekî bipirse.",
      "Ji bo windabûna zarokê an zarokê mirîyê zayînê, dibistan li ser dema nimêja cenazê û şuştina tam cuda ne (pir caran girêdayî ye ka şeklekî naskirî an qonaxa pehînkirina ruh hatiye dîtin). Hedîsek teşwîq dike ku li ser windabûnê nimêj were kirin û ji bo dêûbavan lêborîn û rehm were xwestin (Ebû Dawûd 3180). Li şûna texmînê, komîteya cenazê ya medhheba xwe bişopîne.",
      "Ji bo xizmên ne-misilman nimêja Janazah a misilman nabe; dilovanî, alîkariya definkirinê ya rewa li cihê guncav, û xemgîniya şexsî ji nimêja îbadetê ya bawermendan cuda ne. Her dem rewşên taybet bi rêberiya herêmî ya jêhatî pejirîne.",
    ],
    madhhabNote:
      "Pênaseyên şehadeta qada şer, qonaxên windabûnê û nimêj li ser zarokê mirîyê zayînê bi dibistanê diguheherin. Ev mijar pirsgirêkan nîşan dide — fatwa nîne.",
    disclaimer:
      "Hukmên taybet hesas in. Berî ku tevgerî, bi zanyarekî jêhatî an xizmeta cenazê ya civata xwe pejirîne.",
    actions: [
      "Şehîdekî qada şer li dijî rêbera zanyaran nemeşo.",
      "Li ser rewşên windabûn an zayîna mirî ji komîteya cenazê bipirse.",
    ],
    hadith: [
      {
        excerpt:
          "Pêxember ﷺ ferman da ku şehîdên Uhudê bi xwîna xwe werin definkirin, û ew nehatin şuştin.",
      },
      {
        excerpt:
          "Nimêja cenazê li ser windabûnê tê kirin, û ji bo dêûbavan lêborîn û rehm tê xwestin.",
      },
    ],
  },
  {
    title: "Janazah di nebûnê de",
    summary: "Pêxember ﷺ ji bo Negus nimêj kir dema laş dûr bû.",
    body: [
      "Cabir radigihîne ku Pêxember ﷺ derket cem Sehabeyên xwe, wan rêz kir, û ji bo Negus (el-Necashî), padîşahê Hebeşê yê ku li derve miriye, çar tekbîr got (Sahih el-Buxarî 1334; Sahih Muslim 952). Ev delîla sereke ye ji bo Selata el-Janazah di nebûnê de (alā al-ghā'ib).",
      "Dibistan li ser firehiya vê pêşengiyê cuda ne: hin wê bi rewşên wek Negus sînordar dikin (bêyî nimêja misilman a herêmî), yên din gava laş dûr be berfirehtir destûr didin. Gava laş amade ye û civat dikare nimêj bike, Janazaha herêmî derbas neke. Ji zanyarekî herêmî yê pêbawer bipirse ka di dibistana te de nimêja nebûnê kengê guncav e.",
      "Şêwe heman nimêja çar tekbîran e; nîyet ji bo miriyê nebûyî ye. Heman duayên rastîn bikar bîne, zayendê li gorî hewceyê biguncîne.",
    ],
    madhhabNote:
      "Çarçoveya Janazaha nebûnê xaleke naskirî ya cudahiyê ye. Pratîka îmamên jêhatî yên civata xwe tercih bike.",
    actions: [
      "Her dema laş amade be, herêmî nimêj bike.",
      "Berî ku Janazaha nebûnê wek bûyereke giştî organîze bike, bipirse.",
    ],
    hadith: [
      {
        excerpt: "Pêxember ﷺ nimêja cenazê ji bo Negus kir û çar tekbîr got.",
      },
      {
        excerpt: "Resûlê Xuda ﷺ Sehabeyan rêz kir û ji bo Negus bi çar tekbîran nimêj kir.",
      },
    ],
  },
  {
    title: "Li ser nivîna mirinê — gotinên dawî",
    summary: "Miriyê nêzîk bi nermî bişîne ku la ilaha illallah bêje.",
    body: [
      "Pêxember ﷺ got: 'Miriyên xwe bişînin ku la ilaha illallah bêjin' (Sahih Muslim 916; Ebû Dawûd 3117). Hisnul Muslim rêberiyê diparêze ku kî gotinên wî yên dawî 'Tu kesî heqê perestinê tune ji bilî Allah' bin, ew ê bikeve Bihiştê (hisn-153, ji Ebû Dawûd 3116).",
      "Bi nermî û bêyî hişkî bişîne; zorê nede û nîqaş neke. Yên nêzîkî mirinê jî dikarin bi gotinên hêviyê yên rastîn ên Hisnul Muslim werin rehetkirin (hisn-150–152). Gava ruh tê girtin çavan bigire û duaya girtina çavan bikar bîne (mijara berê).",
      "Ji nalîna bilind û axaftina ku Allah hêrs dike dûr bikeve. Divê malbat tiştê qenc bêje, ji ber ku melaîket ji gotinên wan re amîn dibêjin (Sahih Muslim 920).",
    ],
    actions: [
      "Bi nermî şehadetê bîne bîra miriyê nêzîk.",
      "Odeyê aram bihêle û bi axaftina qenc dagire.",
    ],
    hadith: [
      {
        excerpt: "Miriyên xwe bişînin ku bêjin: la ilaha illallah.",
      },
      {
        excerpt:
          "Kî gotinên wî yên dawî 'Tu kesî heqê perestinê tune ji bilî Allah' bin, ew ê bikeve Bihiştê.",
      },
    ],
    appLinks: [{ label: "Duayên hêviya jiyanê" }, { label: "Girtina çavan" }],
  },
  {
    title: "Teseliye û xemgînan",
    summary: "Zindiyan bi duaya belaya pêxemberî rehet bike.",
    body: [
      "Ummu Seleme radigihîne ku Resûlê Xuda ﷺ gotiye: 'Tu misilman nîne ku belayê bikeve û paşê ya ku Allah ferman kiriye bêje — \"Em ên Allah in û em ê vegerin cem Wî. Ya Allah, di belaya min de min xelat bike û ji min re tiştekî çêtir biguherîne\" — lê Allah ê ji wan re tiştekî çêtir biguherîne' (Sahih Muslim 918). Hisnul Muslim vê gotinê diparêze (hisn-154).",
      "Bi gotinên kurt û rast teseliye bide; ji bo malbata mirî xwarin amade bike li şûna ku wan bi mêvandariyê bar bike (Ebû Dawûd 3132 — rapor li ser malbata Cefer). Ji merasîmên nûjen ên rojên diyarkirî yên bê delîl dûr bikeve, lê duaya taybet, sedeqe û dilovaniyê berdewam bike.",
      "Xemgîniya bi hêsir destûr e; nalîn, lêdana eniyan û qetandina kincan qedexe bûn. Piştî definkirinê jinebî, sêwî û yên girêdayî bi alîkariya rewa piştgirî bike.",
    ],
    actions: [
      "Duaya belayê hînî xemgînan bike.",
      "Li şûna ku li ziyafetê hêvî bike, bi xwarin û karan alîkar be.",
      "Duaya aram û sedeqeyê ji bo mirî berdewam bike.",
    ],
    hadith: [
      {
        excerpt:
          "Tu misilman nîne ku belayê bikeve û gotinên fermanî yên vegerê cem Allah û guhertina bi çêtirî bêje, lê Allah ê bi tiştekî çêtir biguherîne.",
      },
    ],
    appLinks: [{ label: "Armancên sedeqeyê" }],
  },
];
