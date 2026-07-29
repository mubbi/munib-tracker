import type { TaharahChecklistItem, TaharahTopic } from "../../types/taharah";
import type { DeepPartial } from "./localize";

// Bengali translation overlay for the Learn Taharah content. Mirrors the order of the English source
// (index-aligned); untranslated entries fall back to English. Only
// human-readable text is translated — ids, routes, surah/ayah numbers,
// collections, citations, grades and Qur'an verse labels stay in English.
export const TAHARAH_CHECKLIST_BN: DeepPartial<TaharahChecklistItem>[] = [
  {
    title: "ফজরের আগে ওজু",
    hint: "সম্ভব হলে দিন পবিত্র অবস্থায় শুরু করুন।",
  },
  {
    title: "সিওয়াক / দাঁত মাজা",
    hint: "ওজু ও সালাতের আগে সুন্নাহ।",
  },
  {
    title: "নাপাক ছাড়া সালাতের পোশাক",
    hint: "সালাতের আগে দৃশ্যমান নাজাসat দেখে নিন।",
  },
  {
    title: "পবিত্র সালাতের স্থান",
    hint: "সালাতের জায়গা থেকে সব নাজাসat সরান।",
  },
  {
    title: "ওজু ভঙ্গের পর পুনরায় ওজু",
    hint: "বায়ু, ঘুম, প্রস্রাব — কী কী ওজু ভঙ্গ করে জানুন।",
  },
  {
    title: "প্রয়োজনে গোসল",
    hint: "বড় হাদাস, হaid বা nifas শেষে।",
  },
];

