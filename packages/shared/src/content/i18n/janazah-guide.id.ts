import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// id overlay for janazah-guide. Index-aligned with JANAZAH_GUIDE_TOPICS in ../janazah-guide.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const JANAZAH_GUIDE_TOPICS_ID: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Sebuah kewajiban bersama",
    summary: "Janazah adalah fardhu kifayah yang wajib dipenuhi oleh masyarakat.",
    body: [
      "Sholat jenazah (Salat al-Janazah) merupakan kewajiban berjamaah (fardhu kifayah): jika sebagian masyarakat melaksanakannya, maka kewajiban tersebut hilang dari sebagian yang lain; jika tidak ada yang melakukan hal tersebut, semua ikut menyalahkan. Sholat ini dilakukan sambil berdiri, tanpa ruku atau sujud – salah satu bentuk sholat yang khas.",
      "Abu Hurairah meriwayatkan bahwa Rasulullah ﷺ bersabda: 'Barangsiapa yang menghadiri pemakaman hingga salat dipanjatkan, ia mendapat satu qirat (pahala), dan siapa pun yang menghadiri hingga pemakaman, ia mendapat dua qirat.' Dia ditanya apa itu qirat, dan dia menjawab: 'Seperti dua gunung besar' (Sahih al-Bukhari 1325; Sahih Muslim 945).",
      "Setelah pemakaman, membantu mencuci dan menguburkan sesuai kesanggupan, serta mendoakan orang yang meninggal adalah hak-hak seorang muslim terhadap orang lain. Perlakukan tubuh dengan bermartabat dan hindari pemborosan atau praktik tanpa bukti.",
    ],
    actions: [
      "Tanggapi dengan cepat ketika pemakaman diumumkan di komunitas Anda.",
      "Niatkanlah shalat dan kehadirannya karena Allah, bukan untuk pamer sosial.",
      "Bantulah memenuhi kebutuhan praktis keluarga bila Anda dapat melakukannya dengan hormat.",
    ],
    hadith: [
      {
        excerpt:
          "Barangsiapa yang menghadiri pemakaman hingga ia melaksanakan salat jenazah, maka ia mempunyai satu qirat, dan siapa pun yang menghadiri hingga pemakaman, maka ia mempunyai dua qirat, yang masing-masing bagaikan gunung besar.",
      },
      {
        excerpt:
          "Barangsiapa yang mengikuti pemakaman seorang muslim karena keimanan dan mencari pahala, dan tetap tinggal sampai shalat dipanjatkan dan selesai pemakamannya, maka ia kembali dengan membawa dua qirat...",
      },
    ],
  },
  {
    title: "Mencuci dan menyelubungi",
    summary: "Mandi orang yang meninggal dan kafan sederhana — bermartabat tanpa pemborosan.",
    body: [
      "Umat Islam yang meninggal (selain syahid di medan perang pada masa pemerintahan klasik) dimandikan dengan air suci, kemudian dibungkus dengan kain putih bersih. Ummu Atiyyah meriwayatkan bahwa Nabi ﷺ bersabda mengenai pencucian putrinya: 'Cucilah dia tiga atau lima kali, atau lebih jika kamu mau, dengan air dan sidr, dan masukkan kapur barus - atau kapur barus - di bagian terakhir' (Sahih al-Bukhari 1253).",
      "Aisha melaporkan bahwa Rasulullah ﷺ diselimuti tiga pakaian katun Yaman berwarna putih, di antaranya tidak ada kemeja atau sorban (Sahih al-Bukhari 1264; Sahih Muslim 941). Kesederhanaan adalah sunnahnya; pertunjukan mahal bertentangan dengan contoh nubuatan.",
      "Siapa yang mencuci siapa, berapa banyak baju laki-laki dan perempuan, serta rincian terkait mempunyai perbedaan madzhab. Keluarga harus mengikuti pemandu lokal yang berpengetahuan atau layanan pemakaman yang mengetahui praktik sekolah — gambaran umum ini bukanlah panduan mencuci.",
    ],
    actions: [
      "Tunjuklah orang-orang yang dapat dipercaya dan berjenis kelamin sama dengan almarhum jika memungkinkan.",
      "Jaga agar kain kafan tetap sederhana dan bersih — kain putih adalah model kenabian.",
      "Hindari memotret atau mengekspos tubuh jika tidak diperlukan.",
    ],
    hadith: [
      {
        excerpt:
          "Cucilah dia tiga kali, atau lima kali, atau lebih jika Anda menganggapnya perlu, dengan air dan sidr, dan masukkan kapur barus atau kapur barus pada pencucian terakhir.",
      },
      {
        excerpt:
          "Rasulullah ﷺ diselimuti tiga pakaian katun Yaman berwarna putih; tidak ada kemeja atau sorban di antara mereka.",
      },
    ],
  },
  {
    title: "Saat menutup mata almarhum",
    summary: "Doa kenabian pada saat kematian.",
    body: [
      "Ummu Salamah meriwayatkan bahwa Rasulullah ﷺ mendatangi Abu Salamah dalam keadaan matanya sudah terpaku. Dia menutupnya dan berkata: 'Ketika jiwa diambil, pandangan mengikutinya,' dan orang-orang di rumahnya menangis. Beliau kemudian mengajari mereka untuk hanya mengucapkan apa yang baik, karena para malaikat mengucapkan amin atas apa yang mereka ucapkan, dan beliau mendoakan Abu Salamah (Sahih Muslim 920).",
      "Entri Hisnul Muslim yang dibundel di bawah ini mempertahankan kata-kata yang digunakan saat menutup mata. Berbicaralah dengan lembut, hindari meratap yang dilarang Nabi ﷺ, dan penuhi lidah dengan kata-kata yang baik dan memohon ampun.",
    ],
    actions: [
      "Tutup mata dengan lembut dan ucapkan doa yang otentik.",
      "Ingatkan keluarga untuk berbicara yang baik.",
    ],
    hadith: [
      {
        excerpt:
          "Ketika mata Abu Salamah terpaku, Nabi ﷺ menutupnya dan bersabda, bila ruh diambil maka penglihatan pun mengikutinya, lalu mengajarkan seisi rumah untuk berbicara yang baik saja.",
      },
    ],
  },
  {
    title: "Cara Sholat Janazah",
    summary: "Sholat berdiri dengan empat takbir — tanpa ruku atau sujud.",
    body: [
      "Sholat jenazah dilakukan sambil berdiri. Tidak ada ruku, tidak ada sujud, tidak ada adzan dan iqamah. Imam berdiri di depan kepala almarhum laki-laki atau di tengah-tengah almarhum perempuan menurut riwayat Anas dan Samurah (lihat Abu Dawud 3194 dan riwayat terkait), dan jemaah membentuk barisan di belakang.",
      "Sholatnya terdiri dari empat takbir. Setelah yang pertama dibacakan Surat al-Fatihah (Bukhari 1335). Setelah takbir kemudian, shalawat kepada Nabi ﷺ dan doa untuk almarhum dipanjatkan. Doa diakhiri dengan taslim. Jabir meriwayatkan bahwa Nabi ﷺ memanjatkan salat jenazah untuk Negus (raja Abyssinian) dan mengucapkan empat takbir (Sahih al-Bukhari 1334).",
      "Mereka yang terlambat takbir harus mengikuti imam dan menyelesaikan apa yang mereka lewatkan sesuai dengan aturan sekolah untuk mengejar ketinggalan — tanyakan kepada imam atau guru setempat jika tidak yakin.",
    ],
    actions: [
      "Berdiri dalam barisan; jangan membungkuk atau sujud.",
      "Ucapkan empat takbir bersama imam.",
      "Doa ikhlas untuk almarhum setelah takbir yang tepat.",
    ],
    hadith: [
      {
        excerpt: "Nabi ﷺ memanjatkan salat jenazah Negus dan mengucapkan empat takbir.",
      },
      {
        excerpt:
          "Ibnu Abbas melaksanakan salat jenazah dan membacakan Fatihah, dengan mengatakan bahwa itu berasal dari sunnah.",
      },
    ],
  },
  {
    title: "Duas dalam doa pemakaman (dewasa)",
    summary: "Kata-kata Hisnul Muslim yang otentik untuk almarhum.",
    body: [
      "Setelah takbir, inti Janazah adalah doa untuk almarhum – memohon kepada Allah untuk mengampuni mereka, menunjukkan belas kasihan kepada mereka, dan memberi mereka surga. Beberapa kata-kata otentik disimpan dalam Hisnul Muslim dari Nabi ﷺ.",
      "Buka doa tertaut di bawah ini untuk membaca dalam bahasa Arab, transliterasi, dan makna. Anda mungkin mempelajari lebih dari satu kata-kata otentik; ketulusan lebih penting daripada panjangnya.",
    ],
    actions: [
      "Hafalkan setidaknya satu doa Janazah yang otentik.",
      "Ucapkan doa umum untuk semua Muslim yang meninggal saat Anda hadir.",
    ],
  },
  {
    title: "Lebih banyak doa doa pemakaman",
    summary: "Tambahan kata-kata otentik dari Hisnul Muslim.",
    body: [
      "Hisnul Muslim melestarikan kata-kata doa pemakaman lebih lanjut yang diajarkan dari Nabi ﷺ. Gunakan secara bergilir atau pelajari salah satu yang paling diketahui oleh komunitas Anda.",
      "Untuk anak yang meninggal, doa khusus memohon kepada Allah agar menjadikan anak tersebut sebagai cikal bakal dan simpanan pahala bagi orang tuanya — lihat topik selanjutnya.",
    ],
  },
  {
    title: "Doa pemakaman #3",
    summary: "Kata-kata otentik lainnya untuk orang dewasa yang meninggal.",
    body: [
      "Kata-kata Hisnul Muslim selanjutnya untuk doa pemakaman. Ucapkanlah setelah takbir yang sesuai sesuai dengan praktik imam Anda.",
    ],
  },
  {
    title: "Doa pemakaman #4",
    summary: "Rumusan shahih keempat dari korpus sunnah.",
    body: [
      "Hisnul Muslim menyertakan doa doa pemakaman tambahan ini. Pilih keaslian dan kehadiran hati daripada mengumpulkan setiap kata sekaligus.",
    ],
  },
  {
    title: "Doa untuk anak yang sudah meninggal",
    summary: "Doa kenabian khusus bila yang meninggal masih anak-anak.",
    body: [
      "Jika yang meninggal masih anak-anak, doa shahih memohon kepada Allah agar menjadikan anak tersebut sebagai harta terpendam, cikal bakal, dan syafaat yang terkabul bagi orang tua. Entri Hisnul Muslim di bawah mempertahankan kata-kata tersebut.",
      "Hiburlah keluarga dengan harapan akan rahmat Allah sambil menghindari ritual-ritual yang dibuat-buat. Struktur Janazah empat takbir yang sama juga berlaku; isi doa itulah yang berubah.",
    ],
    actions: [
      "Gunakan doa khusus anak bila diperlukan.",
      "Dukung orang tua yang berduka dengan kehadiran dan bantuan halal.",
    ],
  },
  {
    title: "Doa pemakaman anak #2",
    summary: "Kata-kata Hisnul Muslim Kedua untuk anak yang meninggal.",
    body: ["Satu lagi kalimat shahih untuk doa pemakaman anak yang tersimpan dalam Hisnul Muslim."],
  },
  {
    title: "Pemakaman dan kuburan",
    summary: "Menurunkan jenazah, menghadap kiblat, dan doa setelah dimakamkan.",
    body: [
      "Almarhum dimakamkan di bumi menghadap kiblat, dengan bermartabat dan tanpa penundaan melebihi persiapan yang diperlukan. Nabi ﷺ bersabda: 'Segeralah pemakamannya...' (Sahih al-Bukhari 1315 — mempercepat pemakaman).",
      "Saat menempatkan almarhum di kuburan, doa otentik disimpan dalam Hisnul Muslim. Setelah penguburan, Nabi ﷺ akan berdiri di depan kubur dan bersabda: 'Mintalah ampun untuk saudaramu, dan mohon agar dia diteguhkan, karena dia sekarang sedang ditanyai' (Sunan Abi Dawud 3221 — dinilai sahih oleh banyak ulama kemudian termasuk al-Albani).",
      "Membangun struktur hiasan di atas kuburan, melapisinya untuk hiasan, atau menulis yang mendorong pernyataan yang berlebihan dilarang dalam laporan otentik. Jaga agar tanda tetap sederhana jika hukum dan adat istiadat setempat memperbolehkan identifikasi.",
    ],
    hadith: [
      {
        excerpt:
          "Bersikaplah segera dalam pemakamannya: jika pemakamannya benar, Anda mempercepatnya menuju kebaikan; jika sebaliknya, Anda melepaskan kejahatan dari leher Anda.",
      },
      {
        excerpt:
          "Mintalah ampun kepada saudaramu dan mohon agar ia diteguhkan, karena ia kini sedang ditanyai.",
      },
    ],
  },
  {
    title: "Setelah menguburkan jenazah",
    summary: "Doa untuk ketabahan di alam kubur.",
    body: [
      "Berdiri sebentar setelah pemakaman untuk memohon ampunan dan ketabahan bagi almarhum ditegakkan dari Nabi ﷺ (Abu Dawud 3221). Kata-kata Hisnul Muslim di bawah ini adalah untuk setelah penguburan.",
      "Bersedekah, berdoa, dan memenuhi wasiat almarhum yang sah akan memberikan manfaat bagi mereka dengan izin Allah — tanpa menciptakan upacara tahunan yang tidak memiliki bukti.",
    ],
    actions: [
      "Berdoalah di kubur setelah penguburan.",
      "Lanjutkan doa pribadi dan sedekah untuk almarhum.",
    ],
  },
  {
    title: "Mengunjungi kuburan",
    summary: "Salam profetik ketika ziarah kubur.",
    body: [
      "Berziarah ke kuburan mengingatkan kita akan kehidupan akhirat. Buraidah meriwayatkan bahwa Rasulullah ﷺ biasa mengajari mereka mengucapkan ketika mereka pergi ke pekuburan: salam sejahtera bagi para penghuni rumah di kalangan orang-orang mukmin dan kaum muslimin, penegasan bahwa kami – Insya Allah – akan bergabung dengan mereka, dan memohon kesejahteraan bagi kami dan mereka (Sahih Muslim 975; kata-kata juga dalam Ibnu Majah).",
      "Entri Hisnul Muslim di bawah ini mempertahankan salam itu. Jaga agar kunjungan bebas dari ratapan, mencari bantuan dari orang mati, atau ritual tanpa bukti.",
    ],
    actions: [
      "Sapa penghuni kuburan dengan perkataan yang shahih.",
      "Merenungkan kematian dan memperbaharui amal shaleh.",
    ],
    hadith: [
      {
        excerpt:
          "Assalamu'alaikum wahai penghuni tempat tinggal orang-orang mukmin dan kaum muslimin. Kami akan — Insya Allah — bergabung dengan Anda. Kami memohon kepada Allah kesejahteraan bagi kami dan Anda.",
      },
    ],
  },
  {
    title: "Pengingat dan kesalahan umum",
    summary: "Hindari meratap, menunda pertunjukan, dan melakukan ritual yang tidak berdasar.",
    body: [
      "Nabi ﷺ melarang meratapi orang mati sambil membiarkan kesedihan berlinang air mata. Abdullah bin Umar melaporkan bahwa Sa'd bin Ubadah menangis di pemakaman dan Nabi ﷺ menjelaskan bahwa Allah tidak menghukum karena air mata atau kesedihan hati, tetapi untuk ini - dan dia menunjuk ke lidahnya (Sahih al-Bukhari 1304).",
      "Jangan menunda penguburan untuk acara-acara bergengsi, dan jangan pula menghabiskan banyak uang untuk membeli kain kafan dan berpesta sambil mengabaikan orang-orang miskin. Jangan membaca atau mengamalkan inovasi yang dikaitkan dengan pemakaman tanpa dasar yang otentik. Belasungkawa, doa renungan, dan bantuan praktis untuk keluarga adalah jalan yang sunnah.",
      "Kehadiran perempuan pada acara sembahyang dan penguburan diperlakukan dengan nuansa berbeda di berbagai sekolah dan era; ikuti panduan lokal yang dapat dipercaya dan menghormati batasan belas kasih dan kenabian.",
    ],
    disclaimer:
      "Tinjauan pendidikan — bukan panduan atau fatwa direktur pemakaman. Praktek sekolah setempat mengenai peraturan mencuci, mengafani, dan pemakaman harus dikonfirmasikan kepada orang-orang yang berkompeten.",
    actions: [
      "Bersedihlah tanpa ratapan atau ucapan terlarang.",
      "Percepat penguburan yang bermartabat.",
      "Membantu keluarga dalam hal makanan dan urusan tanpa membebani mereka dengan pemborosan.",
    ],
    hadith: [
      {
        excerpt:
          "Allah tidak menghukum karena air mata atau kesedihan hati, tetapi Dia menghukum atau memberikan rahmat atas hal ini - dan Dia menunjuk ke lidahnya.",
      },
    ],
  },
  // --- v2 appended topics (keep index-aligned with English) ---
  {
    title: "Takbir demi takbir — langkah-langkah sholat",
    summary: "Daftar praktis empat takbir dan apa yang diucapkan di antaranya.",
    body: [
      "Takbir pertama: angkat tangan (sesuai mazhab Anda), ucapkan Allahu Akbar, lalu baca Surat al-Fatihah. Ibnu Abbas membaca al-Fatihah dalam salat jenazah dan mengatakan itu dari sunnah (Sahih al-Bukhari 1335).",
      "Takbir kedua: kirimkan shalawat kepada Nabi ﷺ — shalawat Ibrahimiyah yang sama dipakai dalam tasyahud banyak diajarkan untuk langkah ini. Takbir ketiga: panjatkan doa yang ikhlas untuk almarhum (lafadz Hisnul Muslim dalam panduan ini). Takbir keempat: banyak ulama kemudian berdoa singkat secara umum, lalu menutup dengan salam ke kanan (dan ke kiri, sesuai mazhab).",
      "Tidak ada ruku, sujud, atau duduk. Berdiri sepanjang salat. Jika ada beberapa jenazah, satu Janazah dengan niat untuk semua diamalkan di banyak komunitas — ikuti imam. Posisi shalawat versus doa bisa sedikit berbeda menurut madzhab; kerangka empat takbir tetap sama.",
    ],
    madhhabNote:
      "Manual Hanafi, Maliki, Syafi'i, dan Hanbali berbeda soal apakah tangan diangkat setiap takbir dan tepat kapan doa diucapkan. Ikuti imam di depan Anda.",
    actions: [
      "Pelajari urutan empat takbir sebelum Anda membutuhkannya.",
      "Hafalkan Fatihah, shalawat, dan setidaknya satu doa jenazah.",
    ],
    hadith: [
      {
        excerpt:
          "Ibnu Abbas melaksanakan salat jenazah dan membacakan Fatihah, dengan mengatakan bahwa itu berasal dari sunnah.",
      },
    ],
  },
  {
    title: "Doa untuk laki-laki, perempuan, dan anak-anak",
    summary: "Lafadz kenabian yang sama — sesuaikan kata ganti Arab dengan almarhum.",
    body: [
      "Hisnul Muslim (dan koleksi hadits klasik) mencatat doa Janazah terutama dalam bentuk maskulin. Itu bukan berarti doa 'ciptaan' terpisah untuk perempuan. Ulama arus utama mengajarkan bahwa Anda boleh mempertahankan lafadz maskulin dengan niat untuk orang tersebut, atau — lebih utama dan umum — mengubah tata bahasa agar sesuai almarhum: لَهُ / هُ / هِ → لَهَا / هَا; عَبْدُكَ → أَمَتُكَ; ابْنُ أَمَتِكَ → ابْنَةُ أَمَتِكَ; dan untuk anak perempuan اجْعَلْهُ → اجْعَلْهَا, شَفِيعًا مُجَابًا → شَفِيعَةً مُجَابَةً.",
      "Untuk wanita yang meninggal, sebagian ulama menasihati kehati-hatian dengan frasa 'pasangan yang lebih baik dari pasangannya' (زَوْجًا خَيْرًا مِنْ زَوْجِهَا), karena ia mungkin bersatu kembali dengan suaminya di Surga — Anda boleh menghilangkan klausa itu atau memakai lafadz umum. Untuk anak-anak, gunakan entri Hisnul khusus anak (hisn-160, hisn-161) daripada hanya teks dewasa yang berfokus pada ampunan.",
      "Lafadz kolektif 'ampunilah laki-laki dan perempuan kami' (hisn-157) sudah mencakup kedua jenis kelamin tanpa perubahan. Kita tidak mengada-adakan bahasa Arab baru selain adaptasi gramatikal teks yang sahih — buka doa dewasa tertaut sebagai dasar dan terapkan peta kata ganti di atas.",
    ],
    madhhabNote:
      "Mempertahankan bentuk maskulin dengan niat dan menyesuaikan bentuk feminin keduanya diterima di kalangan ulama arus utama. Jika ragu, gunakan hisn-157 (laki-laki dan perempuan) atau tanya imam.",
    actions: [
      "Latih penggantian kata ganti feminin untuk doa yang Anda hafal.",
      "Gunakan doa khusus anak bagi mereka yang belum baligh.",
      "Utamakan keaslian daripada booklet panjang yang tidak bersanad.",
    ],
    appLinks: [{ label: "Doa jenazah dewasa #1" }],
  },
  {
    title: "Syuhada, keguguran, dan kasus khusus",
    summary: "Ketika hukum memandikan atau Janazah berbeda dari kasus biasa.",
    body: [
      "Syuhada medan perang yang gugur dalam pertempuran, menurut hukum klasik dari Uhud, dikuburkan dengan pakaian mereka tanpa ghusl biasa; Nabi ﷺ memerintahkan syuhada Uhud dikuburkan dengan darah mereka dan tanpa dimandikan (Sahih al-Bukhari 1346). Kategori lain yang disebut 'syahid' dalam pahala (mis. wabah, tenggelam) biasanya tetap dimandikan dan dishalatkan Janazah — tanyakan ulama untuk kasus perbatasan.",
      "Untuk keguguran atau bayi lahir mati, mazhab berbeda soal kapan salat jenazah dan mandi sempurna berlaku (sering terkait bentuk yang dapat dikenali atau tahap peniupan ruh). Sebuah hadits menganjurkan menyalatkan keguguran dan memohon ampunan serta rahmat bagi orang tua (Abu Dawud 3180). Ikuti panitia jenazah mazhab Anda, jangan menebak sendiri.",
      "Kerabat non-Muslim tidak diberi salat Janazah Muslim; kebaikan, bantuan penguburan yang halal bila relevan, dan duka pribadi terpisah dari salat ritual bagi orang beriman. Selalu konfirmasikan kasus khusus dengan panduan lokal yang kompeten.",
    ],
    madhhabNote:
      "Definisi syahid medan perang, tahap keguguran, dan salat atas bayi lahir mati berbeda antarmazhab. Topik ini menandai isu tersebut — bukan fatwa.",
    disclaimer:
      "Hukum khusus bersifat sensitif. Konfirmasikan dengan ulama yang kompeten atau layanan jenazah komunitas Anda sebelum bertindak.",
    actions: [
      "Jangan memandikan syahid medan perang bertentangan dengan arahan ulama.",
      "Tanyakan panitia jenazah tentang kasus keguguran atau lahir mati.",
    ],
    hadith: [
      {
        excerpt:
          "Nabi ﷺ memerintahkan agar syuhada Uhud dikuburkan dengan darah mereka, dan mereka tidak dimandikan.",
      },
      {
        excerpt:
          "Salat jenazah dipanjatkan atas keguguran, dan orang tua didoakan dengan ampunan serta rahmat.",
      },
    ],
  },
  {
    title: "Janazah ghaib",
    summary: "Nabi ﷺ menyalatkan Negus ketika jenazah jauh.",
    body: [
      "Jabir meriwayatkan bahwa Nabi ﷺ keluar menemui para Sahabat, merapikan barisan mereka, dan bertakbir empat kali untuk Negus (al-Najashi), raja Habsyi yang meninggal di negeri jauh (Sahih al-Bukhari 1334; Sahih Muslim 952). Ini adalah dalil utama Salat al-Janazah ghaib (alā al-ghā'ib).",
      "Mazhab berbeda soal seberapa luas preceden itu diterapkan: sebagian membatasinya pada kasus seperti Negus (tidak ada salat Muslim setempat), sebagian membolehkannya lebih luas ketika jenazah jauh. Jangan melewatkan Janazah lokal ketika jenazah hadir dan komunitas dapat shalat. Ikuti ulama lokal terpercaya untuk kapan salat ghaib sesuai mazhab Anda.",
      "Bentuknya sama: salat empat takbir; niatnya untuk almarhum yang tidak hadir. Gunakan doa sahih yang sama, sesuaikan jenis kelamin bila perlu.",
    ],
    madhhabNote:
      "Cakupan Janazah ghaib adalah titik perbedaan yang dikenal. Utamakan praktik imam yang kompeten di komunitas Anda.",
    actions: [
      "Shalat secara lokal setiap kali jenazah hadir.",
      "Bertanya dulu sebelum mengadakan Janazah ghaib sebagai acara publik.",
    ],
    hadith: [
      {
        excerpt: "Nabi ﷺ memanjatkan salat jenazah Negus dan mengucapkan empat takbir.",
      },
      {
        excerpt:
          "Rasulullah ﷺ merapikan barisan para Sahabat dan menyalatkan Negus dengan empat takbir.",
      },
    ],
  },
  {
    title: "Di sisi orang sekarat — kata terakhir",
    summary: "Bimbing orang sekarat mengucapkan la ilaha illallah dengan lembut.",
    body: [
      "Nabi ﷺ bersabda: 'Talqinilah orang yang sekarat di antara kalian dengan la ilaha illallah' (Sahih Muslim 916; Abu Dawud 3117). Hisnul Muslim menjaga ajaran bahwa barangsiapa yang kata terakhirnya 'Tidak ada yang berhak disembah kecuali Allah' akan masuk Surga (hisn-153, dari Abu Dawud 3116).",
      "Talqinilah dengan lembut tanpa kekerasan; jangan memaksa atau berdebat. Orang yang mendekati ajal juga dapat dihibur dengan kata-kata harapan sahih dalam Hisnul Muslim (hisn-150–152). Tutup mata ketika ruh dicabut dan gunakan doa menutup mata (topik sebelumnya).",
      "Hindari ratapan keras dan ucapan yang memurkai Allah. Keluarga hendaknya mengucapkan yang baik, karena para malaikat mengucapkan amin atas perkataan mereka (Sahih Muslim 920).",
    ],
    actions: [
      "Ingatkan orang sekarat tentang syahadah dengan lembut.",
      "Jaga ruangan tetap tenang dan terisi ucapan yang baik.",
    ],
    hadith: [
      {
        excerpt: "Talqinilah orang yang sekarat di antara kalian: la ilaha illallah.",
      },
      {
        excerpt:
          "Barangsiapa yang kata terakhirnya 'Tidak ada yang berhak disembah kecuali Allah' akan masuk Surga.",
      },
    ],
    appLinks: [{ label: "Doa harapan hidup" }, { label: "Menutup mata" }],
  },
  {
    title: "Takziah dan keluarga yang berduka",
    summary: "Hibur orang yang hidup dengan doa musibah kenabian.",
    body: [
      "Ummu Salamah meriwayatkan bahwa Rasulullah ﷺ bersabda: 'Tidaklah seorang Muslim tertimpa musibah lalu mengucapkan apa yang Allah perintahkan — \"Sesungguhnya kita milik Allah dan kepada-Nya kita kembali. Ya Allah, berilah pahala kepadaku dalam musibahku dan gantilah bagiku dengan yang lebih baik\" — melainkan Allah akan menggantikannya dengan yang lebih baik' (Sahih Muslim 918). Hisnul Muslim menjaga lafadz ini (hisn-154).",
      "Sampaikan belasungkawa dengan kata singkat dan jujur; siapkan makanan untuk keluarga almarhum daripada membebani mereka dengan menjamu (Abu Dawud 3132 — riwayat tentang keluarga Ja'far). Hindari upacara bid'ah berhari tetap tanpa dalil sambil terus berdoa pribadi, bersedekah, dan berbuat baik.",
      "Kesedihan bercucuran air mata diperbolehkan; meratap, menampar pipi, dan merobek pakaian dilarang. Dukung janda, yatim, dan tanggungan dengan bantuan yang halal setelah penguburan.",
    ],
    actions: [
      "Ajarkan keluarga yang berduka doa musibah.",
      "Bantu dengan makanan dan urusan alih-alih mengharapkan jamuan.",
      "Teruskan doa tenang dan sedekah untuk almarhum.",
    ],
    hadith: [
      {
        excerpt:
          "Tidaklah seorang Muslim tertimpa musibah lalu mengucapkan kata-kata yang diperintahkan tentang kembali kepada Allah dan memohon pengganti yang lebih baik, melainkan Allah menggantikannya dengan yang lebih baik.",
      },
    ],
    appLinks: [{ label: "Target sedekah" }],
  },
];
