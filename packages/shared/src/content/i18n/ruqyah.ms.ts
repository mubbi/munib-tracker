import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Malay translation overlay for the Learn ruqyah guide. Mirrors the order of
// RUQYAH_TOPICS in ../ruqyah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const RUQYAH_TOPICS_MS: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Apakah itu ruqyah?",
    summary: "Membaca Al-Quran, Nama-nama Allah, atau doa Nabi untuk penyembuhan.",
    body: [
      "Ruqyah adalah amalan membaca Al-Quran, Nama dan Sifat Allah, atau doa Nabi yang sahih ke atas diri sendiri atau orang lain — selalunya dengan tiupan nafas yang lembut — memohon penyembuhan atau perlindungan hanya daripada Allah. Amalan ini wujud sebelum Islam sebagai adat Arab umum, dan Nabi ﷺ ditanya secara terus sama ada ia dibenarkan.",
      "'Auf bin Malik meriwayatkan bahawa para sahabat berkata: 'Kami biasa mengamalkan ruqyah pada zaman jahiliyah; apa pandangan tuan tentangnya?' Nabi ﷺ menjawab: 'Tunjukkan ruqyah kamu kepadaku — tidak ada salahnya melakukan ruqyah selagi ia tidak mengandungi syirik' (Sahih Muslim 2200). Hadis tunggal ini menjadi asas kepada segala yang lain dalam panduan ini: ruqyah itu sendiri dibenarkan; yang penting ialah isinya.",
    ],
    hadith: [
      {
        excerpt:
          "Kami biasa mengamalkan ruqyah pada zaman jahiliyah, dan kami berkata: Wahai Rasulullah, apa pandangan tuan tentangnya? Baginda bersabda: Tunjukkan ruqyah kamu kepadaku — tidak ada salahnya melakukan ruqyah selagi ia tidak mengandungi syirik.",
      },
    ],
  },
  {
    title: "Ruqyah yang halal vs haram",
    summary: "Al-Quran, Nama-nama Allah, dan doa yang jelas — bukan syirik atau perkara ghaib.",
    body: [
      "Ruqyah yang dibenarkan bergantung pada syarat-syarat yang diambil ulama daripada hadis: ia menggunakan Al-Quran, Nama dan Sifat Allah, atau doa Nabi yang sahih; ia dalam bahasa yang maknanya difahami (bukan suku kata atau simbol yang tidak diketahui); dan orang yang membaca serta orang yang dirawat kedua-duanya percaya bahawa ruqyah itu sendiri tidak mempunyai kuasa — penyembuhan datang daripada Allah semata-mata, dan kata-kata itu hanyalah wasilah yang diizinkan-Nya.",
      "Nabi ﷺ sendiri mencontohkan hal ini: Aisyah meriwayatkan bahawa setiap kali baginda sakit, baginda membaca Mu'awwidzat (dua surah terakhir) ke atas dirinya dan meniup, dan apabila sakit terakhirnya bertambah parah, Aisyah melakukan perkara yang sama untuknya, menyapu tubuhnya dengan tangannya sendiri mengharapkan keberkatannya (Bukhari 5016). Ini adalah ruqyah dalam bentuknya yang paling jelas dan sahih.",
      "Ruqyah menjadi haram apabila ia melangkah ke syirik: memanggil sesiapa selain Allah, mencari bantuan daripada jin, menggunakan kata-kata atau simbol yang tidak diketahui maknanya, menggantung azimat atau tangkal, atau mendakwa pengamal ruqyah mempunyai pengetahuan ghaib atau kesembuhan yang terjamin. Ia juga tidak boleh menggantikan solat lima waktu atau mendapatkan rawatan perubatan yang sesuai — ia melengkapi kedua-duanya, bukan menggantikannya.",
    ],
    hadith: [
      {
        excerpt:
          "Setiap kali Rasulullah ﷺ sakit, baginda membaca Mu'awwidzat kemudian meniupkan nafasnya ke tubuhnya. Apabila baginda sakit tenat, aku membacakannya dan menyapu tubuhnya dengan tangannya, mengharapkan keberkatannya.",
      },
    ],
    disclaimer:
      "Ruqyah adalah amalan rohani, bukan rawatan perubatan. Ia tidak menggantikan rujukan kepada doktor yang bertauliah untuk penyakit fizikal atau mental, dan tidak menggantikan solat lima waktu.",
  },
  {
    title: "Surah al-Fatihah sebagai ruqyah",
    summary: "Surah pembukaan — disahkan secara jelas sebagai ruqyah yang sah.",
    body: [
      "Abu Sa'id al-Khudri meriwayatkan bahawa apabila seorang ketua puak digigit ular, salah seorang sahabat Nabi ﷺ membacakan Surah al-Fatihah ke atasnya dan dia sembuh. Apabila para sahabat kemudian bertanya kepada Nabi ﷺ sama ada ini dibenarkan, baginda tersenyum dan bersabda: 'Bagaimana kamu tahu itu adalah ruqyah?' — mengesahkan bahawa al-Fatihah, dibacakan dengan keyakinan dan kefahaman yang tulus, adalah ruqyah yang sah (Bukhari 5736).",
      "Pembaca Al-Quran aplikasi ini memuatkan teks lengkap dan terjemahan al-Fatihah; panduan ini hanya menunjukkannya sebagai sumber ruqyah tanpa menghasilkannya semula di sini.",
    ],
    quran: [{ excerpt: "Dengan nama Allah Yang Maha Pemurah, lagi Maha Mengasihani..." }],
    hadith: [
      {
        excerpt:
          "Seorang daripada mereka mula membaca Surah al-Fatihah... pesakit itu sembuh. Apabila mereka bertanya kepada Nabi ﷺ, baginda tersenyum dan bersabda: Bagaimana kamu tahu bahawa al-Fatihah adalah ruqyah?",
      },
    ],
    appLinks: [{ label: "Baca Al-Fatihah" }],
  },
  {
    title: "Ayat al-Kursi (2:255)",
    summary: "Ayat Kerusi — dibaca pada waktu malam untuk perlindungan Allah.",
    body: [
      "Ayat al-Kursi (Al-Quran 2:255) menggambarkan kekuasaan mutlak Allah dan banyak dibaca untuk perlindungan, terutamanya sebelum tidur. Abu Hurairah meriwayatkan bahawa seorang pelawat malam yang mencuri daripada zakat yang dijaganya memberitahu beliau: 'Setiap kali kamu hendak tidur, bacalah Ayat al-Kursi — seorang penjaga daripada Allah akan tinggal bersamamu, dan tidak ada syaitan yang akan mendekatimu sehingga pagi.' Apabila Nabi ﷺ mendengar ini, baginda mengesahkan: 'Dia berkata benar kepadamu, walaupun dia seorang pendusta — itu adalah syaitan' (Bukhari 5010).",
      "Seperti ayat-ayat lain dalam panduan ini, hanya petikan ringkas diberikan di sini; baca ayat lengkap dan terjemahannya dalam pembaca Al-Quran aplikasi.",
    ],
    quran: [
      {
        excerpt:
          "Allah — tidak ada tuhan melainkan Dia, Yang Maha Hidup, Yang Menegakkan segala sesuatu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Setiap kali kamu hendak tidur, bacalah Ayat al-Kursi — seorang penjaga daripada Allah akan melindungimu sepanjang malam, dan tidak ada syaitan yang akan mendekatimu sehingga pagi.",
      },
    ],
    appLinks: [{ label: "Baca Ayat al-Kursi" }],
  },
  {
    title: "Al-Ikhlas, Al-Falaq & An-Nas (112–114)",
    summary: "Tiga surah penutup — ruqyah malam Nabi ﷺ.",
    body: [
      "Aisyah menggambarkan rutin malam Nabi ﷺ: setiap malam sebelum tidur baginda menyatukan kedua-dua tapak tangannya, membaca Surah al-Ikhlas, Surah al-Falaq, dan Surah an-Nas, meniup ke tangannya, dan menyapunya ke tubuhnya — bermula dengan kepala dan mukanya — mengulanginya tiga kali (Bukhari 5017). Tiga surah yang sama ini (al-Ikhlas menegaskan keesaan Allah, dan dua Mu'awwidzat memohon perlindungan daripada kejahatan) juga yang baginda baca ke atas dirinya semasa sakit (Bukhari 5016).",
      "Bersama-sama ia membentuk salah satu rutin ruqyah harian yang paling ringkas dan sahih yang ada — cukup pendek untuk dihafal, dan disahkan secara langsung dalam Sunnah.",
    ],
    quran: [
      { excerpt: "Katakanlah: Dialah Allah, Yang Maha Esa." },
      { excerpt: "Katakanlah: Aku berlindung kepada Tuhan waktu subuh." },
      { excerpt: "Katakanlah: Aku berlindung kepada Tuhan sekalian manusia." },
    ],
    hadith: [
      {
        excerpt:
          "Setiap kali Nabi ﷺ hendak tidur, baginda menyatukan kedua-dua tapak tangannya dan meniup selepas membaca Surah al-Ikhlas, al-Falaq dan an-Nas, kemudian menyapu tangannya ke bahagian tubuhnya yang boleh dicapai, bermula dengan kepala dan mukanya. Baginda melakukan itu tiga kali.",
      },
    ],
    actions: [
      "Hafal Al-Ikhlas, Al-Falaq, dan An-Nas.",
      "Baca setiap malam sebelum tidur, seperti yang dilakukan Nabi ﷺ.",
    ],
    appLinks: [{ label: "Baca ketiga-tiga surah" }],
  },
  {
    title: "Perlindungan harian: zikir pagi & petang",
    summary: "Bentuk ruqyah yang berterusan dan harian untuk perlindungan.",
    body: [
      "Selain ruqyah untuk penyakit tertentu, Nabi ﷺ mengajar satu set zikir pagi dan petang yang berfungsi sebagai perlindungan rohani yang berterusan — kebanyakannya adalah ayat yang sama yang dibincangkan dalam panduan ini (Ayat al-Kursi, tiga surah penutup) bersama doa-doa sahih lain. Membacanya secara konsisten, bukan hanya beralih kepada ruqyah apabila sesuatu terasa tidak kena, adalah cara Sunnah untuk memohon perlindungan Allah setiap hari.",
      "Perpustakaan zikir aplikasi ini memuatkan koleksi lengkap dan bersumber zikir pagi dan petang di satu tempat, sedia untuk dibaca atau dijejaki setiap hari.",
    ],
    actions: [
      "Baca zikir pagi selepas Subuh.",
      "Baca zikir petang sebelum Maghrib/matahari terbenam.",
    ],
    appLinks: [{ label: "Zikir pagi & petang" }],
  },
  {
    title: "Elakkan bomoh dan ahli tilik",
    summary: "Mencari perkara ghaib daripada sesiapa selain Allah adalah amaran yang serius.",
    body: [
      "Islam melukiskan garis tegas antara ruqyah yang sahih dan berjumpa dengan bomoh, ahli tilik, ahli nujum, atau sesiapa yang mendakwa mengetahui perkara ghaib atau menghapuskan penderitaan rohani melalui cara bukan Islam. Nabi ﷺ memberi amaran: 'Sesiapa yang menemui ahli tilik (arraf) dan bertanya sesuatu kepadanya, solatnya tidak akan diterima selama empat puluh malam' (Sahih Muslim 2230) — amaran yang keras walaupun hanya untuk menguji dakwaan sedemikian kerana ingin tahu.",
      "Jika seseorang juga mempercayai dakwaan ahli tilik tentang perkara ghaib, ulama menganggap ini sebagai perkara kekufuran, kerana hanya Allah yang mempunyai pengetahuan tentang perkara ghaib (Al-Quran 27:65). Apa pun kesukaran yang mendorong seseorang untuk mempertimbangkan orang sedemikian, respons yang betul menurut ajaran panduan ini ialah sentiasa beralih kepada ruqyah yang sahih, doa, dan bantuan perubatan atau ilmiah yang dipercayai — bukan sekali-kali kepada mereka yang mendakwa mempunyai pengetahuan tersembunyi.",
    ],
    hadith: [
      {
        excerpt:
          "Sesiapa yang menemui ahli tilik (arraf) dan bertanya sesuatu kepadanya, solatnya tidak akan diterima selama empat puluh malam.",
      },
    ],
    actions: [
      "Jangan sekali-kali berjumpa bomoh, ahli nujum, atau mereka yang mendakwa mengetahui perkara ghaib.",
    ],
  },
  {
    title: "Tawakal — bergantung hanya kepada Allah",
    summary: "Ruqyah adalah wasilah; kesembuhan dan hasilnya milik Allah.",
    body: [
      "Peringatan terakhir dan paling penting dalam panduan ini adalah tawakal: bergantung dengan tulus kepada Allah sambil menggunakan wasilah yang dibenarkan yang telah Dia berikan. Membaca ruqyah, mendapatkan rawatan perubatan, dan meminta orang lain berdoa untukmu semuanya wasilah yang sah — tetapi kepercayaan hati mestilah bergantung hanya kepada Allah, bukan kepada kata-kata yang dibaca atau orang yang membacanya. Ini mencerminkan tepat syarat dalam hadis pertama panduan ini: 'Tidak ada salahnya melakukan ruqyah selagi ia tidak mengandungi syirik' (Sahih Muslim 2200).",
      "Panduan ini dengan sengaja tidak memasukkan 'protokol' rakyat dan senarai semak simptom yang tersebar luas di internet — tidak satu pun daripadanya mempunyai asas yang kukuh dalam Al-Quran atau Sunnah yang sahih, dan bergantung padanya boleh secara senyap-senyap mengalihkan kepercayaan seseorang daripada Allah kepada ritual atau senarai tekaan. Berpegang kepada apa yang berasaskan teks, dan serahkan selebihnya kepada ketentuan Allah.",
    ],
    hadith: [
      { excerpt: "Tidak ada salahnya melakukan ruqyah selagi ia tidak mengandungi syirik." },
    ],
    disclaimer:
      "Ini adalah kandungan pendidikan umum yang meringkaskan ajaran Sunni arus perdana daripada Al-Quran dan hadis sahih. Ia bukan fatwa, dan bukan rawatan perubatan atau psikologi. Untuk penderitaan yang serius atau berpanjangan, rujuk kedua-dua ulama tempatan yang bertauliah dan profesional perubatan yang bersesuaian.",
  },
];
