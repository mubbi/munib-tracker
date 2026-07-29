import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Malay translation overlay for the Learn Friday (Jumu'ah) guide. Mirrors the order of
// FRIDAY_GUIDE_TOPICS in ../friday-guide.ts (index-aligned); untranslated entries fall
// back to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const FRIDAY_GUIDE_TOPICS_MS: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Kelebihan hari Jumaat",
    summary:
      "Hari terbaik yang disinari matahari — penciptaan Adam, dan keampunan antara dua Jumaat.",
    body: [
      "Jumaat (Yawm al-Jumu'ah) adalah hari perhimpunan mingguan umat ini. Abu Hurairah meriwayatkan bahawa Rasulullah ﷺ bersabda: 'Sebaik-baik hari yang matahari terbit padanya adalah hari Jumaat; padanya Adam diciptakan, padanya dia dimasukkan ke Syurga, padanya dia dikeluarkan darinya, dan Hari Kiamat tidak akan berlaku melainkan pada hari Jumaat' (Sahih Muslim 854).",
      "Ibadahnya juga membawa satu jaminan keampunan yang berterusan. Abu Hurairah meriwayatkan bahawa Nabi ﷺ bersabda: 'Sesiapa yang mandi pada hari Jumaat, kemudian datang menghadiri solat Jumaat, mendengar dan berdiam diri semasa imam berkhutbah, dosanya antara Jumaat itu dan Jumaat berikutnya akan diampunkan, ditambah tiga hari lagi' (Sahih Muslim 857).",
      "Kelebihan-kelebihan ini adalah seruan untuk bersedia awal, mendengar dengan teliti, dan memperlakukan hari Jumaat sebagai penyegaran rohani mingguan — bukan sekadar hari cuti bekerja.",
    ],
    hadith: [
      {
        excerpt:
          "Sebaik-baik hari yang matahari terbit padanya adalah hari Jumaat; padanya Adam diciptakan, padanya dia dimasukkan ke Syurga, padanya dia dikeluarkan darinya, dan Hari Kiamat tidak akan berlaku melainkan pada hari Jumaat.",
      },
      {
        excerpt:
          "Sesiapa yang mandi pada hari Jumaat, kemudian datang menghadiri solat Jumaat, mendengar dan berdiam diri semasa imam berkhutbah, dosanya antara Jumaat itu dan Jumaat berikutnya akan diampunkan, ditambah tiga hari lagi.",
      },
    ],
    actions: [
      "Tetapkan niat pada pagi Jumaat: mandi wajib, pakaian terbaik, dan tiba awal.",
      "Perlakukan khutbah sebagai ibadah — berdiam diri dan memberi perhatian adalah sebahagian daripada ganjaran.",
    ],
  },
  {
    title: "Jumaat — kewajipan mingguan",
    summary:
      "Solat Jumaat secara berjemaah yang diwajibkan dalam Al-Quran, yang menggantikan solat Zohor bagi mereka yang menghadirinya.",
    body: [
      "Allah mewajibkan solat Jumaat dengan nama sendiri: 'Wahai orang-orang yang beriman! Apabila diseru untuk menunaikan solat pada hari Jumaat, maka bersegeralah kamu mengingati Allah dan tinggalkanlah urusan jual beli. Yang demikian itu lebih baik bagimu jika kamu mengetahui' (Al-Quran, 62:9). Ayat-ayat berikutnya membenarkan penyebaran semula dan mencari rezeki Allah selepas solat (Al-Quran, 62:10–11).",
      "Jumaat terdiri daripada khutbah dua bahagian diikuti dua rakaat yang dibaca kuat di belakang imam, dan ia menggantikan solat Zohor bagi mereka yang menghadirinya. Tariq bin Syihab meriwayatkan bahawa Nabi ﷺ menyatakan solat Jumaat berjemaah adalah wajib ke atas setiap Muslim kecuali empat orang: hamba, wanita, kanak-kanak, atau orang sakit (Sunan Abu Daud 1067).",
      "Mengabaikannya adalah amaran yang berat: Abu al-Ja'd meriwayatkan bahawa sesiapa yang meninggalkan tiga solat Jumaat kerana leka, Allah akan mengecap hatinya (Sunan an-Nasa'i 1369). Semasa khutbah, bercakap tanpa keperluan menghilangkan ganjaran — Abu Hurairah meriwayatkan bahawa jika kamu berkata kepada temanmu 'Diamlah' semasa imam berkhutbah, kamu sendiri telah bercakap sia-sia (Sahih al-Bukhari 934).",
      "Selepas Jumaat, disarankan untuk menunaikan empat rakaat: Abu Hurairah meriwayatkan bahawa Nabi ﷺ bersabda, 'Apabila salah seorang daripada kamu menunaikan solat Jumaat, hendaklah dia menunaikan empat (rakaat) selepasnya' (Sahih Muslim 881).",
    ],
    quran: [
      {
        excerpt:
          "Wahai orang-orang yang beriman! Apabila diseru untuk menunaikan solat pada hari Jumaat, maka bersegeralah kamu mengingati Allah dan tinggalkanlah urusan jual beli. Yang demikian itu lebih baik bagimu jika kamu mengetahui. Maka apabila solat telah selesai, bertebaranlah kamu di bumi dan carilah kurnia Allah...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Solat Jumaat berjemaah adalah wajib ke atas setiap Muslim kecuali empat orang: hamba, wanita, kanak-kanak, atau orang sakit.",
      },
      {
        excerpt:
          "Sesiapa yang meninggalkan tiga solat Jumaat kerana leka, Allah akan mengecap hatinya.",
      },
      {
        excerpt:
          "Jika kamu berkata kepada temanmu 'Diamlah' pada hari Jumaat semasa imam berkhutbah, kamu sendiri telah bercakap sia-sia (laghwu).",
      },
      {
        excerpt:
          "Apabila salah seorang daripada kamu menunaikan solat Jumaat, hendaklah dia menunaikan empat (rakaat) selepasnya.",
      },
    ],
    actions: [
      "Rancang perjalanan anda supaya tiba di masjid sebelum khutbah bermula.",
      "Diamkan telefon anda dan elakkan bercakap semasa khutbah.",
      "Tunaikan empat rakaat selepas Jumaat apabila boleh.",
    ],
    appLinks: [{ label: "Pelajari solat — pelajaran Jumaat" }, { label: "Buka penjejak" }],
    disclaimer:
      "Bilangan minimum jemaah untuk Jumaat yang sah, serta sama ada wanita dan pengembara digalakkan menghadirinya, adalah persoalan fiqh terperinci yang berbeza mengikut mazhab dan amalan tempatan. Wanita, pengembara, dan orang sakit yang tidak menghadiri menunaikan solat Zohor sebagai gantinya. Ini adalah kandungan pendidikan, bukan fatwa.",
  },
  {
    title: "Persediaan untuk Jumaat",
    summary: "Mandi wajib, pakaian bersih, wangian, dan tiba awal untuk ganjaran terbesar.",
    body: [
      "Persediaan adalah sebahagian daripada sunnah Jumaat. Abu Said al-Khudri meriwayatkan bahawa Rasulullah ﷺ bersabda: 'Mandi pada hari Jumaat adalah wajib ke atas setiap orang yang telah mencapai baligh' (Sahih Muslim 846). Hadis yang serupa dalam Sahih al-Bukhari (877) juga mengaitkan mandi Jumaat dengan mereka yang telah mencapai baligh.",
      "Selain mandi, Nabi ﷺ menganjurkan untuk berpenampilan sebaik mungkin. Salman al-Farisi meriwayatkan bahawa Nabi ﷺ bersabda: 'Sesiapa yang mandi pada hari Jumaat, membersihkan diri sebaik mungkin, kemudian memakai minyak rambut atau wangian, lalu keluar, dan tidak menyelinap di antara dua orang untuk duduk di tempat duduknya, mendengar imam sehingga selesai, kemudian menunaikan solat yang diwajibkan kepadanya — dosanya antara Jumaat itu dan Jumaat berikutnya akan diampunkan' (Sahih al-Bukhari 883).",
      "Ketibaan awal melipatgandakan ganjaran. Abu Hurairah meriwayatkan bahawa sesiapa yang pergi pada jam pertama seperti orang yang mengurbankan seekor unta, kemudian seekor lembu, kemudian seekor kibas, kemudian seekor ayam, kemudian sebiji telur — dan apabila imam keluar, para malaikat melipat rekod mereka dan mendengar peringatan (Sahih al-Bukhari 881).",
    ],
    hadith: [
      {
        excerpt:
          "Mandi pada hari Jumaat adalah wajib ke atas setiap orang yang telah mencapai baligh.",
      },
      {
        excerpt:
          "Mandi pada hari Jumaat adalah wajib ke atas setiap lelaki Muslim yang telah mencapai baligh.",
      },
      {
        excerpt:
          "Sesiapa yang mandi pada hari Jumaat, membersihkan diri sebaik mungkin, kemudian memakai minyak rambut atau wangian, lalu keluar, dan tidak menyelinap di antara dua orang untuk duduk di tempat duduknya, mendengar imam sehingga selesai, kemudian menunaikan solat yang diwajibkan kepadanya — dosanya antara Jumaat itu dan Jumaat berikutnya akan diampunkan.",
      },
      {
        excerpt:
          "Sesiapa yang mandi pada hari Jumaat, kemudian pergi awal, seperti orang yang mengurbankan seekor unta... kemudian seekor lembu... kemudian seekor kibas... kemudian seekor ayam... kemudian sebiji telur. Apabila imam keluar, para malaikat datang untuk mendengar peringatan.",
      },
    ],
    actions: [
      "Mandi wajib pada pagi Jumaat (atau sebelum ke masjid).",
      "Kenakan pakaian terbaik dan paling bersih, dan gunakan wangian ringan jika boleh.",
      "Tiba awal — mereka yang tiba paling awal mendapat ganjaran terbesar.",
    ],
    appLinks: [{ label: "Pelajari kebersihan — Mandi wajib" }],
    disclaimer:
      "Sama ada mandi pada hari Jumaat adalah wajib ketat atau sunnah yang sangat digalakkan adalah perbezaan klasik antara mazhab. Semua bersetuju tentang kelebihannya yang besar; ikutilah amalan yang diterima dalam komuniti anda.",
  },
  {
    title: "Surah al-Kahf pada hari Jumaat",
    summary: "Cahaya antara dua Jumaat, dan perlindungan dalam sepuluh ayat pertama.",
    body: [
      "Membaca Surah al-Kahf (Al-Quran 18) pada hari Jumaat adalah amalan mingguan yang dicintai. Abu Said al-Khudri meriwayatkan bahawa Nabi ﷺ bersabda: 'Sesiapa yang membaca Surah al-Kahf pada hari Jumaat, cahaya akan bersinar untuknya antara dua Jumaat.' Hadis ini diriwayatkan melalui al-Hakim dan al-Baihaqi dan dinilai sahih oleh Syeikh al-Albani; ramai komuniti mengamalkannya sebagai sunnah Jumaat yang mapan.",
      "Berasingan daripada itu, sepuluh ayat pertama Surah al-Kahf adalah perlindungan daripada fitnah Dajjal. Abu Darda meriwayatkan bahawa Nabi ﷺ bersabda: 'Sesiapa yang menghafal sepuluh ayat pertama Surah al-Kahf akan dilindungi daripada Dajjal' (Sahih Muslim 809).",
      "Cari masa antara petang Khamis dan matahari terbenam hari Jumaat untuk membaca surah tersebut — walaupun anda tidak dapat menghabiskan keseluruhan bahagian, mulakan dari ayat-ayat awal dan kembali semula seberapa kerap yang boleh.",
    ],
    quran: [
      {
        excerpt:
          "Segala puji bagi Allah yang telah menurunkan al-Kitab (Al-Quran) kepada hamba-Nya, dan Dia tidak menjadikan padanya sebarang kekusutan... Atau adakah kamu menyangka bahawa ahli gua dan al-Raqim itu antara tanda-tanda Kami yang menakjubkan?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sesiapa yang membaca Surah al-Kahf pada hari Jumaat, cahaya akan bersinar untuknya antara dua Jumaat. (Dinilai sahih oleh Syeikh al-Albani)",
      },
      {
        excerpt:
          "Sesiapa yang menghafal sepuluh ayat pertama Surah al-Kahf akan dilindungi daripada Dajjal.",
      },
    ],
    actions: [
      "Buka Surah al-Kahf pada hari Jumaat dan bacalah dengan penuh perhatian seberapa banyak yang boleh.",
      "Hafal atau ulang sepuluh ayat pertama sebagai perlindungan daripada Dajjal.",
    ],
    appLinks: [{ label: "Baca Surah al-Kahf" }],
    disclaimer:
      "Hadis 'cahaya antara dua Jumaat' tidak terdapat dalam Enam Kitab (Kutub al-Sittah); ia berdasarkan riwayat yang diterima secara meluas kemudiannya. Perlindungan sepuluh ayat pertama (Muslim 809) adalah sahih tanpa kontroversi.",
  },
  {
    title: "Selawat ke atas Nabi ﷺ pada hari Jumaat",
    summary: "Pada hari terbaik minggu, perbanyakkan selawat ke atas Nabi ﷺ.",
    body: [
      "Jumaat dikhususkan untuk selawat yang lebih banyak. Aus bin Aus meriwayatkan bahawa Nabi ﷺ bersabda: 'Antara hari-hari terbaik kamu adalah hari Jumaat; oleh itu perbanyakkanlah selawat kepadaku pada hari itu, kerana selawat kamu akan disampaikan kepadaku.' Mereka bertanya: 'Wahai Rasulullah, bagaimana selawat kami disampaikan kepadamu apabila jasadmu telah menjadi tanah?' Baginda bersabda: 'Allah telah mengharamkan bumi daripada memakan jasad para nabi' (Sunan Abu Daud 1047).",
      "Sebarang lafaz selawat yang sahih adalah dibenarkan — sama ada selawat yang diajar dalam solat atau bentuk yang lebih panjang daripada Sunnah. Yang penting adalah kekerapan dan ketulusan pada hari Jumaat, bukan bilangan yang tetap.",
    ],
    hadith: [
      {
        excerpt:
          "Antara hari-hari terbaik kamu adalah hari Jumaat; oleh itu perbanyakkanlah selawat kepadaku pada hari itu, kerana selawat kamu akan disampaikan kepadaku.",
      },
    ],
    actions: [
      "Tetapkan sasaran peribadi selawat untuk hari Jumaat — walaupun bilangan yang kecil tetapi konsisten.",
      "Jika anda memerlukan lafaz sedia ada, gunakan koleksi selawat dalam aplikasi.",
    ],
    appLinks: [{ label: "Selawat" }],
  },
  {
    title: "Waktu diterima doa",
    summary:
      "Satu waktu pada hari Jumaat apabila doa tidak akan ditolak — carilah terutamanya selepas Asar.",
    body: [
      "Abu Hurairah meriwayatkan bahawa Rasulullah ﷺ menyebut tentang hari Jumaat dan bersabda: 'Pada hari Jumaat terdapat satu waktu, jika seorang hamba Muslim berdiri padanya dan memohon sesuatu daripada Allah, Dia akan memberikannya kepadanya' — dan baginda menunjukkan dengan tangannya bahawa ia singkat (Sahih al-Bukhari 935; juga Sahih Muslim 852).",
      "Para ulama berbeza pendapat mengenai bila tepatnya waktu ini. Satu pandangan yang kuat meletakkannya pada bahagian akhir petang Jumaat selepas Asar: Jabir bin Abdullah meriwayatkan bahawa Nabi ﷺ bersabda: 'Hari Jumaat mempunyai dua belas jam, dan terdapat satu waktu di dalamnya, jika seorang hamba Muslim memohon sesuatu daripada Allah, Dia akan memberikannya kepadanya — maka carilah ia pada jam terakhir selepas Asar' (Sunan Abu Daud 1048).",
      "Apa pun pandangan yang anda ikuti, penuhilah hari Jumaat — terutamanya tempoh akhir petang — dengan doa yang tulus, istighfar, dan selawat, dengan keyakinan terhadap jaminan Allah untuk menjawab.",
    ],
    hadith: [
      {
        excerpt:
          "Pada hari Jumaat terdapat satu waktu, jika seorang hamba Muslim berdiri padanya dan memohon sesuatu daripada Allah, Dia akan memberikannya kepadanya — dan baginda menunjukkan dengan tangannya bahawa ia singkat.",
      },
      {
        excerpt:
          "Pada hari Jumaat terdapat satu waktu, jika seorang Muslim mendirikan solat padanya dan memohon sesuatu daripada Allah, Dia akan memberikannya kepadanya.",
      },
      {
        excerpt:
          "Hari Jumaat mempunyai dua belas jam, dan terdapat satu waktu di dalamnya, jika seorang hamba Muslim memohon sesuatu daripada Allah, Dia akan memberikannya kepadanya — maka carilah ia pada jam terakhir selepas Asar.",
      },
    ],
    actions: [
      "Selepas Asar pada hari Jumaat, luangkan masa dengan senarai doa yang ringkas dan mohonlah dengan penuh ketulusan.",
      "Gabungkan doa dengan selawat — kedua-duanya digalakkan secara khusus pada hari ini.",
    ],
    appLinks: [{ label: "Koleksi doa" }],
    disclaimer:
      "Waktu tepat bagi waktu diterima doa adalah persoalan yang diperdebatkan oleh ulama (semasa khutbah, selepas Asar, dan pandangan lain). Kewujudan waktu itu sendiri adalah sahih tanpa kontroversi dalam Bukhari dan Muslim.",
  },
];
