import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Indonesian translation overlay for the Learn ruqyah guide. Mirrors the order of
// RUQYAH_TOPICS in ../ruqyah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const RUQYAH_TOPICS_ID: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Apa itu ruqyah?",
    summary: "Membaca Al-Qur'an, Nama-nama Allah, atau doa kenabian untuk kesembuhan.",
    body: [
      "Ruqyah adalah praktik membacakan Al-Qur'an, Nama dan Sifat Allah, atau doa kenabian yang sahih pada diri sendiri atau orang lain — sering dengan tiupan napas ringan — memohon kesembuhan atau perlindungan hanya dari Allah. Praktik ini sudah ada sebelum Islam sebagai kebiasaan Arab umum, dan Nabi ﷺ pernah ditanya langsung apakah hal itu diperbolehkan.",
      "'Auf bin Malik meriwayatkan bahwa para sahabat berkata: 'Kami biasa melakukan ruqyah di zaman pra-Islam; apa pendapat Anda tentang itu?' Nabi ﷺ menjawab: 'Tunjukkan ruqyah kalian kepadaku — tidak ada masalah dengan ruqyah selama tidak mengandung syirik' (Sahih Muslim 2200). Hadis tunggal ini menjadi dasar bagi segala hal lain dalam panduan ini: ruqyah itu sendiri diperbolehkan; yang penting adalah isinya.",
    ],
    hadith: [
      {
        excerpt:
          "Kami biasa melakukan ruqyah di zaman pra-Islam, dan kami berkata: Ya Rasulullah, apa pendapatmu tentang itu? Beliau bersabda: Tunjukkan ruqyah kalian kepadaku — tidak ada masalah dengan ruqyah selama tidak mengandung syirik.",
      },
    ],
  },
  {
    title: "Ruqyah yang halal vs haram",
    summary: "Al-Qur'an, Nama-nama Allah, dan doa yang jelas — bukan syirik atau hal gaib.",
    body: [
      "Ruqyah yang sah didasarkan pada syarat-syarat yang diambil ulama dari hadis: menggunakan Al-Qur'an, Nama dan Sifat Allah, atau doa kenabian yang sahih; menggunakan bahasa yang maknanya dipahami (bukan suku kata atau simbol yang tidak diketahui); dan orang yang membaca serta orang yang diobati keduanya percaya bahwa ruqyah itu sendiri tidak memiliki kekuatan — kesembuhan hanya dari Allah, dan kata-kata hanyalah sarana yang diizinkan-Nya.",
      "Nabi ﷺ mencontohkan hal ini secara pribadi: Aisyah meriwayatkan bahwa setiap kali beliau sakit, beliau membaca Mu'awwidzat (dua surah terakhir) pada dirinya sendiri dan meniup, dan ketika sakit terakhirnya memburuk, Aisyah melakukan hal yang sama untuknya, mengusap tubuhnya dengan tangannya sendiri mengharap berkahnya (Bukhari 5016). Ini adalah ruqyah dalam bentuknya yang paling jelas dan paling sahih.",
      "Ruqyah menjadi haram ketika melampaui ke syirik: memanggil siapa pun selain Allah, mencari bantuan dari jin, menggunakan kata-kata atau simbol tidak dikenal yang maknanya tidak jelas, menggantung jimat atau azimat, atau mengklaim bahwa praktisi ruqyah memiliki pengetahuan gaib atau kesembuhan yang terjamin. Ruqyah juga tidak pernah menjadi pengganti salat lima waktu atau mencari perawatan medis yang tepat — ia melengkapi keduanya daripada menggantikan salah satunya.",
    ],
    hadith: [
      {
        excerpt:
          "Setiap kali Rasulullah ﷺ sakit, beliau membaca Mu'awwidzat lalu meniupkan napasnya ke tubuhnya. Ketika beliau sakit parah, aku membacakannya dan mengusap tubuhnya dengan tangannya, mengharap berkahnya.",
      },
    ],
    disclaimer:
      "Ruqyah adalah praktik spiritual, bukan pengobatan medis. Ruqyah tidak menggantikan konsultasi dengan dokter yang berkualifikasi untuk penyakit fisik atau mental, juga tidak menggantikan salat lima waktu.",
  },
  {
    title: "Surat al-Fatihah sebagai ruqyah",
    summary: "Surah pembuka — secara tegas dikonfirmasi sebagai ruqyah yang sah.",
    body: [
      "Abu Sa'id al-Khudri meriwayatkan bahwa ketika seorang pemimpin suku digigit ular, salah satu sahabat Nabi ﷺ membacakan Surat al-Fatihah padanya dan ia sembuh. Ketika para sahabat kemudian menanyakan kepada Nabi ﷺ apakah ini diperbolehkan, beliau tersenyum dan bersabda: 'Bagaimana kamu tahu itu adalah ruqyah?' — mengonfirmasi bahwa al-Fatihah, dibacakan dengan keyakinan dan pemahaman yang tulus, adalah ruqyah yang sah (Bukhari 5736).",
      "Pembaca Al-Qur'an aplikasi ini memuat teks lengkap dan terjemahan al-Fatihah; panduan ini hanya menunjukkannya sebagai sumber ruqyah tanpa memuatnya kembali di sini.",
    ],
    quran: [{ excerpt: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang..." }],
    hadith: [
      {
        excerpt:
          "Salah satu dari mereka mulai membaca Surat al-Fatihah... pasien itu sembuh. Ketika mereka bertanya kepada Nabi ﷺ, beliau tersenyum dan bersabda: Bagaimana kamu tahu bahwa al-Fatihah adalah ruqyah?",
      },
    ],
    appLinks: [{ label: "Baca Al-Fatihah" }],
  },
  {
    title: "Ayat al-Kursi (2:255)",
    summary: "Ayat Kursi — dibaca pada malam hari untuk perlindungan Allah.",
    body: [
      "Ayat al-Kursi (Al-Qur'an 2:255) menggambarkan kedaulatan mutlak Allah dan banyak dibaca untuk perlindungan, terutama sebelum tidur. Abu Hurairah meriwayatkan bahwa seorang pengunjung malam yang mencuri dari zakat yang ia jaga berkata kepadanya: 'Setiap kali kamu pergi tidur, bacalah Ayat al-Kursi — seorang penjaga dari Allah akan tetap bersamamu, dan tidak ada setan yang akan mendekatimu hingga pagi.' Ketika Nabi ﷺ mendengar ini, beliau mengonfirmasi: 'Dia mengatakan yang sebenarnya kepadamu, meskipun dia pendusta — itu adalah setan' (Bukhari 5010).",
      "Seperti ayat-ayat lain dalam panduan ini, hanya kutipan singkat yang diberikan di sini; bacalah ayat lengkap dan terjemahannya di pembaca Al-Qur'an aplikasi.",
    ],
    quran: [
      {
        excerpt:
          "Allah — tidak ada tuhan selain Dia, Yang Maha Hidup, Yang Menopang segala sesuatu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Setiap kali kamu pergi ke tempat tidurmu, bacalah Ayat al-Kursi — seorang penjaga dari Allah akan melindungimu sepanjang malam, dan tidak ada setan yang akan mendekatimu hingga pagi.",
      },
    ],
    appLinks: [{ label: "Baca Ayat al-Kursi" }],
  },
  {
    title: "Al-Ikhlas, Al-Falaq & An-Nas (112–114)",
    summary: "Tiga surah penutup — ruqyah malam Nabi ﷺ.",
    body: [
      "Aisyah menggambarkan rutinitas malam Nabi ﷺ: setiap malam sebelum tidur beliau menyatukan kedua tangannya, membaca Surat al-Ikhlas, Surat al-Falaq, dan Surat an-Nas, meniupkan napas ke tangannya, dan mengusapkannya ke tubuhnya — dimulai dari kepala dan wajahnya — mengulanginya tiga kali (Bukhari 5017). Ketiga surah yang sama ini (al-Ikhlas menegaskan keesaan Allah, dan dua Mu'awwidzat mencari perlindungan dari kejahatan) juga yang dibacakan pada dirinya sendiri saat sakit (Bukhari 5016).",
      "Bersama-sama mereka membentuk salah satu rutinitas ruqyah harian yang paling sederhana dan paling sahih yang tersedia — cukup singkat untuk dihafal, dan secara langsung dinyatakan dalam Sunnah.",
    ],
    quran: [
      { excerpt: "Katakanlah: Dia Allah, Yang Esa." },
      { excerpt: "Katakanlah: Aku berlindung kepada Tuhan waktu subuh." },
      { excerpt: "Katakanlah: Aku berlindung kepada Tuhan manusia." },
    ],
    hadith: [
      {
        excerpt:
          "Setiap kali Nabi ﷺ pergi tidur, beliau menyatukan kedua tangannya dan meniupnya setelah membaca Surat al-Ikhlas, al-Falaq dan an-Nas, kemudian mengusapkan tangannya ke bagian tubuh yang bisa dijangkau, dimulai dari kepala dan wajahnya. Beliau melakukan itu tiga kali.",
      },
    ],
    actions: [
      "Hafalkan Al-Ikhlas, Al-Falaq, dan An-Nas.",
      "Bacalah setiap malam sebelum tidur, seperti yang dilakukan Nabi ﷺ.",
    ],
    appLinks: [{ label: "Baca ketiga surah" }],
  },
  {
    title: "Perlindungan harian: zikir pagi & petang",
    summary: "Bentuk ruqyah yang berkelanjutan dan sehari-hari untuk perlindungan.",
    body: [
      "Selain ruqyah untuk penyakit tertentu, Nabi ﷺ mengajarkan seperangkat zikir pagi dan petang yang berfungsi sebagai perlindungan spiritual berkelanjutan — banyak di antaranya adalah ayat yang sama yang dibahas dalam panduan ini (Ayat al-Kursi, tiga surah penutup) beserta doa-doa sahih lainnya. Membacanya secara konsisten, bukan hanya beralih ke ruqyah saat ada yang terasa salah, adalah cara Sunnah untuk mencari perlindungan Allah setiap hari.",
      "Perpustakaan zikir aplikasi ini memuat koleksi lengkap dan bersumber dari zikir pagi dan petang di satu tempat, siap dibaca atau dilacak setiap hari.",
    ],
    actions: [
      "Bacalah zikir pagi setelah Subuh.",
      "Bacalah zikir petang sebelum Maghrib/matahari terbenam.",
    ],
    appLinks: [{ label: "Zikir pagi & petang" }],
  },
  {
    title: "Hindari peramal dan tukang tenung",
    summary: "Mencari hal gaib dari siapa pun selain Allah adalah peringatan serius.",
    body: [
      "Islam menarik garis tegas antara ruqyah sahih dan berkonsultasi dengan peramal, tukang tenung, ahli nujum, atau siapa pun yang mengklaim mengetahui hal gaib (ghaib) atau menghilangkan penderitaan spiritual melalui cara-cara non-Islami. Nabi ﷺ memperingatkan: 'Siapa yang mengunjungi seorang peramal (arraf) dan menanyakan sesuatu kepadanya, salatnya tidak akan diterima selama empat puluh malam' (Sahih Muslim 2230) — peringatan keras bahkan terhadap menguji klaim semacam itu karena rasa ingin tahu.",
      "Jika seseorang juga mempercayai klaim peramal tentang hal gaib, para ulama menganggap ini sebagai masalah kekufuran, karena hanya Allah yang memiliki pengetahuan tentang hal gaib (Al-Qur'an 27:65). Kesulitan apa pun yang membuat seseorang mempertimbangkan orang semacam itu, respons yang benar menurut ajaran panduan ini selalu untuk beralih ke ruqyah yang sahih, doa, dan bantuan medis atau ilmiah yang terpercaya — tidak pernah kepada mereka yang mengklaim pengetahuan tersembunyi.",
    ],
    hadith: [
      {
        excerpt:
          "Siapa yang mengunjungi seorang peramal (arraf) dan menanyakan sesuatu kepadanya, salatnya tidak akan diterima selama empat puluh malam.",
      },
    ],
    actions: [
      "Jangan pernah berkonsultasi dengan peramal, ahli nujum, atau mereka yang mengklaim pengetahuan gaib.",
    ],
  },
  {
    title: "Tawakal — bersandar hanya kepada Allah",
    summary: "Ruqyah adalah sarana; kesembuhan dan hasilnya milik Allah.",
    body: [
      "Pengingat terakhir dan terpenting dalam panduan ini adalah tawakal: bersandar dengan tulus kepada Allah sambil menggunakan sarana yang diizinkan yang telah Dia berikan. Membaca ruqyah, mencari perawatan medis, dan meminta orang lain mendoakan Anda semuanya adalah sarana yang sah — tetapi kepercayaan hati harus bersandar hanya kepada Allah, bukan pada kata-kata yang dibaca atau orang yang membacanya. Ini persis mencerminkan kondisi dalam hadis pertama panduan ini: 'Tidak ada masalah dengan ruqyah selama tidak mengandung syirik' (Sahih Muslim 2200).",
      "Panduan ini secara sengaja mengabaikan 'protokol' rakyat dan daftar periksa gejala yang beredar luas secara daring — tidak satu pun dari ini memiliki dasar yang kuat dalam Al-Qur'an atau Sunnah yang sahih, dan bergantung padanya dapat secara diam-diam mengalihkan kepercayaan seseorang dari Allah ke ritual atau daftar tebakan. Berpegang pada apa yang berdasar tekstual, dan serahkan sisanya pada ketetapan Allah.",
    ],
    hadith: [{ excerpt: "Tidak ada masalah dengan ruqyah selama tidak mengandung syirik." }],
    disclaimer:
      "Ini adalah konten edukatif umum yang meringkas ajaran Sunni arus utama dari Al-Qur'an dan hadis sahih. Ini bukan fatwa, dan bukan pengobatan medis atau psikologis. Untuk penderitaan yang serius atau terus-menerus, konsultasikan dengan ulama lokal yang berkualifikasi dan profesional medis yang sesuai.",
  },
];
