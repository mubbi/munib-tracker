// Remote datasets: fetched by the app on demand (never bundled), listed in the
// manifest so Credits and licence reviews see every data source in one place.
// Nothing is downloaded at build time — these entries are pinned constants.

/** NF-3.22 Quranic Arabic Corpus morphology v0.4 (D22). Keep in sync with
 * src/lib/quran-morphology/source.ts and scripts/morphology-verify.mjs. */
const QURAN_MORPHOLOGY = {
  id: "quran-morphology",
  kind: "remote",
  version: 1,
  files: [
    {
      url: "https://media.githubusercontent.com/media/AhmedSaadi0/quran-words/a6d4217a9e1422978c367eadc833ff4883db77fb/data/quranic-corpus-morphology-0.4.txt",
      mirror:
        "https://media.githubusercontent.com/media/ezAldinWaez/quran-etl/6539e2de6cdbdb5ff5a97abb1666a7585540c2c3/reports/resources/quranic-corpus/quranic-corpus-morphology-0.4.txt",
      sha256: "910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d",
      bytes: 6181227,
    },
  ],
  license:
    "GNU GPL (verbatim copies only; credit the Quranic Arabic Corpus with a link to corpus.quran.com)",
  attribution:
    "Quranic Arabic Corpus (morphology v0.4), © Kais Dukes, GNU GPL — corpus.quran.com. Builds on Tanzil Uthmani 1.0.2 (CC BY-ND 3.0).",
  sourceUrl: "https://corpus.quran.com",
  note: "Remote, fetched on demand; sha256 is of the LF-normalised file. Root index built on the device.",
};

export async function buildRemoteSources() {
  return [QURAN_MORPHOLOGY];
}
