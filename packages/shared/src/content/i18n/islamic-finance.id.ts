import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// id overlay for islamic-finance. Index-aligned with ISLAMIC_FINANCE_TOPICS in ../islamic-finance.ts.
export const ISLAMIC_FINANCE_TOPICS_ID: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Apa Itu Keuangan Islam?",
    summary:
      "Sebuah sudut pandang etis tentang uang, bukan kategori produk tersendiri — panduan ini hanya bersifat edukasi.",
    body: [
      "Keuangan Islam bukanlah merek produk investasi; ia adalah penerapan etika Islam pada cara uang diperoleh, dipinjamkan, dibelanjakan, dan diberikan. Intinya terdiri dari beberapa prinsip: harta adalah amanah dari Allah, bukan tujuan itu sendiri; transaksi harus bebas dari eksploitasi dan ketidakpastian yang berlebihan; dan keuntungan semestinya terkait dengan kegiatan ekonomi yang nyata serta risiko yang ditanggung bersama, bukan tambahan yang dijamin atas suatu pinjaman.",
      "Panduan ini memperkenalkan prinsip-prinsip tersebut pada tingkat umum dan edukatif: larangan riba (bunga/rente), kejujuran dalam perdagangan, kewajiban zakat dan sedekah sukarela, serta konsep dasar takaful (asuransi berbasis tolong-menolong). Panduan ini sengaja tidak menyaring reksa dana, tidak mencantumkan saham atau ETF, dan tidak merekomendasikan produk atau penyedia tertentu.",
      "Produk keuangan modern (KPR, kartu kredit, polis asuransi, rekening pensiun, dan lainnya) disusun dengan berbagai cara yang berbeda, dan hukumnya dapat bergantung pada ketentuan akad yang tepat serta yurisdiksi Anda. Panduan ini memberikan prinsip-prinsip dasarnya; untuk hukum atas situasi Anda secara khusus, konsultasikan dengan ulama atau lembaga keuangan Islam yang berkompeten dan bersertifikat.",
    ],
    disclaimer:
      "Hanya konten edukasi — bukan nasihat keuangan dan bukan fatwa. Konten ini tidak merekomendasikan, menyaring, atau menilai reksa dana, saham, penyedia, atau produk keuangan tertentu.",
  },
  {
    title: "Harta sebagai Amanah",
    summary:
      "Segala yang Anda miliki pada hakikatnya milik Allah — Anda pengelolanya, bukan pemilik akhirnya.",
    body: [
      "Salah satu tema yang berulang dalam Al-Qur'an adalah bahwa harta adalah milik Allah terlebih dahulu; manusia hanyalah pemegang amanahnya untuk sementara waktu, yang akan dimintai pertanggungjawaban tentang bagaimana harta itu diperoleh dan digunakan. Hal ini mengubah cara pandang terhadap uang, dari sekadar milik pribadi menjadi sesuatu yang akan ditanyakan kepada Anda — dari mana asalnya dan ke mana perginya.",
      "Dua perintah menjadi pijakan bagaimana amanah itu dijalankan dalam bermuamalah dengan orang lain: memenuhi akad dan perjanjian secara utuh, dan tidak pernah mengambil harta orang lain dengan cara zalim, menipu, atau mengeksploitasi, melainkan hanya melalui perdagangan yang adil atas dasar suka sama suka.",
      "Jika dipadukan, prinsip-prinsip inilah yang membuat etika keuangan Islam selalu kembali pada beberapa pertanyaan yang sama: apakah keuntungan ini diperoleh melalui usaha, risiko, dan penciptaan nilai yang nyata? Apakah pihak lain diperlakukan dengan kejujuran penuh? Dan apakah setiap kewajiban yang telah saya sanggupi sudah ditunaikan?",
    ],
  },
  {
    title: "Larangan Riba",
    summary: "Riba (bunga/rente) termasuk transaksi yang paling keras dikecam dalam Al-Qur'an.",
    body: [
      "Riba — yang biasa diterjemahkan sebagai bunga atau rente, secara umum berarti setiap tambahan yang ditetapkan di muka dan dijamin atas suatu pinjaman — dilarang dengan bahasa yang luar biasa keras dalam lima ayat berturut-turut di Surah al-Baqarah (2:275–279), termasuk di antara peringatan paling berat tentang satu topik dalam Al-Qur'an.",
      'Rangkaian ayat ini sengaja menghadirkan perbandingan: "Allah telah menghalalkan jual beli dan mengharamkan riba" (2:275). Perdagangan — jual beli dan investasi di mana kedua pihak sama-sama menanggung risiko dan usaha yang nyata — dipuji; riba, yaitu tambahan tetap yang wajib dibayar apa pun hasilnya, dikecam. Surah ini kemudian memerintahkan orang-orang beriman untuk meninggalkan sisa riba sepenuhnya, memperingatkan akibat serius bagi mereka yang tetap melakukannya, sekaligus menjanjikan bahwa siapa pun yang bertobat boleh mengambil pokok hartanya saja — tidak lebih, tidak kurang.',
      "Ini adalah ajaran dasar yang perlu diketahui, bukan daftar periksa untuk menilai sendiri setiap produk keuangan modern. Menentukan apakah suatu akad tertentu (KPR, pinjaman, rekening tabungan) mengandung riba dalam praktiknya memerlukan peninjauan ketentuan yang sebenarnya bersama seseorang yang ahli dalam keuangan Islam.",
    ],
  },
  {
    title: "Mengapa Perdagangan Berbeda dari Bunga",
    summary:
      "Keuntungan yang sah terkait dengan risiko dan usaha; riba adalah tambahan yang dijamin apa pun hasilnya.",
    body: [
      "Cara sederhana untuk mengingat perbedaannya: dalam perdagangan atau investasi yang sesungguhnya, pihak yang menyediakan modal atau barang ikut menanggung hasilnya — ia bisa untung, tetapi juga bisa rugi, karena terpapar pada kinerja nyata suatu usaha. Dalam pinjaman berbasis riba, pemberi pinjaman dijamin mendapat imbal hasil tetap, tidak peduli apakah usaha peminjam berhasil, tersendat, atau gagal.",
      'Para ulama klasik memandang hal ini sebagai persoalan keadilan: orang yang sangat membutuhkan lalu meminjam uang bisa terjerat membayar kembali jauh lebih banyak daripada yang dipinjamnya, dengan seluruh risiko dibebankan kepadanya dan tidak sedikit pun kepada pemberi pinjaman — persis ketimpangan yang dikecam Al-Qur\'an dalam ungkapan "Allah memusnahkan riba dan menyuburkan sedekah" (2:276), sebuah perbandingan langsung antara harta yang dibangun melalui eksploitasi dan harta yang tumbuh melalui kedermawanan.',
      "Ini adalah perbandingan edukatif yang bersifat umum, bukan hukum atas instrumen tertentu (sebagian struktur modern mengaburkan batas antara perdagangan dan pinjaman dengan cara yang rumit). Di mana posisi suatu produk tertentu dalam spektrum ini justru merupakan jenis pertanyaan yang perlu diajukan kepada ulama keuangan Islam yang berkompeten atau penasihat bersertifikat, bukan diputuskan hanya dari prinsip-prinsip umum.",
    ],
  },
  {
    title: "Betapa Seriusnya Sunnah Memandang Riba",
    summary:
      "Nabi ﷺ memperingatkan bahwa setiap pihak yang terlibat dalam transaksi riba ikut menanggung dosanya.",
    body: [
      "Selain peringatan dalam Al-Qur'an sendiri, Nabi ﷺ menegaskan bahwa tanggung jawab atas riba tidak terbatas pada orang yang langsung memungutnya. Dalam sebuah hadits sahih, beliau ﷺ diriwayatkan melaknat pemakan riba, orang yang membayarnya, penulis akadnya, dan dua orang saksinya — seraya bersabda bahwa mereka semua sama dalam hal ini.",
      "Pelajaran yang umumnya diambil dari hadits ini adalah sikap menjauhi bersama, bukan sekadar menyalahkan perorangan: riba dipandang sebagai sesuatu yang harus dijauhi oleh seluruh transaksi dan setiap orang yang dengan sadar terlibat di dalamnya — bukan sekadar urusan pribadi antara pemberi pinjaman dan peminjam.",
      "Sebagaimana ayat-ayat Al-Qur'an, hadits ini menegaskan beratnya prinsip tersebut; hadits ini sendiri tidak memberi tahu Anda bagaimana menggolongkan suatu produk keuangan modern tertentu. Penilaian itu menjadi wewenang ulama yang berkompeten yang meninjau akad yang sebenarnya.",
    ],
  },
  {
    title: "Kejujuran dalam Perdagangan",
    summary:
      "Pedagang yang jujur dan tepercaya dijanjikan salah satu kedudukan tertinggi di akhirat.",
    body: [
      "Berbeda tajam dengan peringatan tentang riba, perdagangan yang jujur berulang kali dipuji. Nabi Muhammad ﷺ sendiri bekerja sebagai pedagang sebelum kenabian dan dikenal di Makkah dengan gelar al-Amin — 'Yang Tepercaya' — karena integritasnya dalam berdagang, jauh sebelum beliau dikenal sebagai nabi.",
      'Kemudian beliau ﷺ mengajarkan: "Seorang pedagang yang jujur dan dipercaya akan bersama dengan para Nabi, shiddiqun dan para syuhada" pada Hari Kiamat — kedudukan yang luar biasa tinggi bagi sesuatu yang sesederhana berlaku adil di pasar.',
      "Secara praktis, perdagangan yang adil berarti: menggambarkan barang dan jasa secara akurat, mengungkapkan cacat yang diketahui alih-alih menyembunyikannya, menepati harga dan ketentuan yang telah disepakati, serta menghindari penipuan, iklan palsu, atau memanfaatkan ketidaktahuan pembeli maupun penjual. Ini adalah naluri yang sama yang melahirkan usaha yang baik dan berkelanjutan dalam tradisi mana pun — Islam hanya mengaitkannya juga dengan pahala yang kekal.",
    ],
  },
  {
    title: "Menyikapi Produk Keuangan Modern",
    summary:
      "KPR, kartu kredit, dan asuransi benar-benar rumit — panduan ini berhenti pada prinsip-prinsip.",
    body: [
      "Kehidupan keuangan modern melibatkan produk-produk yang tidak pernah dijumpai generasi Muslim terdahulu dalam bentuknya yang sekarang: KPR, kartu kredit, rekening pensiun, asuransi, dan reksa dana yang disusun dengan berbagai cara. Menerapkan prinsip-prinsip yang berusia berabad-abad pada produk-produk ini adalah kerja keilmuan yang nyata dan cermat — bukan sesuatu yang bisa disimpulkan sendiri dari beberapa ayat umum.",
      "Karena itu, lembaga keuangan Islam kontemporer dan ulama bersertifikat secara khusus mendalami peninjauan akad-akad modern agar sesuai dengan prinsip-prinsip ini, dan sering kali menghasilkan ketetapan rinci tentang produk atau struktur tertentu. Peninjauan khusus semacam itu berada di luar cakupan aplikasi ini.",
      "Jika Anda sedang menimbang keputusan keuangan yang nyata — membeli rumah, mengambil pinjaman, berinvestasi, atau membeli polis asuransi — langkah yang bertanggung jawab adalah berkonsultasi dengan penasihat atau ulama keuangan Islam yang berkompeten dan bersertifikat yang dapat meninjau ketentuan akad yang sebenarnya, bukan bergantung pada konten edukasi umum seperti panduan ini.",
    ],
    disclaimer:
      "Aplikasi ini tidak menilai, menyaring, atau merekomendasikan produk keuangan, reksa dana, atau penyedia tertentu, dan panduan ini bukan pengganti nasihat profesional atau keilmuan yang berkompeten mengenai keuangan Anda yang sebenarnya.",
  },
  {
    title: "Zakat: Ibadah melalui Harta",
    summary:
      "Zakat adalah ibadah wajib yang ditunaikan dengan harta, bukan dengan ucapan atau gerakan.",
    body: [
      "Zakat — kewajiban tahunan yang tetap atas harta tertentu yang melebihi batas minimum (nisab) — adalah salah satu dari lima rukun Islam, yang menempatkan memberi sejajar dengan shalat dan puasa, bukan sekadar kedermawanan yang bersifat pilihan.",
      'Al-Qur\'an secara konsisten menyandingkan zakat dengan shalat sebagai tanda iman yang sejati, dan menjanjikan bahwa orang-orang yang melaksanakan shalat dan menunaikan zakat "mendapat pahala di sisi Tuhannya. Tidak ada rasa takut pada mereka dan mereka tidak bersedih hati." Secara finansial, zakat berfungsi sebagai sarana penyucian harta — menyalurkan bagian kecil yang rutin dari harta yang terkumpul kepada mereka yang membutuhkan, alih-alih membiarkannya mengendap tanpa batas di tangan segelintir orang.',
      "Karena perhitungannya bergantung pada tabungan, aset, dan nilai nisab setempat Anda, aplikasi ini memiliki panduan dan kalkulator Zakat khusus — gunakan itu secara langsung daripada memperkirakan dari prinsip-prinsip umum di sini.",
    ],
    appLinks: [{ label: "Panduan dan kalkulator zakat" }],
  },
  {
    title: "Sedekah: Pemberian Sukarela",
    summary:
      "Di luar zakat yang wajib, setiap pemberian sukarela disebut sedekah — dan sesungguhnya ia tidak pernah merugikan Anda.",
    body: [
      "Sedekah adalah derma sukarela, yang diberikan dalam jumlah berapa pun dan kapan pun, karena Allah — di luar kewajiban zakat yang telah ditentukan. Bentuknya beragam, dari pemberian harta yang besar hingga hal sekecil kata-kata yang baik atau menyingkirkan gangguan dari jalan orang lain, yang semuanya terhitung sebagai bentuk sedekah dalam literatur hadits.",
      "Salah satu ajaran yang paling menenangkan bagi siapa pun yang ragu untuk memberi adalah sabda Nabi ﷺ bahwa sedekah tidak mengurangi harta — hal yang juga didukung Al-Qur'an di tempat lain dengan menggambarkan infak di jalan Allah sebagai sesuatu yang akan Allah ganti dan balas, bukan sekadar sesuatu yang habis.",
      "Secara praktis, ini mengubah cara pandang terhadap kedermawanan: memberi tidak bertentangan dengan keamanan finansial Anda, melainkan digambarkan sebagai sesuatu yang melindungi dan menumbuhkannya, dengan cara yang tidak selalu tampak di neraca keuangan.",
    ],
    appLinks: [{ label: "Panduan zakat & sedekah" }, { label: "Target sedekah" }],
  },
  {
    title: "Takaful: Berbagi Risiko secara Tolong-Menolong",
    summary: "Gambaran umum tentang konsep di balik alternatif Islami bagi asuransi konvensional.",
    body: [
      "Takaful (dari akar kata Arab yang berarti saling menjamin) adalah konsep umum di balik pendekatan Islami terhadap perlindungan yang menyerupai asuransi: sekelompok peserta berkontribusi ke dana bersama, dan dana itu digunakan untuk membantu anggota yang mengalami kerugian yang ditanggung, dengan surplus yang biasanya dibagikan kepada para peserta atau dibawa ke periode berikutnya, bukan disimpan sebagai keuntungan terjamin milik perusahaan asuransi yang terpisah.",
      "Gagasan dasarnya adalah berbagi risiko secara tolong-menolong, bukan memindahkan risiko dengan imbalan premi yang dijamin: para peserta dipandang saling membantu satu sama lain, sementara pengelola dana biasanya bertindak sebagai pengelola atau wakil dengan imbalan jasa, bukan sebagai pihak yang menanggung risiko itu sendiri.",
      "Ini hanyalah gambaran umum yang bersifat konseptual. Produk takaful yang sebenarnya sangat beragam strukturnya antarpenyedia dan antarnegara, dan menilai apakah suatu program tertentu benar-benar disusun dengan cara ini memerlukan peninjauan ketentuan yang sebenarnya bersama ulama atau lembaga keuangan Islam yang berkompeten — aplikasi ini tidak merekomendasikan atau menilai penyedia atau program takaful (maupun asuransi) tertentu.",
    ],
    disclaimer:
      "Hanya edukasi umum. Ini bukan rekomendasi untuk memilih takaful daripada asuransi konvensional, maupun rekomendasi penyedia atau program tertentu — konsultasikan dengan penasihat yang berkompeten sesuai keadaan Anda.",
  },
  {
    title: "Takaful dan Asuransi Konvensional: Perbandingan Secara Umum",
    summary:
      "Keduanya memiliki tujuan yang sama — mengelola risiko — tetapi berbeda dalam cara risiko itu disusun.",
    body: [
      "Asuransi konvensional biasanya disusun sebagai akad di mana pemegang polis membayar premi dan perusahaan asuransi, sebagai pihak komersial yang terpisah, menanggung risiko dengan imbalan premi tersebut, dan sering kali menginvestasikan kumpulan premi dengan cara yang dapat mencakup instrumen berbunga. Sebagian ulama klasik menyampaikan kekhawatiran bahwa struktur ini bersinggungan dengan riba, gharar (ketidakpastian berlebihan tentang pembayaran klaim), dan pemindahan risiko dengan imbalan tetap, bukan risiko yang ditanggung bersama.",
      "Secara umum, takaful dikembangkan sebagai upaya untuk menjawab kekhawatiran-kekhawatiran tersebut melalui struktur yang bersifat saling menanggung dan tolong-menolong — meskipun para ulama dan lembaga berbeda pendapat tentang struktur mana yang benar-benar mencapai tujuan itu, dan rancangan para penyedia takaful sendiri cukup beragam.",
      "Karena baik kekhawatiran maupun struktur alternatifnya melibatkan rincian teknis yang nyata (dan karena keadaan pribadi seperti lokasi, kebutuhan perlindungan, dan penyedia yang tersedia sangat beragam), perbandingan ini disajikan hanya sebagai latar belakang umum — bukan hukum atas polis tertentu yang mungkin sedang Anda pertimbangkan.",
    ],
    disclaimer:
      "Hanya perbandingan edukatif, bukan fatwa tentang asuransi atau takaful secara umum maupun tentang produk tertentu. Para ulama memiliki beragam pandangan tentang struktur asuransi modern; konsultasikan dengan penasihat yang berkompeten sesuai situasi Anda.",
  },
  {
    title: "Tanya Jawab: Apakah Ini Nasihat Keuangan?",
    summary:
      "Bukan — panduan ini hanya mengajarkan prinsip, dan tidak dapat menggantikan nasihat yang berkompeten.",
    body: [
      "T: Dapatkah saya menggunakan panduan ini untuk memutuskan apakah suatu pinjaman, investasi, atau produk asuransi tertentu boleh bagi saya? J: Tidak. Panduan ini menjelaskan prinsip-prinsip Islam yang umum tentang uang — panduan ini tidak meninjau akad, tidak merekomendasikan produk, dan tidak mengeluarkan hukum. Keputusan keuangan tertentu sebaiknya diambil bersama profesional keuangan yang berkompeten dan, untuk pertanyaan tentang kebolehannya, bersama ulama keuangan Islam yang berkompeten.",
      "T: Apakah aplikasi ini menilai atau mencantumkan saham, reksa dana, atau ETF yang halal? J: Tidak, dan tidak akan pernah sebagai bagian dari panduan ini — penyaringan reksa dana dan rekomendasi investasi berada di luar cakupannya serta memerlukan keahlian keuangan berlisensi yang tidak diberikan oleh konten ini.",
      "T: Apakah panduan ini sebuah fatwa? J: Bukan. Fatwa adalah ketetapan hukum agama tertentu yang dikeluarkan oleh ulama yang berkompeten sebagai jawaban atas pertanyaan dan konteks tertentu. Panduan ini hanya mengajarkan prinsip-prinsip umum; untuk hukum yang sebenarnya atas situasi Anda, carilah langsung ulama yang berkompeten dan tepercaya.",
    ],
    disclaimer:
      "Seluruh panduan ini adalah konten edukasi, bukan nasihat keuangan dan bukan fatwa. Selalu konsultasikan dengan profesional keuangan dan agama yang berkompeten untuk keputusan mengenai uang Anda sendiri.",
  },
  {
    title: "Tanya Jawab: Bagaimana Menemukan Pilihan yang Sesuai Syariah?",
    summary:
      "Carilah keahlian yang bersertifikat, bukan daftar — aplikasi ini sengaja tidak menyediakannya.",
    body: [
      "T: Di mana saya bisa menemukan daftar bank, reksa dana, atau platform investasi yang halal? J: Tidak di aplikasi ini, dan memang disengaja — daftar produk terus berubah, sangat berbeda antarnegara, dan memerlukan pemantauan kepatuhan berkelanjutan yang hanya dapat dilakukan dengan baik oleh lembaga khusus. Sebaliknya, carilah lembaga yang memiliki dewan pengawas syariah yang nyata dan disebutkan namanya, serta metodologi kepatuhan yang dipublikasikan.",
      "T: Bagaimana saya tahu apakah seorang ulama atau sertifikasi itu sah? J: Carilah ulama atau dewan yang diakui oleh lembaga penetap standar keuangan Islam yang mapan di wilayah Anda atau di tingkat internasional, bukan klaim tidak resmi di internet. Lembaga yang bereputasi baik akan terbuka tentang siapa yang meninjau produk-produknya dan bagaimana caranya.",
      "T: Apa yang harus saya lakukan jika tidak menemukan pilihan keuangan Islam di tempat tinggal saya? J: Ini adalah situasi yang nyata dan umum. Diskusikan dengan imam atau ulama setempat yang berilmu — mereka dapat membantu Anda menimbang pilihan yang tersedia sesuai keadaan Anda, karena bimbingan dalam hal ini sangat bergantung pada alternatif yang benar-benar ada bagi Anda.",
    ],
    actions: [
      "Carilah lembaga yang memiliki dewan pengawas syariah yang transparan dan disebutkan namanya, alih-alih mengandalkan klaim pemasaran.",
    ],
  },
  {
    title: "Tanya Jawab: KPR, Kartu Kredit, dan Pinjaman",
    summary: "Inilah justru pertanyaan yang memerlukan ulama yang berkompeten, bukan panduan umum.",
    body: [
      "T: Apakah KPR selalu termasuk riba? J: Strukturnya beragam — sebagian KPR konvensional adalah pinjaman berbasis bunga, sementara sebagian penyedia menawarkan struktur alternatif (seperti kemitraan menurun/musyarakah mutanaqisah atau model sewa-beli) yang dimaksudkan untuk menghindari bunga. Apakah suatu produk tertentu benar-benar mencapai hal itu dalam praktik adalah pertanyaan keilmuan tentang akadnya yang sebenarnya, bukan sesuatu yang boleh diasumsikan ke salah satu arah.",
      "T: Bolehkah saya menggunakan kartu kredit jika saya selalu melunasi seluruh tagihan dan tidak pernah terkena bunga? J: Para ulama berbeda pendapat dalam hal ini, sebagian karena perjanjian dasarnya secara teknis mungkin tetap memuat klausul bunga meskipun Anda tidak pernah memicunya dalam praktik. Ini adalah wilayah perbedaan pendapat yang sah di antara para ahli — tanyakan kepada ulama yang Anda percayai, alih-alih mengasumsikan satu jawaban yang berlaku untuk semua.",
      "T: Bagaimana dengan pinjaman pendidikan atau pinjaman lain yang dalam keadaan tertentu mungkin tidak dapat dihindari? J: Keadaan darurat dan kesulitan adalah pertimbangan nyata yang ditimbang para ulama dengan cermat, dan pandangan berbeda-beda sesuai keadaan dan yurisdiksi. Jika Anda menghadapi keputusan ini, bawalah situasi Anda secara khusus kepada ulama yang berkompeten, alih-alih mencoba menyelesaikannya hanya dari bacaan umum.",
    ],
    disclaimer:
      "Ini adalah pertanyaan-pertanyaan yang memang diperselisihkan dan bergantung pada akad masing-masing. Tanya jawab ini hanya menunjukkan jenis pertanyaan apa masing-masing itu — tidak menjawab satu pun di antaranya untuk situasi Anda.",
  },
];
