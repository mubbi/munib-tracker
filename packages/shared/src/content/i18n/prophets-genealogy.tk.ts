import type { ProphetsGenealogyNode } from "../../types/prophets";
import type { DeepPartial } from "./localize";

// tk overlay for prophets-genealogy. Index-aligned with PROPHETS_GENEALOGY_NODES in ../prophets-genealogy.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const PROPHETS_GENEALOGY_NODES_TK: DeepPartial<ProphetsGenealogyNode>[] = [
  {
    name: "Adem",
    relationNote:
      "Allah Adam atany öz eli bilen ýaratdy we oňa atlary öwretdi. Ol adamzadyň atasy - adam ene-atasy ýok.",
  },
  {
    name: "Nuh",
    relationNote:
      "Gurhan, Adam atanyň nesilleriniň ýer ýüzüne ýaýramagyndan soň Nuh-a habarçy hökmünde belleýär, ýöne Adam bilen Nuhuň arasyndaky aralyk atalaryň adyny tutmaýar. Ol bu şahada Adam atanyň ýanynda, Adam atanyň ýakyn ogly ýaly däl-de, pygamberlik taryhynda ata-baba mirasdüşeri hökmünde peýda bolýar.",
  },
  {
    name: "Ibrahim",
    relationNote:
      "Ybraýym, Gurhanyň pygamberlik taryhynda Nuhuň nesilleriniň arasynda. Gurhan olaryň arasyndaky her nesli sanamaýar; Nuhuň ýakyn ogly ýaly görünmän, öz öý şahasyna ýolbaşçylyk edýär.",
  },
  {
    name: "Ismail",
    relationNote:
      "Ysmaýyl Ybraýymyň ogly. Bilelikde Ka'banyň düýbüni tutdular. Gurhan, Ybraýymyň sabyrly ogul hakda hoş habary we gurban hakda gürrüň berýär.",
  },
  {
    name: "Yshak",
    relationNote:
      "Yshak, Ysmaýyldan soň berlen we kakasy bilen bilelikde bereketli Ybraýymyň ogly.",
  },
  {
    name: "Lut",
    relationNote:
      "Gurhan Lut-y Ybraýymyň göçmegi we wezipesi bilen ýakyn baglanyşdyrýar, ýöne Lut-y Ybraýymyň ogly diýip atlandyrmaýar. Nusgawy tafsir köplenç oňa Ybraýymyň ýegeni diýýär. Ybraýymyň şahasynda häzirki zaman kärdeşi hökmünde peýda bolýar - ene-atanyň hiç hili talaplary ýok.",
  },
  {
    name: "Ýakup (Ysraýyl)",
    relationNote:
      "Ubakup Yshagyň ogly. Allatagala Ybraýymyň, Yshagyň we ubakubyň nesilleriniň arasynda pygamberlik we Kitap berdi.",
  },
  {
    name: "Ýusup",
    relationNote:
      "Yusufusup ubakubyň ogly. Yusufusup süresi kakasy we doganlary bilen öz hekaýasyny uzyn gürrüň berýär.",
  },
  {
    name: "Musa",
    relationNote:
      "Musa Ysraýyl ogullaryndan. Gurhan dogany Haruna we ejesine at dakýar, ýöne bu agaçda pygamber-ene-atanyň sanawyny talap etmeýär. Musa - Harun bölüminiň başlygy.",
  },
  {
    name: "Harun",
    relationNote:
      "Harun Musanyň dogany. Musa Alladan Haruny maşgalasyndan kömekçi edip bellemegini isledi. Bir şahany dogan hökmünde paýlaşýarlar - kakasy we ogly ýaly däl.",
  },
  {
    name: "Dawut",
    relationNote:
      "Dawuda patyşalyk we Zabur berildi. Gurhan pygamberligini we Süleýmanyň ondan miras alandygyny tassyklaýar.",
  },
  {
    name: "Süleýman",
    relationNote: "Süleýman Dawudyň ogly we şalygyna we pygamberligine miras galypdyr.",
  },
  {
    name: "Zekerýa",
    relationNote: "Zakarýa mirasdüşer üçin doga eden pygamberdi. Allah oňa yaahýa berdi.",
  },
  {
    name: "Ýahýa",
    relationNote: "Yaahýa kakasynyň duasyna jogap hökmünde berlen Zakarýanyň ogly.",
  },
  {
    name: "Merýem",
    relationNote:
      "Imranyň gyzy Merýem Gurhanda hormatlanýar. Ol Isanyň ejesi we Isanyň dünýä inmeginde adamsy ýokdy - bu Allanyň alamaty.",
  },
  {
    name: "Isa",
    relationNote:
      "Isa Merýemiň ogly, Allanyň 'Bol' sözi bilen adam atasyz döredildi. Ene-atanyň baglanyşygy ejesi Merýem bilen.",
  },
  {
    name: "Muhammet ﷺ",
    relationNote:
      "Muhammet alaýhyssalam Ybraýymyň ogly Ysmaýylyň nesillerinden. Ysmaýyl bilen Kuraýşyň arasyndaky jikme-jik atlandyrylan nesiller nusgawy sirada saklanýar; Gurhan, her bir ata-babany sanamazdan Ybraýym mirasyny tassyklaýar. Bu ýerde derrew ata-ogluň gyrasy çekilmeýär - diňe möhürlenen pygamberlik we Ysmaýyl nesli.",
  },
  // —— v2 appends ——
  {
    name: "Şit (Set)",
    relationNote:
      "Nusgawy yslam däbi (we birnäçe pygamberiň nesil şejeresiniň umumy beýany) Şiti Adam atanyň ogly we ilkinji nesilleriň bir halkasy hökmünde agzaýar. Şit bilen Nuhuň arasyndaky aralyk atlar esasan Ysraýyliýýatdan alnan bolup, berk baglanyşyk hökmünde çekilmeýär.",
  },
  {
    name: "Ydrys",
    relationNote:
      "Gurhan Ydrysy ýokary derejä göterilen dogruçyl pygamber hökmünde agzaýar. Nusgawy sanawlar ony köplenç Adam bilen Nuhuň arasynda ýerleşdirýär (käte Enoh bilen birmeňzeş hasaplaýar), ýöne Gurhan onuň kakasynyň adyny tutmaýar — ene-ata baglanyşygy çekilmeýär.",
  },
  {
    name: "Ymran",
    relationNote:
      "Allah Ymranyň maşgalasyny älemlerden üstün saýlady. Merýem Ymranyň gyzydyr. (Bu Ymran Merýemiň kakasydyr — bu ýerde Musa/Harun üçin kakalyk baglanyşygy hökmünde ulanylmaýar.)",
  },
  {
    name: "Adnan",
    relationNote:
      "Yslam däbine görä, Muhammet ﷺ Adnanyň neslinden, Adnan bolsa Ysmaýylyň neslindendir — ýöne arap nesil şejeresi däbi Adnandan Ysmaýyla çenli atlary tutulan şejeräniň ýitendigi barada ylalaşýar. Adnan adnany araplarynyň umumy ykrar edilen nusgawy başlangyjy hökmünde durýar; Ysmaýyla ene-ata baglanyşygy çekilmeýär.",
  },
  {
    name: "Haşim ibn Abdumenaf",
    relationNote:
      "Haşim Beni Haşim tiresiniň adyny göterýän ata we Pygamberiň ﷺ nusgawy atalarynyň biridir. Adnandan Haşime çenli serdarlaryň doly sanawy (Fihr, Mudar, …) siýerde ýazylan, ýöne olar pygamber däl-de, aralyk taýpa nesilleri bolany üçin bu ýerde goýberilýär. Haşim bu kartadaky ýakyn Haşimi şahasyny başlaýar.",
  },
  {
    name: "Abdulmuttalyp",
    relationNote:
      "Nusgawy siýere görä, Abdulmuttalyp (Şaýba) Pygamberiň ﷺ kakasy tarapyndan atasy we Haşimiň oglydyr.",
  },
  {
    name: "Abdulla ibn Abdulmuttalyp",
    relationNote:
      "Nusgawy siýere görä, Abdulla Pygamber Muhammediň ﷺ kakasy we Abdulmuttalybyň oglydyr.",
  },
];
