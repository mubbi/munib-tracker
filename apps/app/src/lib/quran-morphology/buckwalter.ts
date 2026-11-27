/**
 * Extended Buckwalter transliteration used by the Quranic Arabic Corpus (QAC)
 * morphology file, mapped to Unicode code points. The table follows the QAC
 * scheme published at corpus.quran.com/java/buckwalter.jsp: the classic
 * Buckwalter letters plus the Uthmani annotation marks the corpus needs.
 *
 * Code points are written as escapes on purpose — no Arabic text is typed in
 * this file. `morphology:verify` checks the mapping end to end by converting
 * every word in the file and aligning it with the bundled Tanzil text.
 */
export const BUCKWALTER_TO_CODEPOINT: Readonly<Record<string, number>> = {
  "'": 0x0621, // hamza
  ">": 0x0623, // alif + hamza above
  "&": 0x0624, // waw + hamza above
  "<": 0x0625, // alif + hamza below
  "}": 0x0626, // ya + hamza above
  A: 0x0627, // alif
  b: 0x0628, // ba
  p: 0x0629, // ta marbuta
  t: 0x062a, // ta
  v: 0x062b, // tha
  j: 0x062c, // jim
  H: 0x062d, // ha (pharyngeal)
  x: 0x062e, // kha
  d: 0x062f, // dal
  "*": 0x0630, // dhal
  r: 0x0631, // ra
  z: 0x0632, // zay
  s: 0x0633, // sin
  $: 0x0634, // shin
  S: 0x0635, // sad
  D: 0x0636, // dad
  T: 0x0637, // ta (emphatic)
  Z: 0x0638, // za (emphatic)
  E: 0x0639, // ain
  g: 0x063a, // ghain
  _: 0x0640, // tatweel
  f: 0x0641, // fa
  q: 0x0642, // qaf
  k: 0x0643, // kaf
  l: 0x0644, // lam
  m: 0x0645, // mim
  n: 0x0646, // nun
  h: 0x0647, // ha
  w: 0x0648, // waw
  Y: 0x0649, // alif maqsura
  y: 0x064a, // ya
  F: 0x064b, // fathatan
  N: 0x064c, // dammatan
  K: 0x064d, // kasratan
  a: 0x064e, // fatha
  u: 0x064f, // damma
  i: 0x0650, // kasra
  "~": 0x0651, // shadda
  o: 0x0652, // sukun
  "^": 0x0653, // maddah above
  "#": 0x0654, // hamza above
  "`": 0x0670, // superscript (dagger) alif
  "{": 0x0671, // alif wasla
  ":": 0x06dc, // small high seen
  "@": 0x06df, // small high rounded zero
  '"': 0x06e0, // small high upright rectangular zero
  "[": 0x06e2, // small high meem isolated form
  ";": 0x06e3, // small low seen
  ",": 0x06e5, // small waw
  ".": 0x06e6, // small ya
  "!": 0x06e8, // small high noon
  "-": 0x06ea, // empty centre low stop
  "+": 0x06eb, // empty centre high stop
  "%": 0x06ec, // rounded high stop with filled centre
  "]": 0x06ed, // small low meem
};

const TO_ARABIC = new Map<string, string>(
  Object.entries(BUCKWALTER_TO_CODEPOINT).map(([bw, cp]) => [bw, String.fromCodePoint(cp)]),
);

/**
 * Convert an extended-Buckwalter string to Arabic script. Characters outside the
 * table (digits that disambiguate homonym lemmas, e.g. `Ealay2`) are dropped.
 */
export function buckwalterToArabic(bw: string): string {
  let out = "";
  for (const ch of bw) out += TO_ARABIC.get(ch) ?? "";
  return out;
}

/**
 * QAC roots use only consonant letters, with every hamza written `A`. Arabic
 * lexicons write a hamza radical as أ (e.g. أ م ن), so roots display `A` that
 * way; every other letter uses the table above.
 */
const ROOT_HAMZA_DISPLAY = String.fromCodePoint(0x0623);

/** The letters of a Buckwalter root, in Arabic script (one entry per radical). */
export function rootLetters(root: string): string[] {
  return [...root].map((ch) => (ch === "A" ? ROOT_HAMZA_DISPLAY : (TO_ARABIC.get(ch) ?? "")));
}

/** Root letters joined with spaces — the conventional way to show a root (ر ح م). */
export function rootToArabic(root: string): string {
  return rootLetters(root).join(" ");
}

/**
 * The 28 letters a root can be built from, in alphabetical (alifba) order, as
 * Buckwalter keys. Drives the letter-picker sheet (no Arabic keyboard needed).
 */
export const ROOT_ALPHABET: readonly string[] = [
  "A",
  "b",
  "t",
  "v",
  "j",
  "H",
  "x",
  "d",
  "*",
  "r",
  "z",
  "s",
  "$",
  "S",
  "D",
  "T",
  "Z",
  "E",
  "g",
  "f",
  "q",
  "k",
  "l",
  "m",
  "n",
  "h",
  "w",
  "y",
];

/** Arabic letter → root Buckwalter letter, with hamza / alif forms folded to `A` and ى to `y`. */
const ARABIC_TO_ROOT_LETTER: ReadonlyMap<string, string> = (() => {
  const map = new Map<string, string>();
  for (const bw of ROOT_ALPHABET) {
    const cp = BUCKWALTER_TO_CODEPOINT[bw];
    if (cp != null) map.set(String.fromCodePoint(cp), bw);
  }
  // Hamza on any seat, madda alif and alif wasla all fold to the dataset's `A`.
  for (const cp of [0x0621, 0x0622, 0x0623, 0x0624, 0x0625, 0x0626, 0x0671]) {
    map.set(String.fromCodePoint(cp), "A");
  }
  // Alif maqsura → the weak radical `y`; ta marbuta is never a radical but a
  // typed root ending in it means `t`.
  map.set(String.fromCodePoint(0x0649), "y");
  map.set(String.fromCodePoint(0x0629), "t");
  return map;
})();

/** Fold one Arabic letter to its root Buckwalter form, or null for non-letters / marks. */
export function arabicLetterToRoot(ch: string): string | null {
  return ARABIC_TO_ROOT_LETTER.get(ch) ?? null;
}
