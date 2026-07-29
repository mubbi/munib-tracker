import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Kurdish (Kurmanji) translation overlay for the Learn Friday (Jumu'ah) guide. Mirrors the
// order of FRIDAY_GUIDE_TOPICS in ../friday-guide.ts (index-aligned); untranslated entries
// fall back to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const FRIDAY_GUIDE_TOPICS_KU: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Rûmetên roja Îniyê",
    summary:
      "Roja çêtirîn a rojê lê hiltê — afirandina Adem, û lêbihûrandin di navbera du Îniyan de.",
    body: [
      "Îniye (Yewmu'l-Cumua) roja civînê ya heftane ya vê Ummetê ye. Ebû Hureyre rivayet kir ku Pêxemberê Xwedê ﷺ got: 'Roja çêtirîn a rojê lê hiltê Îniye ye; di wê rojê de Adem hate afirandin, di wê rojê de ew ket Bihuştê, di wê rojê de ew jê hate derxistin, û Roja Dawî tenê di Îniyê de dê pêk were' (Sahîh Muslîm 854).",
      "Îbadeta wê jî sozeke berdewam a lêbihûrandinê digre. Ebû Hureyre rivayet kir ku Pêxember ﷺ got: 'Kî di Îniyê de xwe bişo, paşê were nimêja Îniyê, û bibihîze û bêdeng bimîne dema îmam xutbe dide, gunehên wî di navbera wê Îniyê û ya pêş de tê lêbihûrandin, digel sê rojên din jî' (Sahîh Muslîm 857).",
      "Ev rûmet vexwendinek in ji bo amadebûna zû, bibihîstina bi baldarî, û mêzekirina Îniyê wek nûavakirineke giyanî ya heftane — ne tenê wek rojeke betlaneyê.",
    ],
    hadith: [
      {
        excerpt:
          "Roja çêtirîn a rojê lê hiltê Îniye ye; di wê rojê de Adem hate afirandin, di wê rojê de ew ket Bihuştê, di wê rojê de ew jê hate derxistin, û Roja Dawî tenê di Îniyê de dê pêk were.",
      },
      {
        excerpt:
          "Kî di Îniyê de xwe bişo, paşê were nimêja Îniyê, û bibihîze û bêdeng bimîne dema îmam xutbe dide, gunehên wî di navbera wê Îniyê û ya pêş de tê lêbihûrandin, digel sê rojên din jî.",
      },
    ],
    actions: [
      "Di sibeha Îniyê de niyet bikin: xwerûştin, cilên herî baş, û zû hatin.",
      "Xutbeyê wek îbadetê bibînin — bêdengî û baldarî parçeyek ji xelatê ne.",
    ],
  },
  {
    title: "Îniye — erka heftane",
    summary:
      "Nimêja Îniyê ya bi civatê ku di Qur'anê de hatiye ferzkirin, ku li şûna Nimêja Nîvroyê ji bo kesên ku beşdar dibin dimeşe.",
    body: [
      "Xwedê nimêja Îniyê bi navê wê ferz dike: 'Gelî ên ku baweriyê tînin, dema ku ji bo nimêjê di roja Îniyê de bang tê kirin, biz bezin ber bi bîranîna Xwedê ve û bazirganiyê berdin. Ev ji we re çêtir e, eger hûn bizanibûna' (Qur'an, 62:9). Ayetên li dû wê destûra belavbûnê û lêgerîna kerema Xwedê piştî nimêjê vedigerînin (Qur'an, 62:10–11).",
      "Îniye ji xutbeyeke duqat û paşê du rikatan pêk tê ku bi dengekî bilind li pey îmam tê xwendin, û li şûna Nimêja Nîvroyê ji bo kesên ku beşdar dibin dimeşe. Tariq ibn Şihab rivayet kir ku Pêxember ﷺ got nimêja Îniyê ya bi civatê erkeke girêdayî ye li ser her Misilmanî, ji bilî çar kesan: koleyek, jinek, zarokek, an nexweşek (Sunen Ebî Dawûd 1067).",
      "Bêhûrmetî hişyariyeke giran e: Ebû el-Ca'd rivayet kir kî sê nimêjên Îniyê ji ber bêîlmî berde, Xwedê li ser dilê wî mihrê datîne (Sunen en-Nesaî 1369). Di dema xutbeyê de, axaftina vala xelatê windа dike — Ebû Hureyre rivayet kir eger hûn ji hevalê xwe re bêjin 'Bêdeng be' dema îmam diaxive, we bi xeletî axaftiye (Sahîh el-Buxarî 934).",
      "Piştî Îniyê pêşniyar dikin çar rikatan bixwînin: Ebû Hureyre rivayet kir ku Pêxember ﷺ got, 'Dema yek ji we nimêja Îniyê xwend, dû re çar (rikat) bixwîne' (Sahîh Muslîm 881).",
    ],
    quran: [
      {
        excerpt:
          "Gelî ên ku baweriyê tînin, dema ku ji bo nimêjê di roja Îniyê de bang tê kirin, biz bezin ber bi bîranîna Xwedê ve û bazirganiyê berdin. Ev ji we re çêtir e, eger hûn bizanibûna. Û dema nimêj bi dawî bû, li ser rûyê zeviyê belav bibin û ji kerema Xwedê bigerin...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Nimêja Îniyê ya bi civatê erkeke girêdayî ye li ser her Misilmanî, ji bilî çar kesan: koleyek, jinek, zarokek, an nexweşek.",
      },
      { excerpt: "Kî sê nimêjên Îniyê ji ber bêîlmî berde, Xwedê dê li ser dilê wî mihrê deyne." },
      {
        excerpt:
          "Eger hûn ji hevalê xwe re bêjin 'Bêdeng be' di Îniyê de dema îmam xutbe dide, we bi xeletî (laghawta) axaftiye.",
      },
      { excerpt: "Dema yek ji we nimêja Îniyê xwend, dû re çar (rikat) bixwîne." },
    ],
    actions: [
      "Rêwîtiya xwe wisa plansaz bikin ku hûn beriya destpêkirina xutbeyê bigihîjin mizgeftê.",
      "Têlefonan bêdeng bihêlin û ji axaftinê di dema xutbeyê de dûr bimîninin.",
      "Piştî Îniyê çar rikatan bixwînin dema hûn karibin.",
    ],
    appLinks: [{ label: "Salahê fêr bibin — dersa Îniyê" }, { label: "Şopîner veke" }],
    disclaimer:
      "Hejmara herî kêm a beşdaran ji bo Îniyeke rewa, û gelo jin û rêwiyan tê teşwîqkirin ku beşdar bibin, pirsên fiqhî yên hûrgilî ne ku li gorî mezheban û edeta herêmî cuda ne. Jin, rêwî, û nexweşên ku beşdar nabin li şûna wê Nimêja Nîvroyê dikin. Ev naverokeke perwerdehiyê ye, ne fetwa.",
  },
  {
    title: "Amadebûn ji bo Îniyê",
    summary: "Xwerûştin, cilên paqij, bîhnxweş, û zû hatin ji bo xelata herî mezin.",
    body: [
      "Amadebûn parçeyek ji sunetê Îniyê ye. Ebû Seîd el-Xudrî rivayet kir ku Pêxemberê Xwedê ﷺ got: 'Xwerûştin di Îniyê de ferz e li ser her kesê ku gihîştiye çaxa cihînbûnê' (Sahîh Muslîm 846). Peyveke wek vê di Sahîh el-Buxarî (877) de jî xwerûştina Îniyê bi kesên ku gihîştine çaxa cihînbûnê ve girê dide.",
      "Ji xwerûştinê wêde, Pêxember ﷺ teşwîq kir ku meriv baştirîn xuya bike. Selman el-Farisî rivayet kir ku Pêxember ﷺ got: 'Kî di Îniyê de xwe bişo, xwe qasî ku dikare paqij bike, dû re rûn (porê) an bîhnxweşa xwe bi kar bîne, dû re derkeve, û bêyî ku di navbera du kesan de bişemitê li cihê xwe rûne, guhdariya îmam bike heta biqede, dû re nimêja ku jê re hatiye ferzkirin bixwîne — gunehên wî di navbera wê Îniyê û ya pêş de tê lêbihûrandin' (Sahîh el-Buxarî 883).",
      "Zû hatin xelatê pirjimar dike. Ebû Hureyre rivayet kir kî di saeta yekem de biçe wek kesê ku hêştirek goriyê dide, dû re çêyek, dû re berxek, dû re mirîşkek, dû re hêkek — û dema îmam derket, milyaket kaxezên xwe digirin û guhdariya bîranînê dikin (Sahîh el-Buxarî 881).",
    ],
    hadith: [
      { excerpt: "Xwerûştin di Îniyê de ferz e li ser her kesê ku gihîştiye çaxa cihînbûnê." },
      {
        excerpt:
          "Xwerûştin di Îniyê de ferz e li ser her mêrekî Misilman ê ku gihîştiye çaxa cihînbûnê.",
      },
      {
        excerpt:
          "Kî di Îniyê de xwe bişo, xwe qasî ku dikare paqij bike, dû re rûn an bîhnxweşa xwe bi kar bîne, dû re derkeve, û bêyî ku di navbera du kesan de bişemitê li cihê xwe rûne, guhdariya îmam bike heta biqede, dû re nimêja ku jê re hatiye ferzkirin bixwîne — gunehên wî di navbera wê Îniyê û ya pêş de tê lêbihûrandin.",
      },
      {
        excerpt:
          "Kî di Îniyê de xwe bişo, dû re zû (biçe mizgeftê), wek kesê ku hêştirek goriyê daye... dû re çêyek... dû re berxek... dû re mirîşkek... dû re hêkek. Dema îmam derket, milyaket ji bo guhdariya bîranînê tên.",
      },
    ],
    actions: [
      "Di sibeha Îniyê de (an beriya çûyîna mizgeftê) xwe bişon.",
      "Cilên xwe yên herî baş û paqij li xwe bikin û eger hûn karibin bîhnxweşeke sivik bidin xwe.",
      "Zû derkevin — kesên ku herî zû tên xelata herî mezin distînin.",
    ],
    appLinks: [{ label: "Paqijiyê fêr bibin — Xwerûştin" }],
    disclaimer:
      "Gelo xwerûştina Îniyê ferzeke tund e an sunneteke bi hêz hatiye teşwîqkirin, xala cudahiyekê ya klasîk e di navbera mezheban de. Hemû li ser rûmeta wê ya mezin lihev dikin; pratîka pêbawer a civaka xwe bişopînin.",
  },
  {
    title: "Sûreya el-Kehf di Îniyê de",
    summary: "Ronahiyek di navbera du Îniyan de, û parastin di deh ayetên yekem de.",
    body: [
      "Xwendina Sûreya el-Kehf (Qur'an 18) di Îniyê de pratîkeke heftane ya delal e. Ebû Seîd el-Xudrî rivayet kir ku Pêxember ﷺ got: 'Kî Sûreya el-Kehf bixwîne di Îniyê de, ronahiyek ji bo wî di navbera du Îniyan de dê biçirûse.' Ev peyv bi rêya el-Hakim û el-Beyhaqî hatiye ragihandin û Şêx el-Elbanî wek sahîh nirxandiye; gelek civak wê wek sunneteke Îniyê ya sabît dişopînin.",
      "Ji hev cuda, deh ayetên yekem ên Sûreya el-Kehf mertaleke li dijî fîtneya Decal in. Ebû Derda rivayet kir ku Pêxember ﷺ got: 'Kî deh ayetên destpêkê ên Sûreya el-Kehf ji bîr bikir bike, ew ê ji Decal were parastin' (Sahîh Muslîm 809).",
      "Di navbera êvara Pêncşemiyê û Rojava ya Îniyê de dem bibînin ji bo xwendina sûreyê — her çend hûn nikaribin tevahiya beşê biqedînin jî, ji ayetên destpêkê dest pê bikin û çend cara ku dikarin vegerin.",
    ],
    quran: [
      {
        excerpt:
          "Hemû pesindayî ji bo Xwedê ye ê ku Pirtûk li ser xulamê xwe daxist û tê de ti xirabûn negirt... An hûn bawer dikin ku hevalên şikeftê û nivîsê di nîşanên me de tiştekî ecêb bûn?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kî Sûreya el-Kehf bixwîne di Îniyê de, ronahiyek ji bo wî di navbera du Îniyan de dê biçirûse. (Şêx el-Elbanî wek sahîh nirxandiye)",
      },
      {
        excerpt:
          "Kî deh ayetên destpêkê ên Sûreya el-Kehf ji bîr bikir bike, ew ê ji Decal were parastin.",
      },
    ],
    actions: [
      "Di Îniyê de Sûreya el-Kehf veke û bi hebûna dil çend ku dikarî bixwîne.",
      "Deh ayetên yekem ji bîr bikin an dubare bikin ji bo parastina ji Decal.",
    ],
    appLinks: [{ label: "Sûreya el-Kehf bixwîne" }],
    disclaimer:
      "Rivayeta 'ronahî di navbera Îniyan de' ne di Şeş Pirtûkan de ye; li ser bingeha pejirandineke paştir bi berfirehî hatiye pejirandin. Parastina deh ayetên yekem (Muslîm 809) bêyî nakokî sahîh e.",
  },
  {
    title: "Salawat li ser Pêxember ﷺ di Îniyê de",
    summary: "Di roja herî baş a hefteyê de, salawatan li ser Pêxember ﷺ zêde bikin.",
    body: [
      "Îniye ji bo salawatên zêde hatiye veqetandin. Ews ibn Ews rivayet kir ku Pêxember ﷺ got: 'Ji rojên we yên herî baş Îniye ye; loma di wê rojê de salawatên xwe li ser min zêde bikin, çimkî salawatên we dê li min werin pêşkêşkirin.' Wan got: 'Ya Pêxemberê Xwedê, çawa salawatên me li te werin pêşkêşkirin dema tu bibûyî ax?' Got: 'Xwedê ji erdê qedexe kiriye ku laşên pêxemberan bixwe' (Sunen Ebî Dawûd 1047).",
      "Her formula salawata pêbawer tê hesibandin — durûdên ku di nimêjê de tên hîndarkirin, an awayên dirêjtir ên ji Sunetê. Xala girîng aboriya û dilsoziya di Îniyê de ye, ne hejmareke sabît.",
    ],
    hadith: [
      {
        excerpt:
          "Ji rojên we yên herî baş Îniye ye; loma di wê rojê de salawatên xwe li ser min zêde bikin, çimkî salawatên we dê li min werin pêşkêşkirin.",
      },
    ],
    actions: [
      "Ji bo Îniyê armancekê şexsî ya salawatê bidin xwe — her çend hejmareke piçûk û domdar be jî.",
      "Eger hûn formulaeke amade dixwazin, koleksiyona durûdan di sepanê de bikar bînin.",
    ],
    appLinks: [{ label: "Durûd" }],
  },
  {
    title: "Saeta pejirandinê",
    summary: "Saetek di Îniyê de ku dua nayê redkirin — wê bi taybetî piştî 'Esrê bigerin.",
    body: [
      "Ebû Hureyre rivayet kir ku Pêxemberê Xwedê ﷺ Îniye anî bîra xwe û got: 'Di Îniyê de saetek heye ku ti xulamê Misilman lê ranebe û tiştekî ji Xwedê nexwaze bêyî ku Ew wê jê re nede' — û bi destê xwe nîşan da ku ew kurt e (Sahîh el-Buxarî 935; her wiha Sahîh Muslîm 852).",
      "Zana ji hev cuda bûne ka ev saet bi rastî kengî ye. Nêrîneke bi hêz wê di beşa dawî ya Îniyê de piştî 'Esrê datîne: Cabir ibn Abdullah rivayet kir ku Pêxember ﷺ got: 'Îniye diwanzdeh saet in, û tê de saetek heye ku ti xulamê Misilman tiştekî ji Xwedê nexwaze bêyî ku Ew wê jê re nede — loma wê di saeta dawî ya piştî 'Esrê bigerin' (Sunen Ebî Dawûd 1048).",
      "Kîjan nêrînê hûn bişopînin, Îniyê — bi taybetî pêvajoya dawî ya nîvro — bi duayeke dilsoz, îstîgfar, û salawatan tijî bikin, bi baweriya soza bersivdana Xwedê.",
    ],
    hadith: [
      {
        excerpt:
          "Di Îniyê de saetek heye ku ti xulamê Misilman lê ranebe û tiştekî ji Xwedê nexwaze bêyî ku Ew wê jê re nede — û bi destê xwe nîşan da ku ew kurt e.",
      },
      {
        excerpt:
          "Di Îniyê de saetek heye ku ti Misilman di nimêjê de nayê dîtin tiştekî ji Xwedê xwaze bêyî ku Ew wê jê re nede.",
      },
      {
        excerpt:
          "Îniye diwanzdeh saet in, û tê de saetek heye ku ti xulamê Misilman tiştekî ji Xwedê nexwaze bêyî ku Ew wê jê re nede — loma wê di saeta dawî ya piştî 'Esrê bigerin.",
      },
    ],
    actions: [
      "Piştî 'Esrê di Îniyê de, bi lîsteyeke kurt a duayan rûnên û bi hebûna dil bixwazin.",
      "Dua bi salawatan re bihewîne — herduyan di vê rojê de bi taybetî tê xurtkirin.",
    ],
    appLinks: [{ label: "Koleksiyona dua" }],
    disclaimer:
      "Dema rast a saeta pejirandî mijara cudahiya zanayan e (di dema xutbeyê de, piştî 'Esrê, û nêrînên din). Hebûna saetê bi xwe di Buxarî û Muslîm de sabît e.",
  },
];
