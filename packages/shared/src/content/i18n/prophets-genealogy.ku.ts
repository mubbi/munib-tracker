import type { ProphetsGenealogyNode } from "../../types/prophets";
import type { DeepPartial } from "./localize";

// ku overlay for prophets-genealogy. Index-aligned with PROPHETS_GENEALOGY_NODES in ../prophets-genealogy.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const PROPHETS_GENEALOGY_NODES_KU: DeepPartial<ProphetsGenealogyNode>[] = [
  {
    name: "ئادەم",
    relationNote:
      "Xwedê Adem bi destê xwe afirand û navan hînî wî kir. Ew bavê mirovahiyê ye - dêûbavê mirov tune.",
  },
  {
    name: "نوح",
    relationNote:
      "Qur'an Nûh piştî belavbûna neviyên Adem li ser rûyê erdê wek qasidê destnîşan dike, lê navê bavên navbirî yên di navbera Adem û Nûh de nabêje. Ew li kêleka Adem li ser vê şaxê wekî cîgirê bav û kalan di dîroka pêxemberî de xuya dike - ne wekî kurê nêzîk Adem.",
  },
  {
    name: "ئیبراهیم",
    relationNote:
      "Îbrahîm di dîroka pêxemberiya Qur'anê de ji neviyên Nûh e. Qur'an her nifşek di navbera wan de rêz nake; ew serokatîya şaxê mala xwe dike, ne ku wek kurê nuh xuya bike.",
  },
  {
    name: "ئیسماعیل",
    relationNote:
      "Îsmaîl kurê Îbrahîm e. Bi hev re bingehên Kabeyê bilind kirin. Quran mizgîniya Ibrahîm a kurekî xweragir û rîwayeta qurbaniyê vedibêje.",
  },
  {
    name: "ئیسحاق",
    relationNote: "Îshaq kurê Îbrahîm e, piştî Îsmaîl hatiye dayîn û bi bavê xwe re pîroz e.",
  },
  {
    name: "لووت",
    relationNote:
      "Qur'an Lut bi koçkirin û wezîfeya Îbrahîm ve girê dide lê navê Lût wek kurê Îbrahîm nade. Tefsîra klasîk gelek caran jê re dibêje biraziyê Îbrahîm. Ew di şaxê Îbrahîm de wekî hevkarek hevdem xuya dike - ti aliyekê dêûbav nayê îdîa kirin.",
  },
  {
    name: "یەعقوب (ئیسرائیل)",
    relationNote:
      "Yaqûb kurê Îshaq e. Xuda pêxembertî û kitêb ji neviyên Îbrahîm, Îshaq û Yaqûb re daye.",
  },
  {
    name: "یوسف",
    relationNote:
      "Yusuf kurê Yaqûb e. Sûreya Yûsif bi dirêjî çîroka xwe ji bav û birayên xwe re vedibêje.",
  },
  {
    name: "مووسا",
    relationNote:
      "Mûsa ji Benî Îsraîl e. Quran navê birayê wî Harûn û diya wî dide, lê ne hewce ye ku dêûbav-pêxember li ser vê darê binivîse. Ew wek serokê şaxa Mûsa-Harûn radiweste.",
  },
  {
    name: "هاروون",
    relationNote:
      "Harûn birayê Mûsa ye. Mûsa ji Xwedê xwest ku Harûn ji malbata wî re bibe alîkar. Ew şaxek wek xwişk û bira parve dikin - ne wek bav û kur.",
  },
  {
    name: "داوود",
    relationNote:
      "Dawûd padîşah û Zabûr hat dayîn. Qur'an pêxembertiya wî û ku Silêman ji wî mîras wergirtiye piştrast dike.",
  },
  {
    name: "سولەیمان",
    relationNote: "Silêman kurê Dawûd e û mîratî û pêxembertiya wî wergirtiye.",
  },
  {
    name: "زەکەریا",
    relationNote: "Zekeriye pêxemberek bû ku ji bo mirazê xwe dua dikir. Xwedê Yehya daye wî.",
  },
  {
    name: "یەحیا",
    relationNote: "Yehya kurê Zekeriye ye, di bersiva duaya bavê xwe de hatiye dayîn.",
  },
  {
    name: "مەریەم",
    relationNote:
      "Meryem keça Îmran di Quranê de qedr û qîmet e. Ew diya Îsa ye û di zayîna Îsa de mêrek tune bû - nîşaneke Xwedê ye.",
  },
  {
    name: "عیسا",
    relationNote:
      "Îsa kurê Meryemê ye ku bi peyva Xwedê ya “Be” bê bav hatiye afirandin. Girêdana dêûbav bi diya wî Meryem re ye.",
  },
  {
    name: "موحەممەد ﷺ",
    relationNote:
      "Pêxember Muhammed ﷺ ji neviyê Îsmaîl kurê Îbrahîm e. Bi berfirehî nifşên navên di navbera Îsmaîl û Qureyşiyan de di sirahiya klasîk de hatine parastin; Qur'an mîrata Îbrahîmî bêyî navnîşana her bav û kalan piştrast dike. Li vir tixûbê bav-kur nayê kişandin - tenê pêxembertiya mohrkirî û nijada Îsmaîlî.",
  },
];