export const TAHARAH_TOPICS_BN: DeepPartial<TaharahTopic>[] = [
  {
    title: "তাহারatের ভূমিকা",
    summary: "তাহারat সালাতের দ্বার এবং মুমিনের ঈমানের অর্ধেক।",
    body: [
      "তাহারat (طهارة) মানে পবিত্রতা — শরীর, পোশাক ও সালাতের স্থান হাদাস ও নাজাসat থেকে মুক্ত করা, যাতে মুসলিম আল্লাহর সামনে তাঁর পছন্দের অবস্থায় দাঁড়াতে পারেন। ইবাদat শিক্ষার প্রথম বিষয়; এর ছাড়া সালাত সহi নয়: নবী ﷺ বলেছেন, 'সালাতের চাবি পবিত্রতা।'",
      "ইসলামে পবিত্রতার দুই দিক। বাহ্যিক: ধোয়া, কলুষ দূর, পরিচ্ছন্নতা। অন্তরিক: বিনয়, হৃদয়ের উপস্থিতি, ওজু-ঘোষণার আত্মিক প্রস্তুতি। নবী ﷺ 'ঈমানের অর্ধেক' বলে দুটো এক করেছেন — শারীরিক পরিচ্ছন্নতা ও পাপ থেকে আত্মa's পরিশuddhi।",
      "এই মডিউলে ক্রমে: পবিত্রতার পানি, ওজু, গোসল, তায়ামুম, নাজাসat দূর, বিশেষ অবস্থা ও রেহাই। একবার ভালো শিখলে সালাত দৃঢ়ভাবে পড়া যায়, সন্দেহে নয়।",
    ],
    quran: [
      {
        excerpt: "হে মুমিনগণ, সালাতে দাঁড়াতে চাইলে মুখ ও হাত কনুই পর্যন্ত ধো, মাথা মাসহ কর, ও পা গোড়ালি পর্যন্ত ধো।",
      },
      {
        excerpt: "নিশ্চয় আল্লাহ তাওবাকারী ও পবিত্রতা অবলম্বনকারীদের ভালোবাসেন।",
      },
    ],
    hadith: [
      {
        excerpt: "সালাতের চাবি পবিত্রতা, খোলা তাকবীর, শেষ সালাম। (Ali; Jami' at-Tirmidhi 3)",
      },
    ],
    actions: [
      "পবিত্রতাকে আল্লাহর সামনে যাওয়ার প্রস্তুতি করুন, তাড়াহুড়োর রুটিন নয়।",
      "প্রতিদিন একটি তাহারat বিষয় শিখুন যতক্ষণ পুরো ধারা স্বাভাবিক না হয়।",
    ],
    appLinks: [{ label: "সালাত শেখার কেন্দ্র" }],
  },
  {
    title: "পবিত্রতার গুরুত্ব",
    summary: "পবিত্রতা সালাতের absolute শর্ত ও মুমিনের চিহ্ন।",
    body: [
      "পবিত্রতা বিকল্প নয় — সালাতের শর্ত। হাদাসে থাকা ব্যক্তির সালাত আল্লাহ গ্রহণ করেন না যতক্ষণ না পবিত্র হয়। তাই ভুল ওজু/গোসলে পড়া সালাত, যতই খুশু হোক, পুনরায় করতে হয়।",
      "নবী ﷺ পবিত্রতাকে 'ঈমানের অর্ধেক' বলেছেন। নিয়মিত পবিত্রতা শৃঙ্খলা, ইবাদat-প্রস্তুতি, ও প্রবাহিত পানির সাথে ছোট গunaহ মুছে যায় — হাদীসের শিক্ষা।",
      "সালাত রক্ষা করে তাহারat; অবহেলায় অসহi সালাতের পাপ থেকেও রক্ষা। এর বিধান ভালো শেখা ইসলামের বৃহত্তম আমল রক্ষার উপায়।",
    ],
    hadith: [
      {
        excerpt: "পবিত্রতা ঈমানের অর্ধেক। (Abu Malik al-Ash'ari)",
      },
      {
        excerpt: "আল্লাহ পবিত্রতা ছাড়া সালাত ও খিয়ানat-সম্পদের sadaqah গ্রহণ করেন না। (Ibn Umar)",
      },
    ],
    actions: ["প্রতিটি সালাতের আগে পবিত্রতা নিশ্চিত করুন।", "সহজ তালিকা: শরীর, পোশাক, স্থান, ওজু।"],
  },
  {
    title: "পবিত্রতার প্রকার",
    summary: "তিন অবস্থা: ছোট হাদাস, বড় হাদাস, শারীরিক নাজাসat।",
    body: [
      "শরীয়at তিন বিষয় আলাদা করে; প্রতিটির সমাধান আলাদা। কোন অবস্থায় আছেন তা জানলেই সঠিক পদ্ধতি বেছে নিতে পারবেন।",
      "ছোট হাদাস (hadas asghar): প্রস্রাব, বায়ু, গভীর ঘুম — ওজু দিয়ে, পানি না থাকলে তায়ামুম।",
      "বড় হাদাস (hadas akbar/janabah): স্বামী-স্ত্রী, মনি নির্গম, হaid/nifas শেষ — গোসল; পানি না থাকলে/বিপদ হলে তায়ামুম।",
      "নাজাসat (মূত্র, মল, প্রবাহিত রক্ত): আলাদা — শরীর, পোশাক, সালাতের স্থান থেকে physically সরাতে হয়, হাদাস নির্বিশেষে। চার Sunni mazhab তিন শ্রেণিতে একমত; কিছু বিস্তারিতে ভিন্ন।",
    ],
    quran: [
      {
        excerpt: "জনুব থাকলে পবিত্র হও; অসুস্থ/সফরে… পানি না পেলে পবিত্র মাটিতে তায়ামুম কর।",
      },
    ],
    actions: [
      "অবস্থা চিনুন (ছোট/বড় হাদাস বা নাজাসat), তারপর সঠিক পদ্ধতি।",
      "বিস্তারিতে সন্দেহ হলে এক বিশ্বস্ত mazhab-এর alim অনুসরণ করুন।",
    ],
  },
  {
    title: "ইসলামে পানি",
    summary: "পবিত্র পানি প্রধান উপকরণ — যথেষ্ট ব্যবহার, অপচয় নয়।",
    body: [
      "পবিত্রতার মূল উপকরণ পানি। আল্লাহ বৃষ্টিকে 'পবিত্র' (তাহুর) বলেছেন — পবিত্রতা ও ইবাদat-উপযোগী। প্রাকৃতিক পরিষ্কার পানি — বৃষ্টি, নদী, সমুদ্র, ঝরনা, কূপ, কল — নাজাসat মিশে রঙ/গন্ধ/স্বাদ না বদলালে পবিত্র।",
      "Ulama বিস্তারিত শ্রেণি দেন, কিন্তু দৈনন্দিন নিয়ম সহজ: নাজাসatে স্পষ্ট পরিবর্তন না হলে ওজু-গোসলের পানি ঠিক। সন্দেহে পরিষ্কার বিকল্প থাকলে সেটি ব্যবহার করুন।",
      "ইসলাম পরিপূর্ণতা শেখায়, অতিরিক্ততা নয়। নবী ﷺ কম পানিতে পূর্ণ ধোয়া — ওজু ~১ mud, গোসল ~১ sha'; প্রচুর পানিতেও অপচয় নিষিদ্ধ; সাদগী ইবাদatের আদব।",
    ],
    quran: [{ excerpt: "আকাশ থেকে আমরা পবিত্র পানি বর্ষণ করি।" }],
    hadith: [
      {
        excerpt: "নবী ﷺ ~১ mud-এ ওজু, ~১ sha' (৫ mud পর্যন্ত) গোসল করতেন। (Anas; Sahih Muslim 325)",
      },
    ],
    actions: [
      "যথেষ্ট পানি দিয়ে পূর্ণ ধোয়া, কিন্তু নল কম রাখুন, অপচয় এড়ান।",
      "নাজাসatে রঙ/গন্ধ বদলালে নিকটতম পরিষ্কার উৎস খুঁজুন।",
    ],
    disclaimer:
      "'ঝরনায়ও পানি অপচয় করো না' (Ibn Majah 425) অনেক alim দুর্বল; সাদগীর sunnah mud/sha' হাদীসে প্রতিষ্ঠিত।",
  },
  {
    title: "Apa Itu Wudu?",
    summary: "Bersuci ritual yang menghilangkan hadas kecil sebelum beribadah.",
    body: [
      "Wudu (وضوء) adalah pembasuhan anggota tubuh tertentu, dengan urutan tertentu, sesuai syariat, yang menghilangkan hadas kecil. Empat basuhan wajibnya disebutkan langsung dalam Al-Qur'an (5:6): wajah, kedua lengan sampai siku, mengusap kepala, dan kedua kaki sampai mata kaki.",
      "Wudu diwajibkan sebelum setiap salat — kecuali kau masih dalam keadaan suci dari salat sebelumnya — dan menurut mayoritas ulama, juga sebelum melakukan tawaf di sekeliling Ka'bah dan sebelum menyentuh mushaf Al-Qur'an.",
      "Wudu adalah ibadah tersendiri, bukan sekadar pendahuluan. Nabi ﷺ memperingatkan bahwa 'Allah tidak menerima salat salah seorang dari kalian yang batal wudunya sampai ia berwudu kembali' — sehingga menjaga wudu berarti menjaga salat itu sendiri.",
    ],
    hadith: [
      {
        excerpt:
          "Allah tidak menerima salat seseorang yang batal wudunya sampai ia berwudu. (Abu Hurairah)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Syarat Sahnya Wudu",
    summary: "Niat, air suci, dan kulit yang tidak terhalang — prasyarat wudu yang sah.",
    body: [
      "Beberapa syarat harus terpenuhi agar wudu dianggap sah. Orang yang berwudu harus seorang muslim yang berakal sehat, dengan niat bersuci untuk beribadah. Sebagian mazhab menggolongkan niat sebagai rukun perbuatan ini dan sebagian lain sebagai syarat, tetapi semua sepakat bahwa niat diperlukan untuk mendapatkan pahala, dan menurut mayoritas, juga untuk keabsahannya.",
      "Air yang digunakan harus suci dan menyucikan. Yang terpenting, air itu harus benar-benar mencapai kulit — sehingga apa pun yang membentuk lapisan kedap air pada suatu anggota tubuh (cat tebal, cat kuku, lilin, lem) harus dihilangkan terlebih dahulu, jika tidak, basuhan di baliknya tidak sah. Kotoran biasa atau noda pacar yang tidak menghalangi air bukanlah masalah.",
      "Mazhab Syafi'i dan Hambali juga mewajibkan agar basuhan dilakukan sesuai urutan Al-Qur'an dan tanpa jeda panjang (muwalat) yang membuat anggota tubuh mengering. Pendapat mazhab Hanafi dan Maliki tentang urutan dan kesinambungan yang ketat ini lebih longgar dalam sebagian keadaan. Ikuti satu metode mazhab secara konsisten.",
    ],
    quran: [
      {
        excerpt:
          "Basuhlah wajahmu dan tanganmu sampai ke siku, usaplah kepalamu, dan basuhlah kakimu sampai ke kedua mata kaki.",
      },
    ],
    actions: [
      "Hilangkan cat kuku, cincin yang menahan air, dan apa pun yang menutup kulit sebelum berwudu.",
      "Lakukan wudu dengan tenang dalam satu rangkaian agar tidak ada anggota tubuh yang terlewat atau sempat mengering.",
    ],
  },
  {
    title: "Rukun-Rukun Wudu",
    summary: "Rukun yang disebutkan Al-Qur'an, tanpanya wudu tidak sah.",
    body: [
      "Rukun-rukun wudu adalah bagian-bagian yang disebutkan Allah dalam ayat: membasuh seluruh wajah; membasuh kedua lengan sampai dan termasuk siku; mengusap kepala; serta membasuh kedua kaki sampai dan termasuk mata kaki. Bila salah satu terlewat, wudu tidak sempurna.",
      "Selain itu, mazhab-mazhab menambahkan kewajiban lain berdasarkan sunnah dan ijtihad. Niat wajib menurut kebanyakan mazhab (mazhab Hanafi menggolongkannya sebagai sunnah yang sangat ditekankan untuk menghilangkan hadas kecil). Urutan (tartib) dan kesinambungan (muwalat) wajib menurut mazhab Syafi'i dan Hambali. Mazhab Maliki menambahkan menggosok anggota tubuh (dalk) sebagai kewajiban.",
      "Segala sesuatu di luar ini — berkumur dan memasukkan air ke hidung, membasuh tangan lebih dulu, membasuh tiga kali — adalah sunnah, bukan wajib. Mengetahui perbedaannya membuatmu dapat membedakan kapan wudu sekadar kurang sempurna dan kapan benar-benar tidak sah.",
    ],
    quran: [
      {
        excerpt:
          "Basuhlah wajahmu dan tanganmu sampai ke siku, usaplah kepalamu, dan basuhlah kakimu sampai ke kedua mata kaki.",
      },
    ],
    disclaimer:
      "Daftar pasti rukun wudu (misalnya apakah niat, urutan, dan menggosok termasuk wajib) berbeda di antara keempat mazhab. Pelajari dan amalkan satu mazhab yang terpercaya secara konsisten.",
  },
  {
    title: "Sunnah-Sunnah Wudu",
    summary: "Amalan yang dianjurkan, yang menyempurnakan wudu dan melipatgandakan pahalanya.",
    body: [
      "Di sekitar inti kewajiban, Nabi ﷺ mengamalkan banyak amalan sunnah yang menyempurnakan dan memperindah wudu. Meninggalkan salah satunya tidak membatalkan wudu, tetapi mengamalkannya mendatangkan pahala tambahan dan lebih sempurna mengikuti teladan beliau.",
      "Amalan sunnah yang telah mapan meliputi: mengucapkan 'Bismillah' di awal; membasuh kedua tangan tiga kali sebelum memulai; berkumur (madhmadhah) dan memasukkan air ke hidung (istinsyaq); menyela-nyela jenggot yang lebat dan sela-sela jari tangan serta kaki (takhlil) dengan jari basah; memulai setiap pasang anggota tubuh dengan yang kanan; dan mengulang setiap basuhan hingga tiga kali.",
      "Dua sunnah patut mendapat perhatian khusus: menggunakan siwak sebelum berwudu — yang hampir diwajibkan oleh Nabi ﷺ — dan membaca syahadat setelah selesai, yang membuka kedelapan pintu surga bagi orang yang mengucapkannya.",
    ],
    hadith: [
      {
        excerpt:
          "Barang siapa berwudu dengan sempurna, lalu mengucapkan 'Aku bersaksi bahwa tiada tuhan selain Allah… dan bahwa Muhammad adalah hamba dan utusan-Nya,' maka kedelapan pintu surga dibukakan baginya. (Umar bin Khattab)",
      },
    ],
    actions: [
      "Amalkan rangkaian sunnah secara lengkap sampai menjadi kebiasaan alami bagimu.",
      "Bacalah syahadat setelah wudu setiap kali.",
    ],
    appLinks: [{}],
  },
  {
    title: "Wudu Langkah demi Langkah",
    summary: "Rangkaian lengkap sesuai tuntunan Nabi, dari niat hingga doa penutup.",
    body: [
      "Nabi ﷺ mengajarkan wudu sebagai rangkaian yang mengalir, memadukan kewajiban dengan amalan sunnah. Inilah cara yang dicontohkan oleh Utsman bin Affan kepada orang-orang, seraya berkata bahwa ia melihat Nabi ﷺ berwudu persis seperti ini — dan barang siapa berbuat serupa lalu salat dua rakaat dengan penuh kekhusyukan, dosa-dosanya yang lalu akan diampuni.",
      "Lakukan setiap langkah dengan tenang, pastikan air mencapai setiap bagian yang diwajibkan. Anggota tubuh yang dibasuh (wajah, lengan, kaki) dicuci; kepala hanya diusap.",
    ],
    steps: [
      {
        title: "Niatkan bersuci dan ucapkan Bismillah",
        body: "Tetapkan niat berwudu dalam hati dan mulailah dengan menyebut nama Allah.",
        tip: "Niat itu urusan hati — tidak perlu diucapkan dengan lafaz tertentu.",
      },
      {
        title: "Basuh kedua tangan tiga kali",
        body: "Basuh sampai pergelangan tangan, alirkan air di sela-sela jari.",
      },
      {
        title: "Berkumur tiga kali",
        body: "Ambil air ke dalam mulut, putar, lalu keluarkan.",
      },
      {
        title: "Masukkan air ke hidung tiga kali",
        body: "Hirup air perlahan ke dalam lubang hidung lalu hembuskan keluar.",
      },
      {
        title: "Basuh wajah tiga kali (fardu)",
        body: "Dari batas tumbuhnya rambut hingga bawah dagu, dan dari telinga ke telinga.",
      },
      {
        title: "Basuh lengan kanan, lalu lengan kiri (fardu)",
        body: "Masing-masing dari ujung jari hingga dan termasuk siku, hingga tiga kali.",
      },
      {
        title: "Usap kepala sekali (fardu)",
        body: "Dengan tangan basah, usap dari depan ke belakang lalu kembali, kemudian usap kedua telinga dengan kebasahan yang sama.",
      },
      {
        title: "Basuh kaki kanan, lalu kaki kiri (fardu)",
        body: "Masing-masing hingga dan termasuk mata kaki, selipkan jari di sela-sela jari kaki.",
        tip: "Perhatikan tumit dan mata kaki — bagian yang paling sering terlewat.",
      },
      {
        title: "Baca doa penutup",
        body: "Ucapkan syahadat agar pintu-pintu surga terbuka.",
        tip: "Sunnah yang singkat namun sangat besar pahalanya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Utsman membasuh setiap anggota tubuh tiga kali sebagaimana ia melihat Nabi ﷺ melakukannya, lalu berkata: barang siapa berwudu seperti ini lalu salat dua rakaat dengan penuh kekhusyukan, dosa-dosanya yang lalu diampuni. (Humran, dari Utsman)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Doa-Doa Seputar Wudu",
    summary: "Doa sebelum dan sesudah wudu yang diriwayatkan secara sahih.",
    body: [
      "Zikir yang paling kuat riwayatnya seputar wudu ada dua: mengucapkan 'Bismillah' di awal, dan syahadat setelah selesai. Pada syahadat penutup ini, ada tambahan sahih yang memohon kepada Allah: 'Jadikanlah aku termasuk orang-orang yang bertobat dan jadikanlah aku termasuk orang-orang yang menyucikan diri.'",
      "Penting untuk diketahui bahwa 'doa setiap anggota tubuh' secara rinci (doa khusus saat membasuh tangan, wajah, lengan, dan seterusnya) yang beredar di sebagian buku kecil, tidak memiliki dasar sahih dari Nabi ﷺ. Para ulama menyarankan untuk tidak menisbahkannya kepada beliau sebagai sunnah, meski tidak ada larangan berzikir secara umum kepada Allah selama berwudu.",
      "Inti persoalannya adalah kehadiran hati: berwudulah dengan kesadaran bahwa dosa setiap anggota tubuh sedang berguguran, dan tutuplah dengan syahadat yang menghubungkan kembali amalan ini dengan tujuannya — keimanan kepada Allah semata.",
    ],
    hadith: [
      {
        excerpt:
          "Barang siapa berwudu dengan sempurna lalu membaca syahadat, kedelapan pintu surga dibukakan baginya untuk masuk dari pintu mana pun yang ia kehendaki. (Umar)",
      },
    ],
    actions: [
      "Hafalkan syahadat setelah wudu jika belum hafal.",
      "Hindari membaca doa per-anggota-tubuh yang tidak terbukti sahih seolah-olah itu sunnah yang mapan.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Apa yang Membatalkan Wudu?",
    summary: "Hal-hal yang membatalkan wudu — dan kaidah keyakinan ketika ragu.",
    body: [
      "Menurut kesepakatan ulama, wudu batal oleh apa saja yang keluar dari dua jalan kemaluan — air kencing, kotoran, angin, atau keluarnya cairan lain — juga oleh tidur nyenyak yang menghilangkan kesadaran, dan oleh hilangnya kesadaran karena pingsan atau mabuk.",
      "Perkara lain menjadi ranah perbedaan pendapat yang saling menghormati antar mazhab: menyentuh langsung kemaluan, dan bersentuhan kulit dengan lawan jenis yang bukan mahram, dianggap membatalkan di sebagian mazhab tetapi tidak di mazhab lain, berdasarkan pembacaan yang berbeda atas teks yang sama.",
      "Sebuah kaidah pokok melindungimu dari kecemasan (waswas) yang terus-menerus: keyakinan tidak hilang oleh keraguan. Jika kau yakin sudah berwudu dan hanya ragu apakah wudu itu batal, kau tetap dianggap dalam keadaan berwudu sampai kau yakin ada hal yang membatalkannya. Nabi ﷺ pernah berpesan kepada seseorang yang terganggu oleh perasaan ini agar tidak meninggalkan salatnya 'sampai ia mendengar suara atau mencium bau.'",
    ],
    hadith: [
      {
        excerpt:
          "Janganlah ia meninggalkan (salatnya) sampai ia mendengar suara atau mencium bau. (Abbad bin Tamim, dari pamannya)",
      },
    ],
    disclaimer:
      "Apakah menyentuh lawan jenis atau kemaluan sendiri membatalkan wudu berbeda-beda menurut mazhab. Ikuti guru setempat yang berkompeten dan satu metode mazhab.",
  },
  {
    title: "Kesalahan Umum dalam Wudu",
    summary:
      "Kesalahan yang sering terjadi, yang mengurangi pahala — atau membatalkan wudu sepenuhnya.",
    body: [
      "Sebagian besar kekurangan dalam wudu berasal dari terburu-buru. Terlalu tergesa hingga air tidak mencapai seluruh bagian anggota tubuh — bagian kering di tumit, mata kaki, siku, atau sela-sela jari — dapat membuat wudu tidak sah, karena basuhan yang diwajibkan Al-Qur'an belum sempurna di sana.",
      "Nabi ﷺ pernah melihat orang-orang yang tumitnya masih kering karena air tidak mencapainya, lalu bersabda dengan tegas, 'Celakalah tumit-tumit itu dari api neraka!' Tumit, mata kaki, dan tepi wajah adalah bagian yang paling sering terlewat.",
      "Kesalahan sebaliknya adalah berlebihan: membasuh jauh lebih dari tiga kali, atau memboroskan air, yang bertentangan dengan sunnah kesederhanaan. Sebagian orang terjerumus dalam waswas, mengulang wudu berkali-kali — ini pun kesalahan, karena keyakinan tidak digugurkan oleh kecurigaan.",
    ],
    hadith: [
      {
        excerpt:
          "Celakalah tumit-tumit itu dari api neraka! — diucapkan ketika beliau melihat tumit yang masih kering saat berwudu. (Abu Hurairah)",
      },
    ],
    actions: [
      "Perlambat gerakan dan pastikan secara sadar seluruh bagian anggota yang dibasuh telah tercapai, terutama tumit dan siku.",
      "Gunakan air secukupnya; jangan biarkan waswas mendorongmu mengulang tanpa perlu.",
    ],
  },
  {
    title: "Keutamaan Wudu",
    summary:
      "Wudu menghapus dosa, mengangkat derajat, dan akan membuat kaum mukmin bercahaya di hari kiamat.",
    body: [
      "Wudu adalah pembasuhan dosa yang berulang-ulang. Nabi ﷺ mengajarkan bahwa ketika seorang mukmin membasuh setiap anggota tubuhnya, perbuatan salah yang dilakukan oleh anggota tubuh itu berguguran bersama air — dari mata, dari tangan, dari kaki — hingga orang itu keluar dalam keadaan bersih dari dosa. Maka salat yang didahului wudu adalah salat yang didahului ampunan yang segar.",
      "Wudu juga merupakan kehormatan yang membedakan di akhirat kelak. Pada hari kiamat, Nabi ﷺ akan mengenali para pengikutnya dari cahaya di wajah, tangan, dan kaki mereka bekas wudu — cahaya yang khusus dimiliki umat ini, disebut al-ghurr al-muhajjalun.",
      "Karena keutamaan-keutamaan ini, menjaga diri tetap dalam keadaan berwudu adalah kebiasaan yang dianjurkan: memperbaruinya untuk setiap salat, dan tidur dalam keadaan berwudu, termasuk kebiasaan yang menjaga seorang mukmin.",
    ],
    hadith: [
      {
        excerpt:
          "Umatku akan dipanggil pada hari kiamat dengan wajah, tangan, dan kaki yang bercahaya bekas wudu. (Abu Hurairah)",
      },
    ],
    actions: [
      "Perbarui wudu untuk setiap waktu salat bila memungkinkan.",
      "Jadikan tidur dalam keadaan berwudu sebagai sunnah setiap malam.",
    ],
    appLinks: [{}],
  },
  {
    title: "Apa Itu Mandi Wajib (Ghusl)?",
    summary: "Mandi seluruh tubuh sesuai syariat yang menghilangkan hadas besar (janabah).",
    body: [
      "Mandi wajib/ghusl (غسل) adalah pembasuhan seluruh tubuh sesuai syariat, disertai niat, untuk menghilangkan hadas besar (janabah). Jika wudu mengatasi hadas kecil, ghusl mengatasi keadaan yang lebih besar yang muncul setelah hubungan suami istri, keluarnya air mani, dan berakhirnya masa haid atau nifas.",
      "Intinya adalah air harus mencapai setiap bagian tubuh bagian luar — tidak boleh ada bagian kering yang tersisa, termasuk akar rambut, lipatan kulit, belakang telinga, pusar, dan sela-sela jari kaki. Berkumur dan memasukkan air ke hidung termasuk dalam ghusl menurut banyak ulama.",
      "Satu kali mandi wajib yang dilakukan dengan niat menghilangkan janabah juga menghilangkan hadas kecil, sehingga orang yang telah menyelesaikan ghusl dapat langsung salat tanpa wudu terpisah (meskipun berwudu di dalam ghusl adalah sunnah).",
    ],
    quran: [
      {
        excerpt: "Dan jika kamu dalam keadaan junub, maka sucikanlah dirimu.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Kapan Mandi Wajib Diwajibkan",
    summary: "Keadaan-keadaan yang mewajibkan atau menganjurkan mandi seluruh tubuh.",
    body: [
      "Mandi wajib menjadi fardu dalam beberapa keadaan tertentu: keluarnya air mani disertai syahwat (baik dalam keadaan terjaga maupun melalui mimpi basah); hubungan suami istri itu sendiri, sekalipun tanpa keluarnya air mani — Nabi ﷺ bersabda bahwa begitu keduanya bertemu, mandi wajib menjadi keharusan; serta berakhirnya haid atau nifas. Kematian juga mewajibkan pihak yang masih hidup untuk memandikan jenazah.",
      "Mandi lainnya bersifat mustahab (dianjurkan), bukan wajib: mandi Jumat sebelum salat Jumat, yang sangat ditekankan hingga Nabi ﷺ menyebutnya 'kewajiban bagi setiap orang yang telah balig'; mandi untuk kedua hari raya; dan mandi ihram sebelum haji atau umrah.",
      "Seorang mualaf diperintahkan untuk mandi ketika masuk Islam — sebagian ulama menilainya wajib dan sebagian lain menilainya sangat dianjurkan.",
    ],
    hadith: [
      {
        excerpt:
          "Apabila seorang laki-laki duduk di antara empat anggota tubuh istrinya lalu bersetubuh dengannya, maka mandi wajib menjadi keharusan. (Abu Hurairah; juga Sahih Muslim 348)",
      },
      {
        excerpt:
          "Mandi pada hari Jumat wajib bagi setiap orang yang telah balig. (Abu Sa'id al-Khudri; juga Sahih Muslim 846)",
      },
    ],
    disclaimer:
      "Apakah mandi Jumat dan mandi masuk Islam bersifat wajib atau sangat dianjurkan berbeda menurut mazhab dan keadaan.",
    appLinks: [{}],
  },
  {
    title: "Mandi Wajib Langkah demi Langkah",
    summary: "Cara sesuai tuntunan Nabi — kewajiban minimal ditambah sunnah lengkap.",
    body: [
      "Aisyah menggambarkan tata cara mandi Nabi ﷺ secara rinci, dan dari sanalah para ulama menyimpulkan baik mandi minimal yang sah maupun tata cara sunnah yang lebih lengkap. Yang minimal hanyalah: niat ditambah air yang mencapai seluruh tubuh (disertai berkumur dan memasukkan air ke hidung menurut banyak ulama). Tata cara lengkap di bawah ini adalah cara Nabi ﷺ sendiri melakukannya.",
      "Lakukan dengan tenang, gosokkan air ke kulit agar tidak ada bagian yang tertinggal kering.",
    ],
    steps: [
      {
        title: "Niatkan dalam hati",
        body: "Niatkan dalam hati untuk menghilangkan hadas besar (janabah).",
      },
      {
        title: "Ucapkan Bismillah dan basuh kedua tangan",
        body: "Mulailah dengan menyebut nama Allah dan basuh kedua tangan.",
      },
      {
        title: "Basuh kemaluan",
        body: "Hilangkan segala najis dari kemaluan dengan tangan kiri.",
      },
      {
        title: "Lakukan wudu secara lengkap",
        body: "Berwudulah sebagaimana untuk salat. Kau boleh menunda membasuh kaki sampai akhir jika berdiri di atas air yang tergenang.",
      },
      {
        title: "Tuangkan air ke kepala tiga kali",
        body: "Alirkan air hingga ke kulit kepala dan akar rambut.",
      },
      {
        title: "Basuh sisi kanan, lalu sisi kiri",
        body: "Tuangkan dan gosokkan air ke seluruh tubuh, mulai dari sisi kanan.",
      },
      {
        title: "Pastikan seluruh tubuh tercakup",
        body: "Jangan tinggalkan bagian yang kering — ketiak, pusar, belakang lutut dan telinga, serta sela-sela jari kaki.",
        tip: "Wanita tidak perlu melepas kepangan rambutnya, selama air mencapai kulit kepala.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Nabi ﷺ, ketika mandi junub, membasuh kedua tangannya, berwudu sebagaimana untuk salat, menyela-nyela rambutnya dengan jari, lalu menuangkan air ke kepalanya tiga kali dan ke seluruh tubuhnya. (Aisyah)",
      },
    ],
  },
  {
    title: "Kesalahan Umum dalam Mandi Wajib",
    summary:
      "Hindari bagian yang kering, niat yang terlewat, dan menganggap mandi biasa sebagai mandi wajib.",
    body: [
      "Kesalahan paling mendasar adalah menganggap mandi biasa sebagai mandi wajib. Mandi wajib memerlukan niat untuk menghilangkan hadas besar; tanpanya, seberapa lama pun kau mandi, keadaan hadas itu tidak hilang. Niatkan sebelum kau memulai.",
      "Kesalahan umum kedua adalah meninggalkan bagian yang kering. Kewajibannya adalah air harus menyentuh seluruh bagian luar tubuh, sehingga mengabaikan akar rambut kepala, telinga, pusar, punggung bagian bawah, atau sela-sela jari kaki membuat mandi wajib tidak sempurna. Gosokkan air ke bagian-bagian ini agar yakin.",
      "Mengenai rambut: wanita yang rambutnya dikepang tidak wajib melepas kepangan, selama air mencapai akar kulit kepala — Nabi ﷺ memberitahu Ummu Salamah bahwa menuangkan tiga cakupan tangan ke kepala sudah cukup. Rambut laki-laki, yang biasanya terurai, perlu disela-sela agar air mencapai akarnya.",
    ],
    hadith: [
      {
        excerpt:
          "Cukup bagimu menuangkan tiga cakupan tangan air ke kepalamu, lalu tuangkan air ke seluruh tubuhmu, maka engkau telah suci — engkau tidak perlu melepas kepanganmu. (Ummu Salamah)",
      },
    ],
    actions: [
      "Ucapkan niat sebelum tuangan air yang pertama, agar basuhan itu terhitung sebagai mandi wajib.",
      "Gosokkan air ke bagian-bagian yang mudah terlewat; bila ragu, basuh ulang suatu bagian daripada menyelesaikannya dalam keraguan.",
    ],
  },
  {
    title: "Apa Itu Tayamum?",
    summary: "Bersuci kering dengan tanah bersih, ketika air tidak dapat digunakan.",
    body: [
      "Tayamum (تيمم) adalah pengganti wudu atau mandi wajib yang penuh rahmat, ketika air benar-benar tidak tersedia atau tidak dapat digunakan. Alih-alih membasuh, seseorang menepukkan telapak tangan ke tanah yang bersih lalu mengusap wajah dan kedua tangan — dan ini sepenuhnya menggantikan bersuci dengan air, sehingga salat menjadi sah.",
      "Tayamum adalah anugerah khusus bagi umat ini: Nabi ﷺ bersabda, 'Bumi telah dijadikan bagiku sebagai tempat salat dan sarana bersuci,' menyebutnya sebagai salah satu keistimewaan khusus yang diberikan kepada beliau dan tidak diberikan kepada nabi-nabi sebelumnya. Ini mencerminkan prinsip utama agama ini — kewajiban tetap ada, tetapi kesulitannya diringankan.",
      "Ini adalah keringanan sementara: begitu air tersedia dan dapat digunakan, bersuci dengan air kembali berlaku. Seseorang mungkin perlu memperbarui tayamum untuk setiap salat menurut sebagian mazhab.",
    ],
    quran: [
      {
        excerpt:
          "…dan kamu tidak menemukan air, maka bertayamumlah dengan tanah yang bersih dan usaplah wajah dan tanganmu dengannya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Bumi telah dijadikan bagiku sebagai tempat salat dan sarana bersuci. (Jabir — salah satu dari lima keistimewaan yang diberikan khusus kepada Nabi ﷺ)",
      },
    ],
  },
  {
    title: "Kapan Tayamum Diperbolehkan",
    summary:
      "Diperbolehkan ketika air tidak ada, membahayakan, atau sangat dibutuhkan untuk bertahan hidup.",
    body: [
      "Tayamum diperbolehkan dalam tiga keadaan besar. Pertama, ketika tidak ditemukan air setelah pencarian yang wajar — musafir di padang pasir, atau siapa pun yang benar-benar tidak dapat mengaksesnya. Kedua, ketika menggunakan air akan menimbulkan bahaya: bagi orang sakit yang lukanya atau penyakitnya akan memburuk, atau dalam cuaca yang sangat dingin tanpa cara untuk menghangatkan air dan ada risiko bahaya yang nyata.",
      "Ketiga, ketika sedikit air yang tersedia dibutuhkan untuk keperluan yang lebih mendesak — seperti minum, demi menjaga nyawa, baik nyawanya sendiri, orang lain, maupun hewan. Dalam setiap keadaan, syariat mengutamakan penjagaan nyawa dan kesehatan di atas cara bersuci yang lebih utama.",
      "Para ulama fikih berbeda pendapat mengenai batasan-batasan yang lebih rinci — seberapa jauh seseorang harus mencari air, seberapa besar kekhawatiran akan bahaya yang cukup — tetapi mereka sepakat atas rahmat yang mendasarinya: ibadah tidak pernah digugurkan, hanya dimudahkan.",
    ],
    hadith: [
      {
        excerpt:
          "Disebutkan dalam bab-bab tayamum: keringanan untuk bersuci dengan tanah bersih ketika tidak ada air yang dapat digunakan.",
      },
    ],
    actions: [
      "Carilah air secara wajar sebelum menggunakan tayamum.",
      "Jika dokter menyarankan agar luka atau penyakit tetap kering, ikuti saran itu dan lakukan tayamum.",
    ],
  },
  {
    title: "Tayamum Langkah demi Langkah",
    summary: "Rangkaian singkat dan sederhana untuk bersuci kering yang sah.",
    body: [
      "Tayamum sengaja dibuat singkat — mencerminkan tujuannya sebagai keringanan dalam kesulitan. Ia dilakukan dengan permukaan tanah alami yang bersih: tanah, pasir, batu, atau debu. Intinya, dari contoh langsung yang diperagakan Nabi ﷺ kepada Ammar bin Yasir, adalah satu kali tepukan telapak tangan pada tanah bersih, lalu mengusap wajah dan kedua tangan.",
      "Ini sengaja dibuat lebih ringan daripada wudu, jadi jangan menambah-nambahkan rincian yang rumit.",
    ],
    steps: [
      {
        title: "Niatkan dalam hati",
        body: "Niatkan untuk menghilangkan hadas demi beribadah.",
      },
      {
        title: "Ucapkan Bismillah",
        body: "Mulailah dengan menyebut nama Allah.",
      },
      {
        title: "Tepukkan kedua telapak tangan sekali ke tanah bersih",
        body: "Letakkan telapak tangan dengan ringan pada permukaan alami yang bersih dan berdebu.",
      },
      {
        title: "Usap wajah",
        body: "Usap seluruh wajah sekali dengan kedua tangan.",
      },
      {
        title: "Usap kedua tangan",
        body: "Usap punggung kedua tangan — sampai pergelangan tangan menurut kebanyakan ulama.",
        tip: "Ikuti satu metode mazhab (pergelangan tangan atau lengan bawah) secara konsisten.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Nabi ﷺ menepukkan telapak tangannya ke tanah, lalu mengusap wajah dan kedua tangannya — mengajarkan kepada Ammar bahwa ini sudah cukup. (Ammar bin Yasir)",
      },
    ],
  },
  {
    title: "Apa yang Membatalkan Tayamum?",
    summary:
      "Dibatalkan oleh hal-hal yang biasa membatalkan wudu — dan oleh kembalinya air yang dapat digunakan.",
    body: [
      "Tayamum yang dilakukan sebagai pengganti wudu batal oleh segala hal yang membatalkan wudu: buang air, kentut, tidur nyenyak, dan sebagainya. Tayamum sebagai pengganti mandi wajib juga batal oleh apa saja yang menyebabkan hadas besar.",
      "Secara khusus, tayamum juga berakhir ketika penyebabnya hilang — yaitu diperolehnya akses pada air yang dapat digunakan. Begitu air ditemukan dan dapat digunakan, keringanan itu gugur dan seseorang kembali kepada wudu atau mandi wajib.",
      "Sebuah keringanan praktis: jika kau telah salat dengan sah menggunakan tayamum dan baru menemukan air setelahnya, mayoritas ulama berpendapat bahwa salat yang telah selesai itu tidak perlu diulang — salat itu telah dilakukan dengan benar sesuai hukum yang berlaku pada saat itu. Namun jika air muncul sebelum salat, kau harus menggunakannya.",
    ],
    actions: [
      "Periksa kembali ketersediaan air di awal setiap waktu salat.",
      "Begitu air dapat digunakan, segera kembali bersuci dengan air tanpa menunda.",
    ],
    disclaimer:
      "Sebagian rincian — seperti apakah salat diulang setelah air ditemukan masih dalam waktunya — berbeda menurut mazhab.",
  },
  {
    title: "Najis (Najasah)",
    summary: "Kotoran fisik yang harus dihilangkan dari badan, pakaian, dan tempat salat.",
    body: [
      "Najis (نجاسة) adalah kotoran ritual yang nyata secara fisik, berbeda dari keadaan hadas. Contoh-contoh yang disepakati jelas mencakup air kencing dan kotoran manusia, darah yang mengalir, daging dan cairan babi, serta air liur anjing (yang memerlukan cara pembasuhan khusus). Menghilangkan najis dari badan, pakaian yang dikenakan, dan tempat salat adalah syarat sahnya salat.",
      "Penghilangannya dilakukan dengan air di tempat kotoran itu nyata, dengan mencuci sampai zat dan bekasnya hilang. Islam juga menanggapi serius sumber-sumber najis: Nabi ﷺ memperingatkan bahwa sebagian besar siksa kubur berasal dari kelalaian terhadap air kencing — terkena percikannya dan tidak membersihkan diri dengan benar.",
      "Mazhab-mazhab berbeda pendapat dalam mengklasifikasikan sebagian zat (misalnya, apakah sejumlah kecil cairan tertentu dimaafkan) dan mengenai berapa banyak sisa yang ditoleransi. Prinsip praktis untuk kehidupan sehari-hari: bersihkan dengan tuntas, dan jangan menciptakan keraguan tentang kesucian di mana tidak ada bukti adanya najis.",
    ],
    hadith: [
      {
        excerpt:
          "Nabi ﷺ melewati dua kuburan dan bersabda bahwa penghuninya sedang disiksa — satu karena menyebarkan fitnah, dan yang lain karena tidak menjaga diri dari air kencingnya. (Ibnu Abbas; juga Sahih Muslim 292)",
      },
    ],
  },
  {
    title: "Membersihkan Pakaian dari Najis",
    summary: "Cara mencuci pakaian agar salat dengan mengenakannya menjadi sah.",
    body: [
      "Ketika najis mengenai pakaian, cucilah bagian yang terkena dengan air sampai zat itu sendiri dan bekas yang tampak hilang. Nabi ﷺ mengajarkan seorang wanita yang pakaiannya terkena darah haid untuk mengeriknya, lalu menggosoknya dengan air, lalu mencucinya, dan salat dengan mengenakannya.",
      "Jika, setelah usaha yang sungguh-sungguh dan tuntas, masih tersisa noda warna samar atau bau ringan yang tidak dapat hilang, mayoritas ulama memaafkan hal yang memang sulit dihilangkan — kewajibannya adalah menghilangkan zatnya, bukan menjamin warna yang benar-benar bersih tanpa noda.",
      "Sebagian keadaan memiliki rincian tersendiri yang telah dikenal, seperti air kencing bayi laki-laki yang masih menyusu (cukup dipercikkan, bukan dicuci penuh, menurut sebuah keringanan yang diriwayatkan) — maka pelajarilah hukum praktis mazhabmu untuk keadaan yang benar-benar kau hadapi.",
    ],
    hadith: [
      {
        excerpt:
          "Mengenai darah haid pada pakaian: keriklah, lalu gosok dengan air, lalu cuci, dan salatlah dengan mengenakannya. (Asma binti Abu Bakar)",
      },
    ],
    actions: [
      "Sediakan setidaknya satu setel pakaian bersih khusus untuk salat.",
      "Jika najis mengenai pakaianmu saat di luar rumah, bilas bagian yang bisa dan gantilah begitu ada kesempatan.",
    ],
  },
  {
    title: "Membersihkan Badan",
    summary: "Menghilangkan najis dari badan, serta adab istinja dan kebersihan diri.",
    body: [
      "Najis pada badan harus dicuci sebelum salat, sesuai kemampuan. Kasus yang paling sering terjadi adalah membersihkan diri setelah buang air — istinja — yang dilakukan dengan air, atau dengan benda kering yang sesuai, sampai bagian itu bersih. Nabi ﷺ mengajarkan pembersihan yang cermat setelah buang air dan melarang penggunaan tangan kanan untuk itu.",
      "Selain menghilangkan najis, Islam juga mendorong tingkat kebersihan alami dasar (fitrah) yang menjaga badan tetap bersih dan siap untuk beribadah: memotong kuku secara teratur, mencukur bulu ketiak dan kemaluan, dan hal-hal semacamnya.",
      "Kebiasaan-kebiasaan ini bukan sekadar tata krama budaya — ia adalah bagian dari martabat dan kebersihan seorang mukmin ketika menghadap Allah dalam salat.",
    ],
    hadith: [
      {
        excerpt: "Nabi ﷺ biasa membersihkan diri dengan air setelah buang air. (Anas)",
      },
    ],
    actions: [
      "Selalu selesaikan istinja sebelum berwudu setelah buang air.",
      "Bawa tisu, dan bila memungkinkan, sediakan air ketika bepergian.",
    ],
  },
  {
    title: "Membersihkan Tempat Salat",
    summary:
      "Tempat salat harus bebas dari najis yang diketahui — tanpa keraguan yang tidak berdasar.",
    body: [
      "Tempat salat harus bebas dari najis yang diketahui. Nabi ﷺ mengajarkan hal ini dengan sangat jelas: ketika seorang badui kencing di sudut masjid, beliau mencegah para sahabat menegurnya dengan kasar, membiarkannya menyelesaikan hajatnya, lalu memerintahkan agar seember air disiramkan pada tempat itu — mengajarkan kebersihan sekaligus kelembutan.",
      "Kaidah pokoknya adalah keyakinan. Bumi pada dasarnya dijadikan tempat salat, sehingga suatu permukaan dianggap suci kecuali kau memiliki bukti nyata adanya najis. Jika kau tahu ada najis, hilangkan atau pindahlah ke tempat yang bersih; jika kau hanya membayangkan mungkin ada najis, abaikan bisikan itu dan lanjutkan.",
      "Keseimbangan ini menjaga ibadah dari dua sisi ekstrem: salat dengan sembarangan di tanah yang jelas kotor, dan menjadi lumpuh oleh kecurigaan tanpa dasar terhadap setiap permukaan.",
    ],
    hadith: [
      {
        excerpt:
          "Ketika seorang badui kencing di masjid, Nabi ﷺ memerintahkan agar seember air disiramkan ke tempat itu. (Abu Hurairah)",
      },
    ],
    actions: [
      "Periksa sekilas sajadah dan lantaimu sebelum salat.",
      "Tanpa bukti nyata adanya najis, abaikan kekhawatiran yang tidak berdasar dan lanjutkan salat.",
    ],
  },
  {
    title: "Haid dan Kesucian",
    summary: "Haid dan nifas memiliki hukum bersuci tersendiri.",
    body: [
      "Selama haid dan nifas, seorang wanita tidak melaksanakan salat, dan — sebagai rahmat dari agama ini — salat yang terlewat pada masa itu tidak perlu diqada kemudian. Ini sudah ditetapkan: ketika Aisyah ditanya mengapa wanita haid mengqada puasanya tetapi tidak mengqada salatnya, ia menegaskan bahwa memang begitulah yang diperintahkan kepada mereka.",
      "Puasa berbeda: puasa yang terlewat di bulan Ramadan karena haid diqada kemudian, sementara salatnya cukup digugurkan begitu saja. Ketika darah berhenti dan tanda kesucian muncul, wanita itu mandi wajib dan melanjutkan kembali salat serta puasanya.",
      "Batas minimal dan maksimal masa haid dan nifas, serta cara membaca tanda-tanda kesucian yang ambigu, adalah perkara-perkara yang berbeda rinciannya antar mazhab. Para wanita akan lebih terbantu dengan mempelajari hukum praktis dari satu mazhab yang terpercaya bersama seorang guru yang berkompeten.",
    ],
    hadith: [
      {
        excerpt:
          "Ketika ditanya mengapa wanita haid mengqada puasa tetapi tidak mengqada salat, Aisyah berkata: kami diperintahkan mengqada puasa dan tidak diperintahkan mengqada salat. (Mu'adzah, dari Aisyah; juga Sahih Muslim 335)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Pertanyaan yang Sering Diajukan",
    summary: "Jawaban singkat untuk keraguan dan kekhawatiran seputar bersuci yang paling umum.",
    body: [
      "Apakah keraguan membatalkan wuduku? Tidak. Jika kau yakin telah berwudu dan hanya ragu apakah wudu itu batal, wudumu tetap sah sampai kau yakin ada hal yang membatalkannya. Bertindak berdasarkan keyakinan, bukan kecurigaan, adalah prinsip Nabi yang melindungimu dari waswas.",
      "Bagaimana dengan gips, perban, dan luka? Ada keringanan untuk itu. Ketika mencuci anggota tubuh yang tertutup akan membahayakan, kau boleh mengusap balutannya sebagai gantinya, dan tayamum menutupi bagian yang tidak dapat dijangkau — rinciannya berbeda menurut mazhab dan keadaan.",
      "Bagaimana jika aku sama sekali tidak bisa menggunakan air? Tayamum dengan tanah bersih tetap sepenuhnya sah sampai kemampuan menggunakan air kembali.",
      "Bagaimana dengan kondisi kronis — pendarahan terus-menerus (istihadah) atau inkontinensia? Orang tersebut diperlakukan sebagai orang yang memiliki uzur tetap: ia membersihkan diri dan berwudu untuk setiap waktu salat, lalu tetap salat meskipun cairan itu terus keluar, dan hal itu tidak membatalkan salatnya.",
    ],
    actions: [
      "Jangan biarkan keraguan yang terus-menerus menghalangi ibadahmu — ikuti keyakinan, bukan kecurigaan.",
      "Untuk kondisi kronis atau kasus yang rumit, mintalah fatwa pribadi dari seorang ulama yang berkompeten.",
    ],
    appLinks: [{}, {}],
    disclaimer:
      "Jawaban tanya-jawab ini adalah ringkasan edukatif, bukan fatwa pribadi. Kasus yang rumit atau kronis sebaiknya ditinjau bersama ulama setempat.",
  },
  {
    title: "Referensi dan Kajian Lanjutan",
    summary: "Ayat-ayat Al-Qur'an dan bab-bab hadis pokok tentang bersuci.",
    body: [
      "Teks Al-Qur'an pokok tentang bersuci adalah ayat wudu, Surah Al-Ma'idah 5:6, yang menjelaskan wudu, mandi wajib, dan tayamum sekaligus; di sampingnya, 2:222 ('Allah menyukai orang-orang yang menyucikan diri') dan ayat-ayat tentang kesucian air (25:48) menjadi landasan topik ini.",
      "Dalam sunnah, sumber utamanya adalah Kitab-Kitab Bersuci (Kitab at-Taharah / al-Wudu / al-Ghusl / al-Haid) yang membuka Sahih al-Bukhari dan Sahih Muslim, diikuti oleh bab-bab yang sama dalam keempat kitab Sunan (Abu Dawud, at-Tirmidzi, an-Nasa'i, Ibnu Majah), yang menghimpun hukum-hukum yang lebih rinci beserta penilaian derajatnya.",
      "Untuk hukum-hukum praktis, kitab-kitab fikih klasik dari keempat mazhab Sunni memberikan pendapat yang rinci — dan perbedaan di antara mereka adalah bagian yang sah dari tradisi ini, bukan sebuah cacat. Gunakan modul ini sebagai gambaran umum yang terstruktur, lalu perdalam kajianmu bersama seorang guru yang berkompeten dan teks-teks aslinya.",
    ],
    hadith: [
      {
        excerpt:
          "Bab-bab komprehensif tentang wudu, mandi wajib, tayamum, dan haid yang membuka kitab ini.",
      },
      {
        excerpt: "Kitab Bersuci — riwayat sahih tentang hukum, adab, dan prinsip taharah.",
      },
    ],
    actions: [
      "Ikuti satu kurikulum terpercaya untuk menghindari kebingungan akibat hukum yang berserakan.",
      "Ulangi topik-topik ini secara berkala sampai keyakinan praktismu benar-benar mantap.",
    ],
    appLinks: [{}, {}],
  },
];
