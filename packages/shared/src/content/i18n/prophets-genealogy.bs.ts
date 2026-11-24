import type { ProphetsGenealogyNode } from "../../types/prophets";
import type { DeepPartial } from "./localize";

// bs overlay for prophets-genealogy. Index-aligned with PROPHETS_GENEALOGY_NODES in ../prophets-genealogy.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const PROPHETS_GENEALOGY_NODES_BS: DeepPartial<ProphetsGenealogyNode>[] = [
  {
    name: "Adem",
    relationNote:
      "Allah je stvorio Adema Svojom rukom i naučio ga imenima. On je otac čovječanstva — bez ljudskog roditelja.",
  },
  {
    name: "Nuh",
    relationNote:
      "Kur'an utvrđuje Nuha kao poslanika nakon što su se Ademovi potomci raširili po zemlji, ali ne imenuje posredne očeve između Adema i Nuha. Predaja od Ibn Abbasa kaže da je između Adema i Nuha bilo desetak generacija. Na ovoj grani pojavljuje se kao kasniji potomak predaka — ne kao neposredni sin Adema ili Šita.",
  },
  {
    name: "Ibrahim",
    relationNote:
      "Ibrahim je među Nuhovim potomcima u kur'anskoj historiji vjerovjesnika. Kur'an ne navodi svaku generaciju između njih; Wikipedijin spisak imena od Adema do Ibrahima uglavnom potiče iz israilijata i ovdje nije prikazan kao čvrsta veza. Ibrahim predvodi granu vlastite porodice.",
  },
  {
    name: "Ismail",
    relationNote:
      "Ismail je Ibrahimov sin. Zajedno su podigli temelje Kabe. Kur'an prenosi radosnu vijest Ibrahimu o blagom sinu i kazivanje o žrtvi. Tradicionalna arapska genealogija prati adnanijsku lozu (a time i Muhammeda ﷺ) preko Ismaila — uz izgubljeni niz generacija prije Adnana.",
  },
  {
    name: "Ishak",
    relationNote:
      "Ishak je Ibrahimov sin, darovan nakon Ismaila, i blagoslovljen zajedno sa svojim ocem.",
  },
  {
    name: "Lut",
    relationNote:
      "Kur'an usko povezuje Luta s Ibrahimovom hidžrom i misijom, ali ne imenuje Luta kao Ibrahimovog sina. Klasični tefsir ga često naziva Ibrahimovim bratićem. Na Ibrahimovoj grani pojavljuje se kao savremenik i saradnik — ne tvrdi se nikakva roditeljska veza.",
  },
  {
    name: "Jakub (Israil)",
    relationNote:
      "Jakub je Ishakov sin. Allah je darovao vjerovjesništvo i Knjigu među potomcima Ibrahima, Ishaka i Jakuba.",
  },
  {
    name: "Jusuf",
    relationNote: "Jusuf je Jakubov sin. Sura Jusuf opširno kazuje njegovu priču s ocem i braćom.",
  },
  {
    name: "Musa",
    relationNote:
      "Musa je od sinova Israilovih. Kur'an spominje njegovog brata Haruna i njegovu majku, ali ne zahtijeva da se na ovom stablu navede roditelj vjerovjesnik. On predvodi granu Musa–Harun. (Biblijski lanci preko Amrama nisu prikazani — oni su izvan čvrstih kur'anskih roditeljskih veza.)",
  },
  {
    name: "Harun",
    relationNote:
      "Harun je Musaov brat. Musa je zamolio Allaha da mu odredi Haruna kao pomagača iz njegove porodice. Oni dijele granu kao braća — ne kao otac i sin.",
  },
  {
    name: "Davud",
    relationNote:
      "Davudu su data vlast i Zebur. Kur'an potvrđuje njegovo vjerovjesništvo i to da ga je Sulejman naslijedio.",
  },
  {
    name: "Sulejman",
    relationNote: "Sulejman je Davudov sin i naslijedio je njegovo kraljevstvo i vjerovjesništvo.",
  },
  {
    name: "Zekerija",
    relationNote:
      "Zekerija je bio vjerovjesnik koji je molio za nasljednika. Allah mu je darovao Jahju.",
  },
  {
    name: "Jahja",
    relationNote: "Jahja je Zekerijin sin, darovan kao odgovor na dovu njegovog oca.",
  },
  {
    name: "Merjema",
    relationNote:
      "Merjema, kćerka Imranova, počašćena je u Kur'anu. Ona je Isaova majka i rodila je Isaa bez muža — Allahov znak.",
  },
  {
    name: "Isa",
    relationNote:
      "Isa je Merjemin sin, stvoren Allahovom riječju 'Budi' bez ljudskog oca. Roditeljska veza je s njegovom majkom Merjemom.",
  },
  {
    name: "Muhammed ﷺ",
    relationNote:
      "Poslanik Muhammed ﷺ sin je Abdullaha ibn Abdul-Muttaliba iz Benu Hašima. Klasična sira bilježi lozu po očevoj liniji preko Hašima do Adnana; od Adnana prema Ismailu imena generacija su izgubljena ili sporna. On je od potomaka Ismaila, sina Ibrahimova (vjerodostojni hadis od Vasile).",
  },
  // —— v2 appends ——
  {
    name: "Šit (Set)",
    relationNote:
      "Klasična islamska predaja (i uobičajeni sažetak loze nekoliko vjerovjesnika) navodi Šita kao Ademovog sina i kariku u ranim generacijama. Posredna imena između Šita i Nuha uglavnom potiču iz israilijata i nisu prikazana kao čvrste veze.",
  },
  {
    name: "Idris",
    relationNote:
      "Kur'an spominje Idrisa kao istinoljubivog vjerovjesnika uzdignutog na visoko mjesto. Klasični spiskovi ga često smještaju između Adema i Nuha (ponekad ga poistovjećujući s Henohom), ali Kur'an ne imenuje njegovog oca — roditeljska veza nije prikazana.",
  },
  {
    name: "Imran",
    relationNote:
      "Allah je odabrao porodicu Imranovu iznad svjetova. Merjema je Imranova kćerka. (Ovaj Imran je Merjemin otac — ovdje se ne koristi kao očeva veza za Musaa i Haruna.)",
  },
  {
    name: "Adnan",
    relationNote:
      "Islamska predaja smatra da Muhammed ﷺ potječe od Adnana, a Adnan od Ismaila — ali se arapska genealoška tradicija slaže da je imenovana loza od Adnana do Ismaila izgubljena. Adnan je općeprihvaćeni klasični rodonačelnik adnanijskih Arapa; roditeljska veza s Ismailom nije prikazana.",
  },
  {
    name: "Hašim ibn Abd Menaf",
    relationNote:
      "Hašim je rodonačelnik po kojem je nazvan Benu Hašim i klasični predak Poslanika ﷺ. Potpuni spisak prvaka od Adnana do Hašima (Fihr, Mudar, …) zabilježen je u siri, ali je ovdje izostavljen kao posredne plemenske generacije — ne vjerovjesnici. Hašim predvodi blisku hašimijsku okosnicu na ovoj mapi.",
  },
  {
    name: "Abdul-Muttalib",
    relationNote:
      "Abdul-Muttalib (Šejba) je djed Poslanika ﷺ po ocu i Hašimov sin prema klasičnoj siri.",
  },
  {
    name: "Abdullah ibn Abdul-Muttalib",
    relationNote:
      "Abdullah je otac Poslanika Muhammeda ﷺ i sin Abdul-Muttaliba prema klasičnoj siri.",
  },
];
