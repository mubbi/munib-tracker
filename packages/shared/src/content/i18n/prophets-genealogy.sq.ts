import type { ProphetsGenealogyNode } from "../../types/prophets";
import type { DeepPartial } from "./localize";

// sq overlay for prophets-genealogy. Index-aligned with PROPHETS_GENEALOGY_NODES in ../prophets-genealogy.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const PROPHETS_GENEALOGY_NODES_SQ: DeepPartial<ProphetsGenealogyNode>[] = [
  {
    name: "Ademi",
    relationNote:
      "Allahu e krijoi Ademin me dorën e Tij dhe ia mësoi emrat. Ai është babai i njerëzimit - asnjë prind njerëzor.",
  },
  {
    name: "Nuhu",
    relationNote:
      "Kurani e vendos Nuhun si lajmëtar pasi pasardhësit e Ademit u përhapën në tokë, por nuk i përmend etërit e ndërmjetëm midis Ademit dhe Nuhut. Ai shfaqet përkrah Adamit në këtë degë si një pasardhës stërgjyshorë në historinë profetike – jo si djali i afërt i Adamit.",
  },
  {
    name: "Ibrahimi",
    relationNote:
      "Ibrahimi është ndër pasardhësit e Nuhut në historinë profetike kuranore. Kur'ani nuk rendit çdo brez mes tyre; ai kryeson degën e tij të familjes në vend që të shfaqet si djali i afërt i Nuhut.",
  },
  {
    name: "Ismaili",
    relationNote:
      "Ismaili është i biri i Ibrahimit. Së bashku ata ngritën themelet e Qabes. Kurani rrëfen lajmin e gëzuar të Ibrahimit për një djalë të durueshëm dhe tregimin e sakrificës.",
  },
  {
    name: "Ishaku",
    relationNote:
      "Is'haku është i biri i Ibrahimit, i dhënë pas Ismailit dhe i bekuar së bashku me babain e tij.",
  },
  {
    name: "Luti",
    relationNote:
      "Kurani e lidh Lutin ngushtë me migrimin dhe misionin e Ibrahimit, por nuk e përmend Lutin si djalin e Ibrahimit. Tefsiri klasik shpesh e quan atë nipin e Ibrahimit. Ai shfaqet në degën e Ibrahimit si një bashkëpunëtor bashkëkohor - nuk pretendohet asnjë avantazh prind.",
  },
  {
    name: "Jakubi (Izraeli)",
    relationNote:
      "Jakubi është i biri i Is'hakut. Allahu ua dha profetësinë dhe librin pasardhësve të Ibrahimit, Is'hakut dhe Jakubit.",
  },
  {
    name: "Jusufi",
    relationNote:
      "Jusufi është i biri i Jakubit. Sureja Jusuf rrëfen gjatë historisë së tij me babain dhe vëllezërit e tij.",
  },
  {
    name: "Musai",
    relationNote:
      "Musai është nga Beni Israilët. Kurani i emëron vëllain e tij Harun dhe nënën e tij, por nuk kërkon që në këtë pemë të renditet një prind-profeti. Ai qëndron si kryetar i degës Musa-Harun.",
  },
  {
    name: "Haruni",
    relationNote:
      "Haruni është vëllai i Musait. Musai i kërkoi Allahut që ta caktojë Harunin si ndihmës nga familja e tij. Ata ndajnë një degë si vëllezër e motra - jo si baba e bir.",
  },
  {
    name: "Davudi",
    relationNote:
      "Davudit iu dha mbretëria dhe Zaburi. Kurani pohon profetësinë e tij dhe atë që Sulejmani e trashëgoi prej tij.",
  },
  {
    name: "Sylejmani",
    relationNote:
      "Sulejmani është i biri i Davudit dhe ka trashëguar mbretërinë dhe profetësinë e tij.",
  },
  {
    name: "Zekerija",
    relationNote:
      "Zakarija ishte një profet që lutej për një trashëgimtar. Allahu i dha atij Jahja.",
  },
  {
    name: "Jahja",
    relationNote:
      "Jahja është djali i Zakariyya-s, i dhënë në përgjigje të duasë së babait të tij.",
  },
  {
    name: "Merjemja",
    relationNote:
      "Merjemja, vajza e Imranit është e nderuar në Kuran. Ajo është nëna e Isait dhe nuk kishte burrë në lindjen e Isait - një shenjë nga Allahu.",
  },
  {
    name: "Isa",
    relationNote:
      "Isai është djali i Merjemes, i krijuar nga fjala e Allahut 'Bëhu' pa baba njerëzor. Lidhja e prindërve është me nënën e tij Merjem.",
  },
  {
    name: "Muhamedi ﷺ",
    relationNote:
      "Profeti Muhamed ﷺ është nga pasardhësit e Ismailit, birit të Ibrahimit. Gjeneratat e hollësishme të emërtuara ndërmjet Ismailit dhe Kurejshit janë ruajtur në sirah klasike; Kurani pohon trashëgiminë Ibrahimike pa renditur çdo paraardhës. Këtu nuk vihet asnjë avantazh i menjëhershëm baba-bir - vetëm profetësia e vulosur dhe prejardhja ismailike.",
  },
  // —— v2 appends ——
  {
    name: "Shiti (Seti)",
    relationNote:
      "Tradita klasike islame (dhe përmbledhja e zakonshme e prejardhjes së disa profetëve) e përmend Shitin si një bir të Ademit dhe një hallkë të brezave të hershëm. Emrat e ndërmjetëm midis Shitit dhe Nuhut janë kryesisht israilijate dhe nuk vizatohen si lidhje të sigurta.",
  },
  {
    name: "Idrisi",
    relationNote:
      "Kur'ani e përmend Idrisin si një profet të sinqertë që u ngrit në një shkallë të lartë. Listat klasike shpesh e vendosin midis Ademit dhe Nuhut (ndonjëherë e njësojnë me Enokun), por Kur'ani nuk e përmend emrin e babait të tij — prandaj nuk vizatohet asnjë lidhje me prindin.",
  },
  {
    name: "Imrani",
    relationNote:
      "Allahu e zgjodhi familjen e Imranit mbi botët. Merjemja është e bija e Imranit. (Ky Imran është babai i Merjemes — këtu nuk përdoret si lidhje atërore për Musain dhe Harunin.)",
  },
  {
    name: "Adnani",
    relationNote:
      "Tradita islame pohon se Muhamedi ﷺ rrjedh nga Adnani dhe se Adnani rrjedh nga Ismaili — por tradita gjenealogjike arabe pajtohet se vargu i emërtuar i brezave nga Adnani deri te Ismaili ka humbur. Adnani mbetet stërgjyshi klasik i pranuar i arabëve adnanitë; nuk vizatohet asnjë lidhje me Ismailin si prind.",
  },
  {
    name: "Hashim ibn Abdu Menaf",
    relationNote:
      "Hashimi është ai prej të cilit mori emrin fisi Benu Hashim dhe një paraardhës klasik i Profetit ﷺ. Lista e plotë e prijësve nga Adnani te Hashimi (Fihri, Mudari, …) është shënuar në sira, por këtu anashkalohet si breza të ndërmjetëm fisnorë — jo profetë. Hashimi kryeson boshtin e afërt hashimit në këtë hartë.",
  },
  {
    name: "Abdulmutalibi",
    relationNote:
      "Abdulmutalibi (Shejbe) është gjyshi nga babai i Profetit ﷺ dhe i biri i Hashimit sipas sirës klasike.",
  },
  {
    name: "Abdullah ibn Abdulmutalib",
    relationNote:
      "Abdullahu është babai i Profetit Muhamed ﷺ dhe i biri i Abdulmutalibit sipas sirës klasike.",
  },
];
