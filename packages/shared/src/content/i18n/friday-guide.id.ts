import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Indonesian translation overlay for the Learn Friday (Jumu'ah) guide. Mirrors the order of
// FRIDAY_GUIDE_TOPICS in ../friday-guide.ts (index-aligned); untranslated entries fall
// back to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const FRIDAY_GUIDE_TOPICS_ID: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Keutamaan hari Jumat",
    summary:
      "Hari terbaik saat matahari terbit — penciptaan Adam, dan pengampunan antara dua Jumat.",
    body: [
      "Jumat (Yawm al-Jumu'ah) adalah hari berkumpul mingguan umat ini. Abu Hurairah meriwayatkan bahwa Rasulullah ﷺ bersabda: 'Hari terbaik saat matahari terbit adalah hari Jumat; pada hari itu Adam diciptakan, pada hari itu ia dimasukkan ke Surga, pada hari itu ia dikeluarkan darinya, dan Hari Kiamat tidak akan terjadi kecuali pada hari Jumat' (Sahih Muslim 854).",
      "Ibadahnya juga membawa jaminan pengampunan yang tetap. Abu Hurairah meriwayatkan bahwa Nabi ﷺ bersabda: 'Siapa yang mandi pada hari Jumat, kemudian datang ke salat Jumat, dan mendengarkan serta diam ketika imam berkhutbah, dosanya antara Jumat itu dan Jumat berikutnya akan diampuni, ditambah tiga hari lagi' (Sahih Muslim 857).",
      "Keutamaan-keutamaan ini adalah panggilan untuk bersiap sejak dini, mendengarkan dengan penuh perhatian, dan memperlakukan hari Jumat sebagai penyegaran spiritual mingguan — bukan sekadar hari libur kerja.",
    ],
    hadith: [
      {
        excerpt:
          "Hari terbaik saat matahari terbit adalah hari Jumat; pada hari itu Adam diciptakan, pada hari itu ia dimasukkan ke Surga, pada hari itu ia dikeluarkan darinya, dan Hari Kiamat tidak akan terjadi kecuali pada hari Jumat.",
      },
      {
        excerpt:
          "Siapa yang mandi pada hari Jumat, kemudian datang ke salat Jumat, dan mendengarkan serta diam ketika imam berkhutbah, dosanya antara Jumat itu dan Jumat berikutnya akan diampuni, ditambah tiga hari lagi.",
      },
    ],
    actions: [
      "Buat niat pada pagi Jumat: mandi (ghusl), pakaian terbaik, dan datang lebih awal.",
      "Perlakukan khutbah sebagai ibadah — diam dan perhatian adalah bagian dari pahala.",
    ],
  },
  {
    title: "Jumat — kewajiban mingguan",
    summary:
      "Salat Jumat berjamaah yang diperintahkan dalam Al-Qur'an, menggantikan Zuhur bagi yang menghadirinya.",
    body: [
      "Allah memerintahkan salat Jumat dengan menyebut namanya: 'Wahai orang-orang yang beriman, apabila diserukan untuk melaksanakan salat pada hari Jumat, maka bersegeralah kamu mengingat Allah dan tinggalkanlah jual beli. Itu lebih baik bagimu jika kamu mengetahui' (QS. Al-Jumu'ah 62:9). Ayat berikutnya mengembalikan izin untuk bertebaran dan mencari karunia Allah setelah salat (QS. Al-Jumu'ah 62:10–11).",
      "Jumat terdiri dari khutbah dua bagian yang diikuti dua rakaat salat yang dibaca dengan suara keras di belakang imam, dan menggantikan Zuhur bagi yang menghadirinya. Tariq bin Syihab meriwayatkan bahwa Nabi ﷺ bersabda salat Jumat berjamaah adalah kewajiban yang mengikat bagi setiap Muslim kecuali empat: hamba, perempuan, anak-anak, atau orang sakit (Sunan Abu Dawud 1067).",
      "Kelalaian adalah peringatan yang serius: Abu al-Ja'd meriwayatkan bahwa siapa yang meninggalkan tiga salat Jumat karena kelalaian, Allah akan menutup hatinya (Sunan an-Nasa'i 1369). Selama khutbah, perkataan sia-sia menyia-nyiakan pahala — Abu Hurairah meriwayatkan bahwa jika kamu berkata kepada temanmu 'Diamlah' saat imam berbicara, kamu telah berbicara secara tidak benar (Sahih al-Bukhari 934).",
      "Setelah Jumat dianjurkan untuk melaksanakan empat rakaat: Abu Hurairah meriwayatkan bahwa Nabi ﷺ bersabda, 'Apabila salah seorang di antara kamu telah melaksanakan salat Jumat, hendaklah ia melaksanakan empat (rakaat) setelahnya' (Sahih Muslim 881).",
    ],
    quran: [
      {
        excerpt:
          "Wahai orang-orang yang beriman, apabila diserukan untuk melaksanakan salat pada hari Jumat, maka bersegeralah kamu mengingat Allah dan tinggalkanlah jual beli. Itu lebih baik bagimu jika kamu mengetahui. Dan apabila salat telah dilaksanakan, maka bertebaranlah kamu di bumi dan carilah karunia Allah...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Salat Jumat berjamaah adalah kewajiban yang mengikat bagi setiap Muslim, kecuali empat: hamba, perempuan, anak-anak, atau orang sakit.",
      },
      {
        excerpt:
          "Siapa yang meninggalkan tiga salat Jumat karena kelalaian, Allah akan menutup hatinya.",
      },
      {
        excerpt:
          "Jika kamu berkata kepada temanmu 'Diamlah' pada hari Jumat saat imam berkhutbah, kamu telah berbicara secara tidak benar (laghawta).",
      },
      {
        excerpt:
          "Apabila salah seorang di antara kamu telah melaksanakan salat Jumat, hendaklah ia melaksanakan empat (rakaat) setelahnya.",
      },
    ],
    actions: [
      "Rencanakan perjalanan Anda agar bisa tiba di masjid sebelum khutbah dimulai.",
      "Jaga ponsel dalam mode senyap dan hindari berbicara selama khutbah.",
      "Laksanakan empat rakaat setelah Jumat jika Anda bisa.",
    ],
    appLinks: [{ label: "Belajar Salat — pelajaran Jumat" }, { label: "Buka Pelacak" }],
    disclaimer:
      "Jumlah minimum jamaah untuk Jumat yang sah, dan apakah perempuan serta musafir dianjurkan untuk menghadirinya, adalah pertanyaan fikih terperinci yang berbeda menurut mazhab dan kebiasaan setempat. Perempuan, musafir, dan orang sakit yang tidak menghadiri melaksanakan salat Zuhur sebagai gantinya. Ini adalah konten pendidikan, bukan fatwa.",
  },
  {
    title: "Bersiap untuk Jumat",
    summary: "Mandi, pakaian bersih, wewangian, dan datang lebih awal untuk pahala terbesar.",
    body: [
      "Persiapan adalah bagian dari sunnah Jumat. Abu Sa'id al-Khudri meriwayatkan bahwa Rasulullah ﷺ bersabda: 'Mandi pada hari Jumat wajib bagi setiap orang yang telah mencapai usia dewasa' (Sahih Muslim 846). Riwayat yang serupa dalam Sahih al-Bukhari (877) juga mengaitkan mandi Jumat dengan mereka yang telah mencapai usia dewasa.",
      "Selain mandi, Nabi ﷺ menganjurkan untuk berpenampilan sebaik mungkin. Salman al-Farisi meriwayatkan bahwa Nabi ﷺ bersabda: 'Siapa yang mandi pada hari Jumat, bersuci sebisa mungkin, kemudian memakai minyak (rambut) atau wewangiannya, kemudian keluar, dan tanpa mendesak di antara dua orang duduk di tempatnya mendengarkan imam sampai selesai, kemudian melaksanakan salat yang diwajibkan baginya — maka dosanya antara Jumat itu dan Jumat berikutnya diampuni' (Sahih al-Bukhari 883).",
      "Datang lebih awal melipatgandakan pahala. Abu Hurairah meriwayatkan bahwa siapa yang pergi pada jam pertama seperti orang yang mengurbankan seekor unta, kemudian sapi, kemudian kambing kibas, kemudian ayam, kemudian telur — dan ketika imam keluar, para malaikat menutup catatan mereka dan mendengarkan peringatan (Sahih al-Bukhari 881).",
    ],
    hadith: [
      { excerpt: "Mandi pada hari Jumat wajib bagi setiap orang yang telah mencapai usia dewasa." },
      {
        excerpt:
          "Mandi pada hari Jumat wajib bagi setiap Muslim laki-laki yang telah mencapai usia dewasa.",
      },
      {
        excerpt:
          "Siapa yang mandi pada hari Jumat, bersuci sebisa mungkin, kemudian memakai minyak atau wewangiannya, kemudian keluar, dan tanpa mendesak di antara dua orang duduk di tempatnya mendengarkan imam sampai selesai, kemudian melaksanakan salat yang diwajibkan baginya — dosanya antara Jumat itu dan Jumat berikutnya diampuni.",
      },
      {
        excerpt:
          "Siapa yang mandi pada hari Jumat, kemudian pergi lebih awal (ke masjid), seolah-olah ia telah mengurbankan seekor unta... kemudian sapi... kemudian kambing kibas... kemudian ayam... kemudian telur. Ketika imam keluar, para malaikat hadir untuk mendengarkan peringatan.",
      },
    ],
    actions: [
      "Mandilah pada pagi Jumat (atau sebelum berangkat ke masjid).",
      "Kenakan pakaian terbaik yang bersih dan sopan, dan gunakan wewangian ringan jika bisa.",
      "Berangkatlah lebih awal — mereka yang paling awal mendapat pahala terbesar.",
    ],
    appLinks: [{ label: "Belajar Bersuci — Mandi (Ghusl)" }],
    disclaimer:
      "Apakah mandi Jumat merupakan kewajiban yang ketat atau sunnah yang sangat ditekankan adalah titik perbedaan klasik di antara mazhab. Semua sepakat tentang keutamaannya yang besar; ikuti praktik yang dapat dipercaya dari komunitas Anda.",
  },
  {
    title: "Surah Al-Kahf pada hari Jumat",
    summary: "Cahaya di antara dua Jumat, dan perlindungan pada sepuluh ayat pertama.",
    body: [
      "Membaca Surah Al-Kahf (QS. 18) pada hari Jumat adalah amalan mingguan yang disukai. Abu Sa'id al-Khudri meriwayatkan bahwa Nabi ﷺ bersabda: 'Siapa yang membaca Surah Al-Kahf pada hari Jumat, cahaya akan bersinar baginya di antara dua Jumat.' Redaksi ini diriwayatkan melalui al-Hakim dan al-Baihaqi dan digradasi sahih oleh Syekh al-Albani; banyak komunitas mengikutinya sebagai sunnah Jumat yang mapan.",
      "Secara terpisah, sepuluh ayat pertama Surah Al-Kahf adalah perisai terhadap fitnah Dajjal. Abu Darda' meriwayatkan bahwa Nabi ﷺ bersabda: 'Siapa yang menghafal sepuluh ayat dari awal Surah Al-Kahf akan terlindungi dari Dajjal' (Sahih Muslim 809).",
      "Sisihkan waktu antara malam Kamis dan Maghrib Jumat untuk membaca surah ini — meskipun Anda tidak dapat menyelesaikan seluruh bab, mulailah dengan ayat-ayat pembuka dan kembali lagi sesuai kemampuan Anda.",
    ],
    quran: [
      {
        excerpt:
          "Segala puji bagi Allah yang telah menurunkan Kitab (Al-Qur'an) kepada hamba-Nya dan Dia tidak menjadikannya bengkok... Ataukah kamu mengira bahwa penghuni gua dan (yang mempunyai) tulisan itu, merupakan suatu keajaiban di antara tanda-tanda kekuasaan Kami?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Siapa yang membaca Surah Al-Kahf pada hari Jumat, cahaya akan bersinar baginya di antara dua Jumat. (Digradasi sahih oleh al-Albani)",
      },
      {
        excerpt:
          "Siapa yang menghafal sepuluh ayat dari awal Surah Al-Kahf akan terlindungi dari Dajjal.",
      },
    ],
    actions: [
      "Bukalah Surah Al-Kahf pada hari Jumat dan bacalah semampu Anda dengan kehadiran hati.",
      "Hafalkan atau ulangi sepuluh ayat pertama untuk perlindungan dari Dajjal.",
    ],
    appLinks: [{ label: "Baca Surah Al-Kahf" }],
    disclaimer:
      "Riwayat 'cahaya di antara dua Jumat' tidak terdapat dalam Enam Kitab (Kutub as-Sittah); riwayat ini diterima secara luas berdasarkan otentikasi kemudian. Perlindungan sepuluh ayat pertama (Muslim 809) adalah sahih tanpa perselisihan.",
  },
  {
    title: "Selawat kepada Nabi ﷺ pada hari Jumat",
    summary: "Perbanyak selawat kepada Nabi ﷺ pada hari terbaik dalam seminggu.",
    body: [
      "Jumat dikhususkan untuk selawat yang banyak. Aus bin Aus meriwayatkan bahwa Nabi ﷺ bersabda: 'Di antara hari-hari terbaik kalian adalah Jumat; maka perbanyaklah selawat kalian kepadaku pada hari itu, karena selawat kalian akan disampaikan kepadaku.' Mereka bertanya: 'Wahai Rasulullah, bagaimana selawat kami disampaikan kepadamu sedangkan engkau telah hancur (wafat)?' Beliau bersabda: 'Allah telah melarang bumi untuk menghancurkan jasad para nabi' (Sunan Abu Dawud 1047).",
      "Setiap bacaan selawat yang otentik terhitung — selawat yang diajarkan dalam salat, atau bentuk-bentuk yang lebih panjang dari Sunnah. Yang penting adalah kelimpahan dan ketulusan pada hari Jumat, bukan jumlah tetap tertentu.",
    ],
    hadith: [
      {
        excerpt:
          "Di antara hari-hari terbaik kalian adalah Jumat; maka perbanyaklah selawat kalian kepadaku pada hari itu, karena selawat kalian akan disampaikan kepadaku.",
      },
    ],
    actions: [
      "Tetapkan target pribadi selawat pada hari Jumat — meskipun jumlah yang sederhana namun konsisten.",
      "Gunakan koleksi selawat di aplikasi jika Anda menginginkan bacaan yang sudah siap.",
    ],
    appLinks: [{ label: "Selawat" }],
  },
  {
    title: "Waktu terkabulnya doa",
    summary: "Satu waktu pada hari Jumat ketika doa tidak ditolak — carilah terutama setelah Asar.",
    body: [
      "Abu Hurairah meriwayatkan bahwa Rasulullah ﷺ menyebutkan hari Jumat dan bersabda: 'Ada satu waktu pada hari Jumat yang jika seorang hamba Muslim berdiri dan meminta sesuatu kepada Allah, Dia pasti akan memberikannya' — dan beliau menunjukkan dengan tangannya bahwa waktu itu singkat (Sahih al-Bukhari 935; juga Sahih Muslim 852).",
      "Para ulama berbeda pendapat tentang kapan tepatnya waktu itu terjadi. Salah satu pendapat yang kuat menempatkannya pada bagian akhir hari Jumat setelah Asar: Jabir bin Abdullah meriwayatkan bahwa Nabi ﷺ bersabda: 'Hari Jumat itu dua belas jam, dan di dalamnya ada satu waktu yang jika seorang hamba Muslim meminta sesuatu kepada Allah, Dia pasti akan memberikannya — maka carilah pada jam terakhir setelah Asar' (Sunan Abu Dawud 1048).",
      "Pendapat mana pun yang Anda ikuti, penuhi hari Jumat — terutama sore hari — dengan doa yang tulus, istighfar, dan selawat, dengan mempercayai jaminan pengabulan dari Allah.",
    ],
    hadith: [
      {
        excerpt:
          "Ada satu waktu pada hari Jumat yang jika seorang hamba Muslim berdiri dan meminta sesuatu kepada Allah, Dia pasti akan memberikannya — dan beliau menunjukkan dengan tangannya bahwa waktu itu singkat.",
      },
      {
        excerpt:
          "Ada satu waktu pada hari Jumat yang jika seorang Muslim mendapati dirinya sedang salat dan meminta sesuatu kepada Allah, Dia pasti akan memberikannya.",
      },
      {
        excerpt:
          "Hari Jumat itu dua belas jam, dan di dalamnya ada satu waktu yang jika seorang hamba Muslim meminta sesuatu kepada Allah, Dia pasti akan memberikannya — maka carilah pada jam terakhir setelah Asar.",
      },
    ],
    actions: [
      "Setelah Asar pada hari Jumat, duduklah dengan daftar doa yang singkat dan mintalah dengan kehadiran hati.",
      "Gabungkan doa dengan selawat — keduanya ditekankan pada hari ini.",
    ],
    appLinks: [{ label: "Kumpulan doa" }],
    disclaimer:
      "Waktu pasti dari jam terkabulnya doa merupakan masalah perbedaan pendapat ulama (selama khutbah, setelah Asar, dan pendapat-pendapat lain). Keberadaan waktu itu sendiri telah ditetapkan dalam Bukhari dan Muslim.",
  },
];
