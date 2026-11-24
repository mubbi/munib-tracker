import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Malay translation overlay for the Learn ruqyah guide. Mirrors the order of
// RUQYAH_TOPICS in ../ruqyah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const RUQYAH_TOPICS_MS: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Apakah itu ruqyah?",
    summary: "Membaca Al-Quran, Nama-nama Allah atau doa Nabi ﷺ untuk memohon kesembuhan.",
    body: [
      "Ruqyah ialah amalan membaca ayat Al-Quran, Nama-nama dan Sifat-sifat Allah, atau doa-doa Nabi ﷺ yang sahih ke atas diri sendiri atau orang lain — selalunya disertai tiupan nafas yang ringan — dengan memohon kesembuhan atau perlindungan daripada Allah semata-mata. Amalan jampi sudah wujud sebagai adat umum masyarakat Arab sebelum Islam, dan Nabi ﷺ pernah ditanya secara langsung sama ada ia dibenarkan.",
      "'Auf bin Malik meriwayatkan bahawa para sahabat berkata: 'We used to practise ruqyah in the pre-Islamic days; what is your view on it?' (maksud dalam bahasa Inggeris). Nabi ﷺ menjawab: 'Show me your ruqyah — there is no harm in ruqyah so long as it does not contain shirk' (maksud dalam bahasa Inggeris) (Sahih Muslim 2200). Hadis inilah yang menjadi asas bagi segala isi panduan ini: ruqyah itu sendiri dibenarkan; yang menentukan ialah kandungannya.",
    ],
  },
  {
    title: "Ruqyah yang halal dan yang haram",
    summary: "Al-Quran, Nama-nama Allah dan doa yang jelas — bukan syirik atau dakwaan ilmu ghaib.",
    body: [
      "Ruqyah yang dibenarkan berpijak pada syarat-syarat yang disimpulkan oleh ulama daripada hadis: ia menggunakan Al-Quran, Nama-nama dan Sifat-sifat Allah, atau doa Nabi ﷺ yang sahih; ia dibaca dalam bahasa yang difahami maknanya (bukan bunyi-bunyian atau simbol yang tidak diketahui); dan orang yang membaca serta orang yang dirawat sama-sama yakin bahawa ruqyah itu sendiri tidak mempunyai kuasa — kesembuhan datang daripada Allah semata-mata, dan kata-kata itu hanyalah asbab yang diizinkan-Nya.",
      "Nabi ﷺ sendiri menunjukkan contohnya: Aisyah meriwayatkan bahawa setiap kali baginda sakit, baginda membaca al-Mu'awwidzat (dua surah terakhir) ke atas diri baginda lalu meniupkannya, dan apabila sakit terakhir baginda semakin berat, Aisyah pula melakukan perkara yang sama untuk baginda, menyapu tubuh baginda dengan tangan baginda sendiri kerana mengharapkan keberkatannya (Bukhari 5016). Inilah ruqyah dalam bentuknya yang paling jelas dan paling sahih.",
      "Ruqyah menjadi haram apabila ia melangkah ke dalam syirik: menyeru selain Allah, meminta bantuan jin, menggunakan kata-kata atau simbol yang tidak jelas maknanya, menggantung tangkal atau azimat, atau mendakwa bahawa perawat mengetahui perkara ghaib atau menjamin kesembuhan. Ruqyah juga tidak sekali-kali menggantikan solat lima waktu atau rawatan perubatan yang sewajarnya — ia melengkapi kedua-duanya, bukan menggantikan salah satu daripadanya.",
    ],
    disclaimer:
      "Ruqyah ialah amalan rohani, bukan rawatan perubatan. Ia tidak menggantikan rawatan oleh doktor yang bertauliah bagi penyakit fizikal atau mental, dan tidak juga menggantikan solat lima waktu.",
  },
  {
    title: "Surah al-Fatihah sebagai ruqyah",
    summary: "Surah pembukaan — disahkan secara jelas sebagai ruqyah yang sah.",
    body: [
      "Abu Sa'id al-Khudri meriwayatkan bahawa apabila seorang ketua kabilah dipatuk ular, salah seorang sahabat Nabi ﷺ membacakan Surah al-Fatihah ke atasnya, lalu dia sembuh. Apabila para sahabat kemudiannya bertanya kepada Nabi ﷺ sama ada perbuatan itu dibenarkan, baginda tersenyum dan bersabda: 'How do you know it is a ruqyah?' (maksud dalam bahasa Inggeris) — mengesahkan bahawa al-Fatihah, apabila dibaca dengan keyakinan dan kefahaman yang ikhlas, adalah ruqyah yang sah (Bukhari 5736).",
      "Pembaca Al-Quran dalam aplikasi ini memuatkan teks penuh dan terjemahan al-Fatihah; panduan ini hanya menunjukkannya sebagai sumber ruqyah tanpa menyalinnya semula di sini.",
    ],
    appLinks: [{ label: "Baca al-Fatihah" }],
  },
  {
    title: "Ayat al-Kursi (2:255)",
    summary: "Ayat Kursi — dibaca pada waktu malam untuk memohon perlindungan Allah.",
    body: [
      "Ayat al-Kursi (Al-Quran 2:255) menggambarkan kekuasaan Allah yang mutlak dan banyak dibaca untuk perlindungan, terutamanya sebelum tidur. Abu Hurairah meriwayatkan bahawa seorang pengunjung malam yang mencuri daripada harta zakat yang dijaganya memberitahunya: 'Whenever you go to bed, recite Ayat al-Kursi — a guardian from Allah will stay with you, and no shaytan will approach you until morning' (maksud dalam bahasa Inggeris). Apabila Nabi ﷺ mendengarnya, baginda mengesahkan: 'He told you the truth, though he is a liar — that was a shaytan' (maksud dalam bahasa Inggeris) (Bukhari 5010).",
      "Seperti ayat-ayat lain dalam panduan ini, hanya petikan ringkas diberikan di sini; bacalah ayat penuh beserta terjemahannya dalam pembaca Al-Quran aplikasi.",
    ],
    appLinks: [{ label: "Baca Ayat al-Kursi" }],
  },
  {
    title: "Al-Ikhlas, Al-Falaq & An-Nas (112–114)",
    summary: "Tiga surah penutup — ruqyah malam Nabi ﷺ.",
    body: [
      "Aisyah menggambarkan amalan malam Nabi ﷺ: setiap malam sebelum tidur, baginda merapatkan kedua-dua tapak tangan baginda, membaca Surah al-Ikhlas, Surah al-Falaq dan Surah an-Nas, meniup ke dalam kedua-dua tangan itu, lalu menyapukannya ke seluruh tubuh baginda — bermula dengan kepala dan muka — dan mengulanginya sebanyak tiga kali (Bukhari 5017). Tiga surah yang sama ini (al-Ikhlas yang menegaskan keesaan Allah, dan dua al-Mu'awwidzat yang memohon perlindungan daripada kejahatan) jugalah yang baginda baca ke atas diri baginda ketika sakit (Bukhari 5016).",
      "Bersama-sama, ketiga-tiganya membentuk salah satu amalan ruqyah harian yang paling mudah dan paling sahih — cukup pendek untuk dihafal, dan disabitkan secara langsung dalam Sunnah.",
    ],
    actions: [
      "Hafal Surah al-Ikhlas, al-Falaq dan an-Nas.",
      "Bacalah ketiga-tiganya setiap malam sebelum tidur, sebagaimana yang dilakukan oleh Nabi ﷺ.",
    ],
    appLinks: [{ label: "Baca ketiga-tiga surah" }],
  },
  {
    title: "Perlindungan harian: zikir pagi & petang",
    summary: "Bentuk ruqyah harian yang berterusan untuk perlindungan.",
    body: [
      "Selain ruqyah untuk sesuatu penyakit tertentu, Nabi ﷺ mengajarkan himpunan zikir pagi dan petang yang berfungsi sebagai perlindungan rohani yang berterusan — kebanyakannya ialah ayat-ayat yang sama yang dibincangkan dalam panduan ini (Ayat al-Kursi dan tiga surah penutup) bersama doa-doa sahih yang lain. Mengamalkannya secara konsisten, dan bukan hanya mencari ruqyah apabila terasa ada yang tidak kena, ialah cara Sunnah untuk memohon perlindungan Allah setiap hari.",
      "Perpustakaan zikir dalam aplikasi ini memuatkan himpunan lengkap zikir pagi dan petang beserta sumbernya di satu tempat, sedia untuk dibaca atau dijejaki setiap hari.",
    ],
    actions: [
      "Bacalah zikir pagi selepas solat Subuh.",
      "Bacalah zikir petang sebelum Maghrib/terbenam matahari.",
    ],
    appLinks: [{ label: "Zikir pagi & petang" }],
  },
  {
    title: "Jauhi tukang tilik dan bomoh",
    summary: "Mencari ilmu ghaib daripada selain Allah ialah perkara yang diberi amaran keras.",
    body: [
      "Islam meletakkan garis pemisah yang tegas antara ruqyah yang sahih dengan berjumpa tukang tilik, bomoh, ahli nujum, atau sesiapa sahaja yang mendakwa mengetahui perkara ghaib atau mampu menghilangkan gangguan rohani melalui cara yang bukan Islam. Nabi ﷺ memberi amaran: 'Whoever visits a fortune-teller (arraf) and asks him about anything, his prayer will not be accepted for forty nights' (maksud dalam bahasa Inggeris) (Sahih Muslim 2230) — amaran yang keras walaupun sekadar untuk menguji dakwaan sedemikian kerana ingin tahu.",
      "Jika seseorang turut mempercayai dakwaan tukang tilik tentang perkara ghaib, ulama menganggapnya sebagai perkara kekufuran, kerana hanya Allah yang mengetahui perkara ghaib (Al-Quran 27:65). Apa jua kesusahan yang mendorong seseorang untuk mempertimbangkan orang seperti itu, jalan yang betul menurut ajaran panduan ini ialah sentiasa kembali kepada ruqyah yang sahih, doa, serta bantuan perubatan atau ilmuwan yang dipercayai — bukan sekali-kali kepada mereka yang mendakwa memiliki ilmu tersembunyi.",
    ],
    actions: [
      "Jangan sekali-kali berjumpa tukang tilik, ahli nujum atau sesiapa yang mendakwa mengetahui perkara ghaib.",
    ],
  },
  {
    title: "Tawakal — bergantung kepada Allah semata-mata",
    summary: "Ruqyah hanyalah asbab; kesembuhan dan kesudahannya milik Allah.",
    body: [
      "Peringatan terakhir dan paling penting dalam panduan ini ialah tawakal: bergantung dengan ikhlas kepada Allah sambil menggunakan asbab yang dibenarkan yang telah Dia kurniakan. Membaca ruqyah, mendapatkan rawatan perubatan dan meminta orang lain mendoakan anda semuanya ialah asbab yang sah — tetapi kepercayaan hati mesti bersandar kepada Allah semata-mata, bukan kepada kata-kata yang dibaca atau orang yang membacanya. Ini selaras sepenuhnya dengan syarat dalam hadis pertama panduan ini: 'There is no harm in ruqyah so long as it does not contain shirk' (maksud dalam bahasa Inggeris) (Sahih Muslim 2200).",
      "Panduan ini sengaja tidak memasukkan 'protokol' rakyat dan senarai semak simptom yang tersebar luas di internet — tiada satu pun daripadanya mempunyai asas yang kukuh dalam Al-Quran atau Sunnah yang sahih, dan bergantung padanya boleh secara diam-diam mengalihkan kepercayaan seseorang daripada Allah kepada suatu ritual atau senarai tekaan. Berpeganglah pada apa yang bersandarkan nas, dan serahkan selebihnya kepada ketentuan Allah.",
    ],
    disclaimer:
      "Ini ialah kandungan pendidikan umum yang merumuskan ajaran arus perdana Ahli Sunnah berdasarkan Al-Quran dan hadis sahih. Ia bukan fatwa, dan bukan rawatan perubatan atau psikologi. Bagi gangguan yang serius atau berpanjangan, rujuklah ulama tempatan yang bertauliah dan juga pengamal perubatan yang sesuai.",
  },
];
