import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// ku overlay for fidyah-guide. Index-aligned with FIDYAH_GUIDE_TOPICS in ../fidyah-guide.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const FIDYAH_GUIDE_TOPICS_KU: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Qaza, fidyah, an kaffarah?",
    summary: "Sê dermanên cûda - wan tevlihev nekin.",
    body: [
      "Rojiyên Remezanê ji hemûyan wek hev nayên dermankirin. Nekarîniya demkî - nexweşiya ku hûn li bendê ne ku jê xelas bibin, rêwîtî, ducanî an şîrdana dema ku rojî zirarê bide, û hincetên mîna wê - paşê bi rojiya rojên din (qaza) tê çêkirin. Qur'an dibêje: \"...û kî nexweş be yan jî li ser rê be, wê çend rojên din jî bi qasî hev be\" (Qur'an 2:185).",
      "Fidyah (fîdyeya xwarina feqîran) ji bo wan kesên ku nikarin rojî bigirin û hîviyek rasteqîn a ji bo girtina rojan tune ne - bi gelemperî kal û pîr an nexweşên kronîk ên ku rojîgirtin ji bo wan tengasiyek mayînde ye. Quran ji bo wan kesên ku rojîgirtin ji wan re zor e, xwarina feqîr wek fîdye dide (Qur'an 2:184). Ew ayet ne destûrnameyek e ku meriv di dema saxlemiyê de rojiyê bihêle.",
      "Keffarah (kefah) girantir e. Ew dema ku kesek bi qestî rojiya Remezanê bişkîne bêyî hincetek rast bi awayên ku dibistan wekî ku hewcedarê kefayê ne - ya herî eşkere têkiliya zayendî di roja Remezanê de, wekî ku di rîwayeta navdar a Sahih Muslim de ye, derbas dibe. Dibistan ji hev cuda ne ku bi qestî xwarin an vexwarin jî heman keffara ferz dike. Ev alîkar tenê mîqdaran texmîn dike; pêdivî ye ku zanyarek herêmî jêhatî doza we dabeş bike.",
    ],
    actions: [
      "Ger hûn dîsa jî dikarin bi rojîgirtinê rojên paşde derbas bikin, qaza plan bikin - ne fidyah.",
      "Ger rojîgirtin hertimî ne mumkin be, her roj ji alimê fidyayê bipirse.",
      "Ger we bi qestî rojîyek şikand, pişta xwe nedin texmînek sepanê - ji alimek bipirsin ka kîjan hukm derbas dibe.",
    ],
    quran: [
      {
        excerpt:
          "...Û li ser yên ku dikarin [rojî bigrin, lê bi zehmetî] - fîdyeya xwarina feqîrekî... Û yê ku nexweş be yan jî li ser rêwîtîyê be, ew çend rojên din.",
      },
    ],
  },
  {
    title: "Fidyah ji bo rojiyên wenda çi ye?",
    summary: "Dema ku qaza ne mumkin e, her rojek feqîr tê xwarin.",
    body: [
      "Fîdyeya Qur'anê ya ji bo kesên ku nikarin bi zor û zehmetî rojî bigirin, ji bo her roj xwarina feqîrek e (Qur'an 2:184). Alim vê yekê wekî yekîneya fidya dinirxînin: rojek rojîgirtinê bi xwarina kesek hewcedar re têkildar e (an jî dayîna hevbera xwarinê ku bi gelemperî li devera we tê bikar anîn).",
      "Pîvana tam a xwarinê (mudd, sa', an xwarinek herêmî) û ka hevreha drav tê pejirandin li gorî dibistanê û li gorî pratîka meclîsên fetwayên herêmî diguhere. Gelek civak li gorî lêçûna xwarina feqîrekî salane mîqdara fidyayê diweşînin. Wê yekîneya herêmî di arîkarê de binivîsin da ku bi tevahî texmîn bikin - ew amûrek plansaziyê ye, ne nirxandinek pêwenddar.",
      "Fidyah ji hindikahiyê wêdetir şûna tobe an xema feqîran nagire. Bi dilpakî bidin, û ger şiyana we ya rojiyê paşde vegere, ji alimekî bipirsin gelo di rewşa we de qezayek din heye yan na.",
    ],
    actions: [
      "Bi alimekî piştrast bikin ku doza we fidyah e (ne qaza).",
      "Dema ku hebe rojekê rêjeya fidyaya mizgefta xwe ya herêmî an meclîsê bikar bînin.",
      "Ji bo texmînek plansaziyê rojan × yek xwarinê (an yekîneya fidya ya çapkirî) zêde bikin.",
    ],
    quran: [
      {
        excerpt:
          "...Û li ser yên ku dikarin [rojî bigrin, lê bi zehmetî] - fîdyeya xwarina feqîrekî. Û kî bi dilxwazî ​​qenciyê bike, ew ji wî re çêtir e. Û heke hûn zanibin, rojîgirtin ji we re çêtir e.",
      },
    ],
  },
  {
    title: "Kî bi gelemperî fidyeyê dide?",
    summary: "Nerazîbûna daîmî - ne her rojiya wenda.",
    body: [
      "Bûyerên klasîk ên fîdyeyê li şûna rojiya paşerojê ew in yên ku nikarin rojiyê bigirin û bi awayekî maqûl ne dikarin hêvî bikin ku rojên xwe zêde bikin - wek temenê mezin an nexweşiyek kronîk ku rojî dibe sedema zirarek mayînde. Nexweşiya demkî ya ku paşê derbas dibe, bi gelemperî bi rojîgirtina rojên din pêk tê (Qur'an 2:185).",
      "Ducanî û şîrmijandinê ji hêla dibistanan ve bi baldarî têne derman kirin: hinekan tenê qaza hewce dike; hinekên din jî dema ku rojî zirarê dide dê û zarokê, fidyayê nîqaş dikin. Ji hesabkerek tenê biryarê nedin.",
      "Ger kesek bi rojiyên Remezanê yên ku hîn jî deyndar in bimire, wêris dikarin li ser navê wan rojiyê bigirin an jî li gorî raporên rastîn û hûrguliyên zanistî xwarinê bidin belengazan (li Buxarî 1952 li ser navê mirî li ser rojîgirtinê binêre). Doza malbata xwe ji alim bipirsin.",
    ],
    disclaimer:
      "Dabeşkirina ducaniyê, şîrdanê, û nexweşiya kronîk darazek zanyarî ye. Ev mijar tenê perwerdeyî ye.",
    quran: [
      {
        excerpt:
          "...Ji ber vê yekê yê ku [heyvê nû] mehê dibîne, bila rojî bigire; Û kî nexweş be yan jî di rê de be, bi qasî rojên din. Xwedê ji bo we rehetiyê dixwaze û ji bo we tengahiyê naxwaze...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Zilamekî got: Diya min ji ber rojiyê mir. Ma ez li ser navê wê rojî bigirim? Pêxember (s.a.w) got: Belê, heqê deynê Xwedê zêdetir e. ﷺ",
      },
    ],
  },
  {
    title: "Kaffarah ji bo ku bi qestî rojî girtin",
    summary: "Serbestkirina koleyekê, an şêst rojiyên li pey hev, an jî xwarina şêst feqîran.",
    body: [
      "Ebû Hureyre radigihîne ku zilamek hatiye cem Pêxember (s.a.a.) û gotiye, ji ber ku di Remezanê de di dema rojiyê de bi jina xwe re têkilî kiriye, wêran bûye. Hz. îdî ka ewî du meh li pey hev rojî bigire; paşê ka ew dikare şêst belengaz têr bike - û dema ku nekare alîkariya wî kir (Sahih Muslim 1111; Bukhari 1936). ﷺ ﷺ",
      "Ev bexşandina derece, bingehê metnîkî ye ji bo keffara têkiliya di rojiya Remezanê de. Fermana di rîwayetê de ev e: rizandin, paşî şêst roj li pey hev rojî girtin, dûv re xwarina şêst feqîran. Li gorî xwendina raporê ji hêla dibistanan ve bêkêmasî di her gavê de kesek ber bi vebijarka din ve diçe.",
      "Xwarin an vexwarina bi qestî bê hincet jî vê kefferê ferz dike, di nav medhheban de cihê cihêrengiyê ye. Modelên 'kaffarah' yên alîkar ku di her yekîneya bûyerê de şêst feqîr (an şêst roj rojîgirtin) dixwin - tenê piştî ku alimek ji we re got ku kaffarah derbas dibe.",
    ],
    actions: [
      "Ji dil tobe bikin û tavilê dev ji karê guneh berdin.",
      "Ji alimekî jêhatî bipirsin ka hûn deyndarê kîjan betaliyê - heke hebe.",
      "Ger xwarina şêst belengazan vebijarka ku hûn dikarin pêk bînin, lêçûnek xwarina herêmî × 60 wekî jimarek plansaziyê bikar bînin.",
    ],
    hadith: [
      {
        excerpt:
          "Zilamek got: Ez xirav im ey Resûlê Xwedê, min di Remezanê de bi jina xwe re hevî kir. Li ser azadkirina koleyekî, girtina du mehan li pey hev û xwarina şêst feqîran jê pirsîn...",
      },
      {
        excerpt:
          "Dema ku em li gel Pêxember (s.a.a) rûdiniştin, zilamek hat û got: Ez xirav im... Di dema ku rojî digirt bi jina xwe re têkilî danî. ﷺ",
      },
    ],
  },
  {
    title: "Meriv çawa vê arîkar bikar tîne",
    summary: "Tenê texmîn - rêjeyên xwarina herêmî an fidya têkevin.",
    body: [
      "Texmîna fîdyeyê hejmara rojan bi lêçûna xwarina yekî feqîr (an jî yekîneya weya fidya ya herêmî ya ku we hatî weşandin) zêde dike. Texmîna kaffarah bi şêst xwarinê li her yekîneya bûyerê zêde dibe, vebijarka xwarinê di Sahih Muslim 1111 de nîşan dide - an jî heke ew vebijark li şûna wê were hilbijartin şêst rojên rojiyê li pey hev nîşan dide.",
      "Di pereyê xwe de mîqdarên binivîsin. Rêjeya fidya ya ku ji hêla mizgeftek herêmî ya pêbawer, navendek îslamî, an meclîsa zanistî ve hatî ragihandin ji bo vê salê tercîh bikin. Ger yek neyê weşandin, lêçûnek rastîn a xwarinek bingehîn a xwarinê ji bo kesek hewcedar proksek plansaziyek hevpar e - hîn jî bi pejirandina zanyarî ve girêdayî ye.",
      "Tu carî tevaya li ser ekranê wekî fetwayê negirin. Heke hûn nebawer in ku hûn deyndarê qeza, fidyah, keffarah, an tiştek ji tobeyê wêdetir in, hesabkerê rawestînin û ji alimekî ku rewşa we dizane bipirsin.",
    ],
    disclaimer:
      "Munib Tracker tenê texmînên perwerdehiyê peyda dike. Hikmên qanûnî yên îslamî dernakeve.",
    actions: [
      "Berî ku texmîn bikin, rêjeya fidyaya herêmî ya îsal bibînin.",
      "Ji bo tomarên xwe roj û mîqdarên xwe not bikin.",
      "Bi kanalek pêbawer ku digihîje belengazan bidin.",
    ],
  },
];
