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
];
