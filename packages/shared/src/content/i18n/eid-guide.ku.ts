import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Kurdish (Kurmanji) translation overlay for the Learn Eid guide. Mirrors the order
// of EID_GUIDE_TOPICS in ../eid-guide.ts (index-aligned); untranslated entries fall
// back to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const EID_GUIDE_TOPICS_KU: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Cejna Remezanê — cejna şikandina rojiyê",
    summary: "Roja yekem a Şewalê, dawiya rojiya Remezanê nîşan dide.",
    body: [
      "Cejna Remezanê di 1ê Şewalê de, tam piştî Remezanê, tê pîrozkirin û roja şad û spasiyê ye ji bo ku mirov karîbû heyamê hemû mehê rojî bigire û îbadetê bike. Qur'an dawiya rojiyê rasterast bi bîranîn û spasiyê ve girê dide: '...da hûn hejmarê temam bikin û Xwedê mezin bikin li ser rêberiya wî, û da hûn spasdar bibin' (Qur'an 2:185).",
      "Rojîgirtin di vê rojê de bi awakî eşkere heram e, ne tenê nayê xwestin — Pêxember ﷺ vê rojê, bi Cejna Qurbanê re, wek yek ji du rojên ku Misilmanan ferman lê hatiye kirin ku bixwin û ne rojî bigirin destnîşan kir (Buxarî 1990). Roj bi zekata fitrê û nimêja cejnê dest pê dike û bi serdana malbatê, pîroz kirina hevûdin û şadiya giştî di sînorên şerîetê de didome.",
    ],
    quran: [
      {
        excerpt:
          "...da hûn hejmarê temam bikin û Xwedê mezin bikin li ser rêberiya wî, û da hûn spasdar bibin.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ev du roj in ku Pêxemberê Xwedê ﷺ rojîgirtin lê qedexe kir: roja hûn rojiya xwe dişikênin (a Remezanê), û roja hûn ji qurbana xwe dixwin.",
      },
    ],
  },
  {
    title: "Cejna Qurbanê — cejna goriyê",
    summary: "10ê Zilheccê, bîranîna goriya Îbrahîm.",
    body: [
      "Cejna Qurbanê di 10ê Zilheccê de, Roja Qurbanê di dema Hecê de, tê pîrozkirin û amadebûna Îbrahîm ji bo goriya kurê xwe di jêrbûna Xwedê de û dilovaniya Xwedê ku ew bi qurbaniyeke mezin xelas kir tîne bîra mirov (Qur'an 37:102–107). Li gorî gelek zanyaran, ev cejna mezintir a du cejnan e û bi qedandina Hecê re li hev tê ji bo hecîyan.",
      "Wek Cejna Remezanê, rojîgirtin di vê rojê de heram e (Buxarî 1990). Awirdana wê ya sereke ya zêde qurban (udhiyah) e, ku ew kesên ku dikarin li bîra jêrbûna Îbrahîm û wek karekî îbadet û xêrxwaziyê bi hev re pêşkêş dikin.",
    ],
    quran: [
      {
        excerpt:
          "Çaxê ew (zarok) gihîşt temenê ku bi wî re bimeşiya, [Îbrahîm] got: Kurê min, min di xewnê de dît ku ez te dibirim... Û me ew bi qurbaniyeke mezin xelas kir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ev du roj in ku Pêxemberê Xwedê ﷺ rojîgirtin lê qedexe kir: roja hûn rojiya xwe dişikênin (a Remezanê), û roja hûn ji qurbana xwe dixwin.",
      },
    ],
  },
  {
    title: "Nimêja cejnê çawa tê kirin",
    summary: "Du rikat bi tekbîrên zêde — bêyî ezan û îqamet.",
    body: [
      "Nimêja cejnê du rikat e, bi civatê tê kirin bêyî ku berî wê ezan û îqamet were kirin — Cabir ibn Abdullah û Ibn Abbas herdû piştrast kirin ku di dema Pêxember ﷺ de ji bo tu cejnê ban nehatiye kirin (Sahîh Muslîm 886). Piştî nimêjê xutbe tê kirin, berevajî nimêja Înê ku xutbe pêşî tê.",
      "Berî xwendinê di her rikatê de, li ser tekbîrên asayî ên nimêjê, tekbîrên zêde (gotina 'Allahu Ekber') tê zêdekirin. Aîşe rivayet kir ku Pêxember ﷺ di herdû cejnan de di rikata yekem de heft caran û di ya duyem de pênc caran tekbîr digot (Sunen Ebî Dawûd 1149), hejmarek ku ji Abdullah ibn Amr jî hatiye rivayetkirin (Ebî Dawûd 1151).",
    ],
    hadith: [
      {
        excerpt:
          "Di roja Cejna Remezanê de dema îmam derket ne ezan hebû, ne jî piştî derketina wî; ne îqamet, ne ban, ne jî tiştekî wisa di wê rojê de hebû.",
      },
      {
        excerpt:
          "Pêxemberê Xwedê ﷺ di roja şikandina rojiyê û roja qurbanê de di rikata yekem de heft caran û di ya duyem de pênc caran tekbîr digot.",
      },
    ],
    madhhabNote:
      "Mezheb di hejmara rast a tekbîrên zêde de cûda ne. Feqîhên Şafiî, Malikî û Henbelî rivayeta heft-pênc dişopînin (Ebî Dawûd 1149/1151) — Malikî û Henbelî tekbîra vekirinê di heft de dihesibînin, ji ber vê şeş-pênc dibêjin. Mezheba Henefî li şûna wê 3 tekbîrên zêde berî xwendinê di rikata yekem de û 3 berî rukûyê di ya duyem de (6 bi tevahî) digire — nêrîna feqîhên Kûfeyê ye ku hedîsê merfû yê cuda ne piştrastkirî tune ye; hejmara tekbîrên îmamê civata xwe bişopînin.",
    actions: [
      "Bi wextê werin — ne ezan ne jî îqamet heye ku dest pêkirinê nîşan bide.",
      "Hejmara tekbîrên îmamê xwe bişopînin; pratîka her mezhebê rast e.",
      "Piştî nimêjê ji bo xutbeyê bimînin.",
    ],
  },
  {
    title: "Sunetên wê rojê",
    summary: "Xwerûşt, cilên herî baş, xwarin berî/piştî nimêjê, û du rêyên cuda.",
    body: [
      "Çend sunetên piçûk berî û piştî nimêja cejnê tê pêşniyarkirin. Di Cejna Remezanê de, Pêxember ﷺ berî ku çend xurme, bi hejmara tek, bixwe, ji bo nimêjê derneket (Buxarî 953) — berevajî Cejna Qurbanê, ku lê tê pêşniyarkirin ku meriv li bendê bimîne û piştî vegera nimêjê ji qurbanê bixwe.",
      "Xwerûştin û li xwe kirina cilên herî baş (paqij, rûmet) ji bo vê dema sunet e, li dû pratîka giştî ya hevalên Pêxember di herdû cejnan de, her çend ev rivayeta taybet ji yên din yên li vir kêmtir bi hêz e û pratîkeke ku bi berfirehî tê şopandin e, ne hedîseke bi tenê ya bi ravekê sahîh.",
      "Suneteke cuda vegera bi rêyeke ji rêya çûyînê cuda ye. Cabir ibn Abdullah rivayet kir: 'Di roja cejnê de Pêxember ﷺ (piştî kirina nimêja cejnê) bi rêyeke ji rêya çûyîna xwe cuda vedigeriya' (Buxarî 986) — bi gelemperî ev wek zêdekirina cihên ku şahidê îbadeta kesekî ne û nîşandana sembolên Îslamê bi berfirehî tê şirovekirin.",
    ],
    hadith: [
      {
        excerpt:
          "Pêxember ﷺ tu carî di roja Cejna Remezanê de (ji bo nimêjê) derneket heta ku çend xurme, bi hejmara tek, nexwar.",
      },
      {
        excerpt:
          "Di roja cejnê de Pêxember ﷺ (piştî kirina nimêja cejnê) bi rêyeke ji rêya çûyîna xwe cuda vedigeriya.",
      },
    ],
    actions: [
      "Xwe bişon û cilên xwe yên herî baş û rûmetdar li xwe bikin.",
      "Berî nimêja Cejna Remezanê xurmeyên bi hejmara tek bixwin; heta piştî nimêja Cejna Qurbanê li bendê bimînin ji bo xwarinê.",
      "Bi rêyeke ji rêya ku hûn ber bi nimêjê ve çûn cuda vegerin.",
    ],
  },
  {
    title: "Zekata fitrê — bingehên wê",
    summary: "Xêrxwaziyeke biçûk a ferz, ku berî nimêja Cejna Remezanê divê were dayîn.",
    body: [
      "Zekata fitrê (sadaqatu'l-fitr) xêrxwaziyeke cuda, ji zekata dewlemendiyê biçûktir, li ser her Misilmanî — biçûk an mezin, mêr an jin, azad an bindest — ferz e û serokê malbatê li şûna wan didaye. Ibn Umar rivayet kir ku Pêxember ﷺ li ser her Misilmanî sa'eke (nêzîkî 2-3 kg) xurme an garis ferz kir, ku berî ku mirov ber bi nimêja cejnê ve here divê were dayîn (Buxarî 1503).",
      "Armanca wê bi awakî eşkere di sunetê de hatiye gotin: 'paqijkirina rojîgir ji peyvên vala û nerind, û xwarin ji bo hejaran' (Ebî Dawûd 1609). Dayîna wê berî nimêja cejnê wek vê zekata taybet tê hesibandin; dayîna wê piştî nimêjê hîn jî wek xêrxwaziyeke giştî tê hesibandin, lê xelata taybet a bi wextê ve girêdayî ji dest tê dayîn.",
      "Îro pirraniya civakan li şûna belavkirina rasterast a xurme an garisê, nirxê wê bi pereyê herêmî dihesibînin, li dû rêberiya zanyarên herêmî û dezgehên zekatê li ser nirxên niha yên xwarina bingehîn — ev sererastkirineke pratîk e, ne guhertineke di erka bingehîn de.",
    ],
    hadith: [
      {
        excerpt:
          "Pêxemberê Xwedê ﷺ dayîna sa'eke xurme an sa'eke garis wek Zekata fitrê li ser her Misilmanî, kole an azad, mêr an jin, biçûk an mezin, ferz kir û ferman kir ku berî ku mirov ber bi kirina nimêja cejnê ve herin divê were dayîn.",
      },
      {
        excerpt:
          "Pêxemberê Xwedê ﷺ Zekata fitrê wek paqijkirina rojîgir ji peyvên vala û nerind, û wek xwarin ji bo hejaran destnîşan kir. Kî ku wê berî nimêjê bide, ev zekateke pejirandî ye; kî ku wê piştî nimêjê bide, ev xêrxwaziyeke (asayî) ye.",
      },
    ],
    actions: [
      "Zekata fitrê ji bo xwe û kesên bindestê xwe bihesibînin û ji hev veqetînin.",
      "Eger gengaz be, berî çûyîna ber bi nimêja Cejna Remezanê ve wê bidin.",
    ],
    appLinks: [{ label: "Hesabkera zekatê" }],
  },
  {
    title: "Qurban (udhiyah) — bingehên wê",
    summary: "Qurbana ajalekî ku di Cejna Qurbanê de tê pêşkêşkirin û bi hejaran tê parvekirin.",
    body: [
      "Qurban serjêkirina ajalekî minasib (mî, bizin, ga an hêştir, ku şertên temen û tenduristiyê pêk tîne) e di Cejna Qurbanê û rojên Teşrîqê yên li pey de, li bîra qurbana Îbrahîm. Enes rivayet kir ku Pêxember ﷺ bi xwe bi destên xwe du berxên spî-reş serjêkirin, li ser wan navê Xwedê anî û tekbîr got (Buxarî 5558) — ev îspat dike ku kirina serjêkirinê bi xwe, gava mumkun be, pratîka çêtir e, her çend spartina kesekî din li şûna xwe jî rast e.",
      "Qur'an qurbanê rasterast bi parvekirina goştê wê ve girê dide: '...ji wan bixwin û feqîr û pêjnêr têr bikin' (Qur'an 22:36). Goşt bi gelemperî di navbera malbata xwe, xelk û heval, û hejaran de tê parvekirin, da ku ev dem îbadet, dilfirehî û spasiyê bi hev re bike.",
      "Serjêkirin divê piştî nimêja cejnê be, ne berî wê — hevalekî ku zû serjêkiribû, Pêxember ﷺ jê xwest ku dubare bike, ji ber ku qurbaneke berî nimêjê pêşkêşkirî wek udhiyah nayê hesibandin. Biryar li ser kê bi rastî ferz e û navbera demê ya rast li gorî mezheban cuda ye; ji bo rewşa xwe bi zanyarekî herêmî yê pêbawer şêwir bikin.",
    ],
    quran: [
      {
        excerpt:
          "...ji bo we tê de qenciyek heye. Ji ber vê li ser wan navê Xwedê bînin gava ew rêz kirî ne [ji bo serjêkirinê]; û gava ew li kêleka xwe [bêcan] dikevin, ji wan bixwin û feqîr û pêjnêr têr bikin.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Pêxember ﷺ du berxên spî-reş serjê kir, û min dît ku ling xwe li kêleka wan danî û navê Xwedê anî û tekbîr got. Piştre wî bi destên xwe ew serjê kirin.",
      },
    ],
    actions: [
      "Eger hûn bikaribin û ew li ser we ferz be, qurbana xwe berî Cejna Qurbanê organîze bikin.",
      "Piştrast bikin ku serjêkirin piştî nimêja cejnê be, ne berî wê.",
      "Goştê di navbera malbata xwe, xelk/heval, û hejaran de parve bikin.",
    ],
    disclaimer:
      "Kê bi rastî qurban li ser ferz e û navbera demê ya rast a bikêrhatî ji bo serjêkirinê, pirsên fiqhî yên hûrgilî ne ku li gorî mezheban cuda ne. Ev naverokeke perwerdehiyê ya giştî ye, ne fetwa — ji bo rewşa xwe bi zanyarekî herêmî yê pêbawer şêwir bikin.",
  },
];
