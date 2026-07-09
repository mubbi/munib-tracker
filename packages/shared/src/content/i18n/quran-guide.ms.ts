// Malay translation overlay for the Learn Qur'an content. Mirrors the order of QURAN_GUIDE_TOPICS in ../quran-guide.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type {
  QuranGuideApplyChallenge,
  QuranGuideDailyLesson,
  QuranGuideLetter,
  QuranGuideMemorizationPlan,
  QuranGuidePronunciationPair,
  QuranGuideQuizQuestion,
  QuranGuideReadingLevel,
  QuranGuideStory,
  QuranGuideStructureLevel,
  QuranGuideTadabburPrompt,
  QuranGuideTajweedLesson,
  QuranGuideTheme,
  QuranGuideTimelineEvent,
  QuranGuideTopic,
  QuranGuideVocabEntry,
} from "../../types/quran-guide";
import type { DeepPartial } from "./localize";

export const QURAN_GUIDE_TOPICS_MS: DeepPartial<QuranGuideTopic>[] = [
  {
    title: "Pengantar",
    summary: "Apa itu Al-Qur'an, mengapa diturunkan, dan keutamaan membacanya.",
    body: [
      "Kata \"Qur'an\" berasal dari akar kata Arab qara'a, yang berarti membaca atau melafalkan dengan suara — jadi Kitab ini membawa tujuannya dalam namanya sendiri: ia dimaksudkan untuk dibaca, berulang kali, di lisan dan di hati. Menurut keyakinan Ahlus Sunnah, Al-Qur'an adalah kalam Allah yang sesungguhnya, tidak diciptakan, diturunkan dalam bahasa Arab yang jelas kepada Nabi Muhammad ﷺ melalui malaikat Jibril selama kurang lebih 23 tahun, mulai dari wahyu pertama di Gua Hira hingga tak lama sebelum wafatnya Nabi ﷺ.",
      'Ia adalah kitab suci terakhir yang diturunkan kepada umat manusia, membenarkan kebenaran wahyu-wahyu sebelumnya yang diberikan kepada Musa, Dawud, dan Isa (semoga shalawat tercurah atas mereka) serta menyempurnakan risalah yang mereka bawa. Allah menjelaskan tujuannya dengan gamblang: ia diturunkan "sebagai petunjuk bagi manusia" — untuk membawa manusia keluar dari kegelapan kebingungan dan kemusyrikan menuju cahaya tauhid, ibadah yang ikhlas hanya kepada Allah, akhlak yang lurus, dan persiapan yang serius menghadapi kehidupan akhirat. Setiap nabi menyerukan inti ajaran yang sama; Al-Qur\\\'an adalah bentuk terakhirnya yang terjaga.',
      "Membaca Al-Qur'an itu sendiri adalah ibadah, bukan sekadar membaca informasi. Nabi ﷺ mengajarkan bahwa setiap huruf yang dibaca mendatangkan satu kebaikan, dan setiap kebaikan dilipatgandakan minimal sepuluh kali — jadi bahkan seorang pemula yang mengeja satu baris pun sudah mengumpulkan pahala. Pada Hari Kebangkitan, Al-Qur'an akan datang sebagai pemberi syafaat, membela mereka yang menjaganya selama hidup di dunia. Orang yang membacanya dengan lancar bersama para malaikat penulis yang mulia, dan orang yang tersendat-sendat membacanya, dengan susah payah belajar, mendapat pahala berlipat ganda atas usahanya.",
      "Penting untuk memahami apa yang bukan Al-Qur'an. Al-Qur'an adalah kalam Allah sendiri secara harfiah dalam bahasa Arab, tidak berubah sejak diturunkan. Hadis — ucapan, perbuatan, dan persetujuan diam Nabi ﷺ — berbeda: hadis menjelaskan dan mencontohkan Al-Qur'an tetapi merupakan ungkapan Nabi ﷺ sendiri, dijaga melalui rantai perawi yang disebutkan namanya dan dinilai oleh para ulama sebagai sahih, hasan, atau da'if (lemah). Keduanya adalah wahyu dan keduanya wajib diikuti, tetapi hanya Al-Qur'an yang dibaca sebagai ibadah dalam shalat, dan hanya Al-Qur'an yang merupakan kalam Allah yang mukjizat dan tak tertandingi.",
    ],
    quran: [
      {
        excerpt:
          "Bulan Ramadhan adalah bulan yang di dalamnya diturunkan Al-Qur'an sebagai petunjuk bagi manusia…",
      },
      {
        excerpt:
          "Katakanlah: Sekiranya manusia dan jin berkumpul untuk membuat yang serupa Al-Qur'an ini, mereka tidak akan dapat membuat yang serupa dengannya…",
      },
    ],
    hadith: [
      {
        excerpt:
          "Barang siapa membaca satu huruf dari Kitab Allah, ia mendapat satu kebaikan, dan kebaikan itu dilipatgandakan sepuluh kali.",
      },
      {
        excerpt:
          "Bacalah Al-Qur'an, karena ia akan datang pada Hari Kebangkitan sebagai pemberi syafaat bagi para pembacanya.",
      },
      {
        excerpt:
          "Orang yang mahir membaca Al-Qur'an bersama para malaikat penulis yang mulia lagi berbakti, dan orang yang membacanya dengan tersendat-sendat serta merasa berat, baginya pahala berlipat ganda.",
      },
    ],
    actions: [
      "Tetapkan waktu tetap setiap hari untuk Al-Qur'an — bahkan lima menit yang fokus membangun keberkahan dan konsistensi.",
      "Baca minimal satu baris beserta maknanya: baca ayat Arabnya, lalu baca terjemahannya perlahan.",
      "Buka pembaca Al-Qur'an Munib dan lanjutkan tepat dari tempat kamu berhenti.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Bagaimana Al-Qur'an diturunkan",
    summary: "Gua Hira, Jibril, periode Makkah dan Madinah, kodifikasi, dan penjagaan.",
    body: [
      'Wahyu dimulai pada bulan Ramadhan, ketika Nabi ﷺ berusia empat puluh tahun dan sedang menyendiri di Gua Hira di sebuah gunung di luar Makkah untuk merenung. Di sana malaikat Jibril datang kepadanya dan memerintahkan, "Bacalah!" Nabi ﷺ, yang tidak bisa membaca atau menulis, menjawab bahwa ia tidak bisa — hingga malaikat itu mendekapnya dan menyampaikan lima ayat pertama Surah Al-Alaq: "Bacalah dengan (menyebut) nama Tuhanmu yang menciptakan." Terguncang, ia pulang menemui istrinya Khadijah, yang menenangkannya dan membawanya kepada kerabatnya, Waraqah bin Naufal, seorang yang berilmu yang mengenali malaikat wahyu dan membenarkan bahwa ini adalah utusan yang sama yang datang kepada Musa.',
      "Kemudian terjadi jeda singkat dalam wahyu (fatrah), masa sunyi yang membuat Nabi ﷺ merindukan wahyu lebih lanjut; lalu wahyu berlanjut kembali secara bertahap sepanjang sisa hidupnya. Wahyu tidak turun sekaligus, melainkan diturunkan sebagai respons atas peristiwa, pertanyaan, dan kebutuhan komunitas yang terus berkembang — metode bertahap yang Allah gambarkan sebagai peneguh hati Nabi ﷺ dan mempermudah Kitab ini meresap ke dalam kehidupan manusia.",
      "Periode Makkah berlangsung sekitar tiga belas tahun. Surah-surahnya seringkali pendek, berirama, dan penuh kekuatan; surah-surah itu menegaskan pokok-pokok dasar — keesaan Allah, kepastian kebangkitan dan pertanggungjawaban, kisah para nabi terdahulu yang didustakan lalu dibela, serta seruan menyeluruh untuk perbaikan moral dalam masyarakat yang tenggelam dalam kemusyrikan dan ketidakadilan.",
      "Setelah hijrah ke Madinah pada tahun 622 M, kaum muslimin tidak lagi menjadi kelompok kecil yang teraniaya, melainkan komunitas yang sedang membangun masyarakat. Wahyu Madinah umumnya lebih panjang dan lebih rinci, meletakkan hukum dan tatanan sosial yang dibutuhkan umat yang baru ini: rincian shalat, zakat, puasa, warisan, pernikahan dan perceraian, perjanjian, peperangan, dan perdamaian, disertai kata-kata tegas bagi kaum munafik yang merongrong komunitas dari dalam.",
      "Penjagaan teks dimulai sejak masa hidup Nabi ﷺ sendiri. Para sahabat menghafal wahyu begitu ia turun, dan para penulis mencatatnya di atas kulit, pelepah kurma, tulang, dan batu di bawah pengawasan langsung Nabi ﷺ. Setelah banyak penghafal gugur syahid dalam Perang Yamamah, Abu Bakar memerintahkan Zaid bin Tsabit untuk mengumpulkan Al-Qur'an yang tertulis menjadi satu kumpulan (suhuf). Kemudian, seiring meluasnya kekuasaan Islam dan beragamnya dialek, Utsman memerintahkan pembuatan salinan resmi dalam dialek Quraisy dan mengirimkannya ke kota-kota besar, menyatukan satu teks tertulis bagi seluruh umat.",
      "Allah sendiri menjamin penjagaan Al-Qur'an: \"Sesungguhnya Kamilah yang menurunkan Adz-Dzikr (Al-Qur'an), dan sesungguhnya Kami benar-benar memeliharanya.\" Janji itu terpenuhi melalui tiga jaminan yang saling terkait — hafalan massal di setiap generasi, transmisi tertulis yang cermat, dan rantai bacaan (qira'at) guru-ke-murid yang tak terputus hingga kembali ke Nabi ﷺ. Bagi orang beriman ini adalah tanda keagamaan; bagi sejarawan ini adalah fakta yang terdokumentasi: Al-Qur'an yang dibaca hari ini adalah teks yang sama yang diturunkan empat belas abad lalu.",
    ],
    quran: [
      {
        excerpt:
          "Sesungguhnya Kamilah yang menurunkan Adz-Dzikr (Al-Qur'an), dan sesungguhnya Kami benar-benar memeliharanya.",
      },
      {
        excerpt: "Bacalah dengan (menyebut) nama Tuhanmu yang menciptakan…",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Struktur Al-Qur'an",
    summary: "114 surah, 30 juz, ayat, Makki/Madani, dan urutan vs turunnya wahyu.",
    body: [
      "Mushaf — salinan fisik Al-Qur'an — memuat 114 surah (bab), masing-masing dengan namanya sendiri, biasanya diambil dari kata yang menonjol di dalamnya. Surah-surah itu disusun sebagian besar dari yang terpanjang ke yang terpendek, meski tidak selalu ketat: Al-Fatihah, surah pembuka yang pendek, datang pertama sebagai gerbang Kitab, diikuti Al-Baqarah yang panjang. Susunan ini bersifat tawqifi — urutannya diajarkan kepada Nabi ﷺ oleh Jibril dan bukan urutan turunnya ayat-ayat. Jadi urutan yang kamu baca dalam mushaf itu disengaja dan ditetapkan secara ilahi, bukan kronologis.",
      "Setiap surah digolongkan sebagai Makki (diturunkan sebelum Hijrah) atau Madani (diturunkan sesudahnya), dan beberapa surah memuat ayat dari keduanya. Sebagai patokan umum, surah Makki berfokus pada akidah — tauhid, kebangkitan, dan kisah para nabi — dalam bagian-bagian yang lebih pendek dan mendesak, sementara surah Madani menambahkan perundangan rinci dan bimbingan komunitas yang dibutuhkan masyarakat yang sudah menetap. Mengetahui mana yang mana membantu kamu membaca sebuah surah dalam konteks yang tepat.",
      "Untuk memudahkan bacaan, Al-Qur'an juga dibagi menjadi 30 bagian sama besar yang disebut juz, dan setiap juz dibagi lagi menjadi dua bagian yang disebut hizb, sehingga totalnya 60 hizb. Inilah yang membuat khatam Ramadhan — menyelesaikan seluruh Al-Qur'an dalam sebulan — terasa begitu alami: satu juz sehari menyelesaikan Kitab dalam tiga puluh hari, dan setengah juz dua kali sehari lebih ringan lagi. Di dalam setiap surah, ayat-ayat diberi nomor sehingga bagian mana pun bisa dirujuk secara tepat sebagai surah:ayat; hitungan standar Madinah adalah 6.236 ayat, dengan hanya sedikit perbedaan yang terdokumentasi dengan baik dalam cara beberapa batas ayat dihitung — teksnya sendiri identik.",
      "Memahami struktur ini mengubah niat yang samar menjadi rencana yang konkret. Kamu bisa berkomitmen pada porsi harian yang tetap, menargetkan Juz Amma (juz terakhir, ketiga puluh, penuh surah pendek) untuk dihafal, mengikuti satu tema seperti kesabaran di beberapa surah, atau menjadwalkan khatam lengkap seputar Ramadhan. Struktur adalah kerangka yang membuat hubungan seumur hidup dengan Al-Qur'an bisa dicapai.",
    ],
    quran: [
      {
        excerpt:
          "…sebuah Kitab yang ayat-ayatnya dijelaskan secara terperinci, Al-Qur'an dalam bahasa Arab untuk kaum yang mengetahui.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Belajar membaca",
    summary: "Tujuh tingkatan dari alfabet hingga bacaan lancar — untuk pemula mutlak.",
    body: [
      "Hampir setiap muslim mendambakan bisa membaca Al-Qur'an dalam bahasa Arab aslinya, dan ini adalah tujuan yang sepenuhnya bisa dicapai di usia berapa pun — tak terhitung orang dewasa yang sebelumnya tidak mengenal bahasa Arab berhasil belajar membaca dengan lancar. Memahami terjemahan itu berharga, tetapi membaca kata-kata Arab yang sesungguhnya itu sendiri adalah ibadah, dan layak diperjuangkan. Jalan ini membimbingmu selangkah demi selangkah dari tidak mengenali satu huruf pun hingga membaca ayat dengan pelafalan yang benar.",
      'Perjalanan ini melalui tujuh tahap alami. Tingkat 1 dan 2 membangun pengenalan huruf — pertama 28 huruf dalam bentuk tersendirinya, lalu bagaimana bentuknya berubah di awal, tengah, dan akhir kata. Tingkat 3 memperkenalkan harakat, tanda-tanda kecil (fathah, kasrah, dhammah, sukun, tasydid, tanwin) yang menunjukkan vokal yang dibawa setiap huruf. Tingkat 4 dan 5 adalah titik semuanya mulai tersambung: kamu menggabungkan huruf menjadi suku kata dan mengeja seluruh kata, termasuk aturan huruf syamsiyah dan qamariyah untuk kata sandang "al-". Tingkat 6 dan 7 beralih ke ayat-ayat pendek lalu ke bacaan yang halus dan lancar dengan kaidah dasar tajwid diterapkan.',
      "Dua kebiasaan mempercepat segalanya. Pertama, dengarkan terus-menerus qari yang mumpuni dan tirukan persis — Al-Qur'an diwariskan dari telinga ke telinga, mulut ke mulut, jadi telingamu adalah gurumu yang terbaik; tirukan iramanya, panjang vokalnya, dan bentuk setiap bunyinya. Kedua, jiplak dan tulis huruf-hurufnya, di kertas atau layar, karena tangan memperkuat apa yang sedang dipelajari mata dan lisan.",
      "Satu peringatan: aplikasi dan rekaman adalah pendukung yang sangat baik, tetapi tidak bisa mengoreksimu sebagaimana seseorang bisa. Nabi ﷺ belajar Al-Qur'an langsung dari Jibril dan mengajarkannya secara tatap muka kepada para sahabat, dan rantai koreksi yang hidup itulah cara bacaan yang akurat selalu terjaga. Carilah guru setempat atau program tajwid daring yang terstruktur untuk mendengarkan bacaanmu dan membetulkan kesalahan yang tidak bisa kamu dengar sendiri.",
    ],
    actions: [
      "Pelajari satu huruf sehari di bagian huruf Arab — lihat, dengar, ucapkan, tulis.",
      "Dengarkan Surah Al-Fatihah berulang-ulang sambil mengikuti kata-katanya di mushaf.",
      "Carilah guru — setempat atau daring — untuk mendengarkan bacaanmu dan membetulkannya setiap minggu.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Tajwid",
    summary: "Kaidah bacaan yang indah dan benar — nun sukun, mad, waqaf, dan lainnya.",
    body: [
      "Tajwid berasal dari akar kata yang berarti membuat sesuatu menjadi unggul atau indah. Sebagai ilmu, tajwid berarti memberikan hak setiap huruf — makhrajnya yang tepat di mulut atau tenggorokan, sifat bawaannya, dan waktu yang tepat untuk vokal dan jeda. Singkatnya, tajwid adalah seni membaca Al-Qur'an persis seperti saat ia diturunkan.",
      "Ini penting karena Al-Qur'an bukan sekadar teks biasa yang dibaca sembarangan. Ia turun dengan tajwid yang sudah melekat: Jibril membacakannya kepada Nabi ﷺ dengan pelafalan yang presisi, Nabi ﷺ membacakannya dengan cara yang sama kepada para sahabat, dan mereka mewariskannya tanpa terputus kepada kita. Salah mengucapkan satu huruf bukan perkara kecil — salah melafalkan satu huruf bisa mengubah seluruh makna kata (misalnya mencampuradukkan ص yang tebal dengan س yang biasa, atau huruf tenggorokan ع dan ح), dan di beberapa tempat itu mengubah makna kalam Allah. Ilmu tajwid ada tepat untuk menjaga dari hal itu.",
      "Kamu tidak perlu menguasai semuanya sekaligus. Kaidah-kaidah inti dipelajari secara berurutan: hukum nun sukun dan tanwin (izhar, idgham, iqlab, ikhfa), hukum mim sukun, berbagai jenis mad (pemanjangan), qalqalah (pantulan ringan pada huruf tertentu), ghunnah (dengung hidung), dan waqaf (di mana dan bagaimana berhenti). Masing-masing punya definisi yang jelas, contoh sehari-hari, dan latihan, dan hub ini membahasnya satu per satu.",
      "Satu patokan yang tegas: pelajari tajwid dengan mendengar langsung dari guru yang mumpuni, bukan hanya dari buku atau aplikasi. Bacalah di hadapan seseorang yang bisa mendengar kesalahanmu dan membetulkannya — begitulah tajwid selalu diajarkan, dan itulah satu-satunya jalan yang bisa diandalkan menuju ketepatan yang sesungguhnya dan, pada akhirnya, ijazah (rantai bacaan yang bersanad).",
    ],
    hadith: [
      {
        excerpt: "Sebaik-baik kalian adalah yang belajar Al-Qur'an dan mengajarkannya.",
      },
      {
        excerpt:
          "Orang yang mahir membaca Al-Qur'an bersama para malaikat penulis yang mulia lagi berbakti, dan orang yang membacanya dengan tersendat-sendat serta merasa berat, baginya pahala berlipat ganda.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Huruf Arab",
    summary: "Alfabet interaktif — nama, bunyi, dan contoh untuk masing-masing dari 28 huruf.",
    body: [
      "Alfabet Arab memiliki 28 huruf, ditulis dan dibaca dari kanan ke kiri. Berbeda dengan bahasa Inggris, sebagian besar huruf tersambung dengan huruf di sebelahnya, sehingga satu huruf bisa memiliki bentuk yang sedikit berbeda tergantung apakah ia berdiri sendiri atau berada di awal, tengah, atau akhir kata. Belajar mengenali huruf yang sama dalam bentuk-bentuknya yang berbeda adalah salah satu terobosan pertama yang nyata.",
      'Bahasa Arab Al-Qur\\\'an menambahkan beberapa fitur ekstra di atas huruf dasar: hamzah (bunyi glotal berhenti), huruf vokal panjang alif, wau, dan ya yang memanjangkan bunyi, serta aturan huruf syamsiyah dan qamariyah yang menentukan apakah "l" pada kata sandang "al-" dilafalkan atau melebur diam ke huruf berikutnya. Semua ini sederhana begitu kamu menemuinya dalam kata-kata yang sesungguhnya.',
      "Setiap kartu huruf di bagian ini memberimu bentuk tersendiri huruf itu, namanya, transliterasi, tips pelafalan praktis, dan contoh-contoh Al-Qur'an yang nyata sehingga kamu belajar bunyinya dalam konteks, bukan secara abstrak. Rutinitas yang paling efektif adalah lingkaran empat langkah untuk setiap huruf: lihat, dengar bacaannya, ucapkan sendiri dengan keras, lalu tulis.",
      "Kaitkan setiap huruf baru dengan kata-kata yang mungkin sudah kamu kenal — Allah, Rabb (Tuhan), ar-Rahman (Yang Maha Pengasih), Bismillah. Menghubungkan bentuk yang asing dengan makna yang akrab membuatnya melekat jauh lebih cepat daripada menghafal huruf secara terpisah.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Pelafalan",
    summary: "Kuasai huruf-huruf sulit — ain, ha, shad, dhad, qaf, dan huruf tebal.",
    body: [
      "Bahasa Arab memiliki beberapa bunyi yang tidak memiliki padanan persis dalam bahasa Indonesia, dan di sinilah penutur non-asli paling sering keliru. Kekeliruan paling umum adalah antara huruf-huruf yang terdengar mirip bagi telinga yang belum terlatih tetapi dilafalkan dari titik yang berbeda di mulut atau tenggorokan — dan mencampuradukkannya bisa mengubah makna sebuah kata, itulah sebabnya huruf-huruf ini layak mendapat latihan khusus.",
      'Huruf-huruf tebal (mufakhkham) — shad (ص), dhad (ض), tha (ط), dan zha (ظ) — adalah versi "berat" dari huruf yang lebih ringan. Untuk melafalkannya, kamu mengangkat bagian belakang lidah dan mengisi mulut dengan bunyi yang lebih penuh dan dalam, sesuatu yang diserap penutur asli sejak kecil tetapi harus dibangun secara sadar oleh pembelajar. Bandingkan setiap huruf tebal langsung dengan pasangan ringannya: sin dibanding shad, dal dibanding dhad, ta dibanding tha, dzal dibanding zha.',
      'Huruf-huruf tenggorokan adalah rintangan besar lainnya. Ain (ع) adalah penyempitan bersuara dari tengah tenggorokan, dan ha (ح) adalah gesekan kuat dan berhembus — keduanya tidak ada dalam bahasa Indonesia, dan tidak ada penjelasan tertulis yang bisa sepenuhnya menggantikan mendengarnya langsung. Qaf (ق) adalah "k" yang dalam dari bagian paling belakang lidah, berbeda dari kaf (ك) yang lebih ke depan.',
      "Metode yang bisa diandalkan adalah membandingkan pasangan huruf berdampingan, lalu menguji dirimu terhadap bacaan murattal yang perlahan dan jelas. Rekam suaramu sendiri membaca satu kata pendek, putar bersamaan dengan bacaan qari, dan sesuaikan. Lebih baik lagi, perdengarkan kepada guru yang mumpuni — beberapa kesalahan hampir mustahil ditangkap dalam rekaman sendiri.",
    ],
    appLinks: [{}],
  },
  {
    title: "Kosakata Al-Qur'an",
    summary: "Kata-kata berfrekuensi tinggi — pahami lebih banyak setiap kali membaca.",
    body: [
      "Ini adalah fakta yang menggembirakan: sekumpulan kata berfrekuensi tinggi yang relatif kecil — sekitar beberapa ratus — mencakup porsi yang sangat besar dari keseluruhan teks Al-Qur'an, karena kata-kata kunci yang sama muncul berulang kali. Mempelajari kosakata inti itu adalah langkah paling berdampak yang bisa kamu ambil, karena ia mengubah bacaan dari sekadar aliran bunyi menjadi kata-kata yang maknanya benar-benar kamu tangkap saat membaca.",
      "Kamu tidak menerjemahkan Al-Qur'an kata demi kata dengan cara ini — itu adalah pekerjaan tafsir dan terjemahan — tetapi kamu mulai mengenali nama-nama Allah, perintah, janji, dan peringatan secara langsung, pada saat membaca. Mulailah dengan kata-kata yang paling sering muncul dan paling berbobot: Allah, Rabb (Tuhan), rahmah (kasih sayang), iman (keyakinan), sabr (kesabaran), taqwa (kesadaran akan Allah), dunya (dunia ini), dan akhirah (kehidupan akhirat). Dari kumpulan inti itu, perluas sedikit demi sedikit.",
      "Gunakan pengulangan berjarak (spaced repetition), bukan sistem kebut semalam. Mempelajari lima kata baru seminggu dan mengulang semuanya setiap hari akan membawamu jauh lebih maju dalam setahun dibanding menghafal lima puluh kata dalam satu kali duduk lalu melupakannya. Allah berjanji bahwa Al-Qur'an telah dimudahkan untuk diambil pelajaran — dekati kosakatanya secara konsisten dan kamu akan merasakan kemudahan itu sendiri.",
    ],
    quran: [
      {
        excerpt:
          "Dan sesungguhnya telah Kami mudahkan Al-Qur'an untuk pelajaran, maka adakah orang yang mau mengambil pelajaran?",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Tafsir",
    summary: "Memahami wahyu — gambaran umum, konteks, dan sumber-sumber ilmiah yang diakui.",
    body: [
      "Tafsir berarti penjelasan dan penafsiran Al-Qur'an — menjelaskan apa makna sebuah ayat, mengapa ia diturunkan, dan bagaimana penerapannya. Karena ini adalah kalam Allah, para ulama menetapkan urutan otoritas yang ketat tentang bagaimana Al-Qur'an harus dijelaskan, dan tetap berada di dalamnya melindungimu dari kesalahan.",
      "Tafsir yang paling sahih adalah Al-Qur'an menafsirkan dirinya sendiri: sebuah ayat yang singkat di satu tempat seringkali dijelaskan lebih luas di tempat lain, jadi Al-Qur'an adalah penafsir terbaik bagi dirinya sendiri. Selanjutnya datang penjelasan melalui Sunnah, karena Nabi ﷺ diutus justru untuk menjelaskan wahyu, dan ucapan serta perbuatannya menunjukkan kepada kita bagaimana ia dihayati. Setelah itu datang pemahaman para sahabat, yang menyaksikan wahyu turun dan mengetahui konteksnya secara langsung, diikuti para ulama besar yang datang setelah mereka. Terakhir dan paling rendah adalah penafsiran melalui bahasa Arab itu sendiri. Yang sama sekali tidak memiliki tempat adalah pendapat pribadi yang tidak berdasar — membaca gagasan sendiri ke dalam teks.",
      'Alat kunci dalam tafsir adalah asbabun nuzul, sebab-sebab turunnya ayat: mengetahui peristiwa atau pertanyaan yang mendorong turunnya sebuah ayat seringkali membuka maknanya. Namun riwayat-riwayat ini sendiri harus diverifikasi keabsahannya, karena tidak setiap "sebab" yang diriwayatkan itu dapat diandalkan. Untuk setiap surah, tafsir yang baik memberimu latar sejarahnya bila sudah mapan, tema-tema utamanya, ayat-ayat pentingnya, dan pelajaran praktis untuk dibawa pulang.',
      "Di antara rujukan yang paling diakui dan dapat dipercaya adalah Tafsir Ibnu Katsir (komprehensif dan cermat mengutip hadis serta perkataan generasi awal), Tafsir As-Sa'di (jelas, kontemporer, dan berfokus pada bimbingan praktis), serta Tafsir Ath-Thabari klasik (ensiklopedis, melestarikan penafsiran-penafsiran paling awal). Setiap kali kamu mempelajari sebuah makna, catat dari sumber mana ia berasal. Hub ini mengajarkan metodologinya; gunakan pembaca Al-Qur'an Munib, yang menghubungkan tafsir bawaan dan tafsir daring, untuk kajian ayat demi ayat.",
    ],
    sources: [
      "Tafsir Ibnu Katsir — versi ringkas bahasa Inggris tersedia luas",
      "Tafsir As-Sa'di — ringkasan yang mudah dipahami",
      "Asbabun Nuzul karya Al-Wahidi — sebab-sebab turunnya ayat (verifikasi keabsahan tiap riwayat)",
    ],
    disclaimer:
      "Tafsir bervariasi kedalamannya. Ketika para ulama berbeda pendapat, catat perbedaannya tanpa mengklaim kepastian di tempat yang tidak dijelaskan Allah secara gamblang.",
    appLinks: [{}],
  },
  {
    title: "Tema-tema Al-Qur'an",
    summary:
      "Iman, shalat, kesabaran, sedekah, para nabi — ayat-ayat dikelompokkan berdasarkan topik.",
    body: [
      "Al-Qur'an tidak disusun seperti buku pelajaran, satu subjek per bab. Sebaliknya, tema-tema besarnya — keesaan Allah, shalat, kesabaran, sedekah, para nabi, akhirat, keadilan, keluarga — dianyam di seluruh isinya, muncul dan muncul kembali di banyak surah, setiap kali dari sudut yang segar. Apa yang tampak seperti pengulangan pada awalnya sebenarnya adalah penguatan: sebuah tema diperkenalkan, lalu diperdalam, lalu dihubungkan dengan tema lain, hingga keseluruhan pesan berdiri sebagai satu seruan yang koheren.",
      "Mengkaji Al-Qur'an berdasarkan tema mengungkap kesatuan itu. Ketika kamu mengumpulkan apa yang Al-Qur'an katakan tentang, misalnya, rasa syukur atau tawakal kepada Allah dari seluruh surahnya, ayat-ayat yang terpisah saling menerangi dan pelajarannya menjadi hidup dan utuh. Setiap entri tema di hub ini menghimpun ayat-ayat yang relevan, hadis sahih pendukung yang menambah kejelasan bila ada, pelajaran inti, dan tindakan konkret agar ilmu itu tidak sekadar teori.",
      "Yang terpenting, hubungkan tema-tema itu dengan kehidupanmu sendiri. Berbakti kepada orang tua, kejujuran dalam bisnis, keadilan dalam pernikahan, berdiri tegak untuk keadilan bahkan melawan kepentinganmu sendiri — ini bukan bab-bab abstrak untuk dikagumi, melainkan keputusan sehari-hari yang diminta Al-Qur'an untuk kamu buat. Baca setiap tema sebagai pertanyaan yang ditujukan langsung kepadamu: bagaimana ini mengubah apa yang kulakukan hari ini?",
    ],
    appLinks: [{}],
  },
  {
    title: "Kisah-kisah dalam Al-Qur'an",
    summary: "Para nabi dari Adam hingga Muhammad ﷺ — pelajaran, lokasi, dan ayat-ayat terkait.",
    body: [
      'Al-Qur\\\'an menceritakan kisah para nabi — Adam, Nuh, Ibrahim, Yusuf, Musa, Isa, dan banyak lainnya — dan menyatakan dengan jelas mengapa: "Sesungguhnya pada kisah-kisah mereka itu terdapat pelajaran bagi orang-orang yang mempunyai akal." Kisah-kisah ini bukan dongeng atau hiburan. Ini adalah pengajaran, dipilih dan diceritakan oleh Allah untuk mengajarkan keimanan, kesabaran, dan cara menghadapi ujian yang sama yang berulang di setiap zaman.',
      "Perhatikan pola yang berjalan di dalamnya. Para nabi menyeru kaumnya kepada penyembahan Allah semata; mereka diejek, ditentang, dan sering diusir; mereka bertahan dengan kesabaran dan tawakal penuh kepada Allah; dan pada akhirnya janji Allah terbukti benar. Ketika kamu membaca kesulitan mereka, ambillah kekuatan dari cara mereka menyikapinya — tanpa pernah membayangkan derajatmu setara dengan mereka. Intinya adalah menyerap keteguhan dan tawakal mereka, bukan membandingkan kedudukan.",
      'Al-Qur\\\'an sendiri menonjolkan satu kisah: Surah Yusuf, yang Allah sebut sebagai "kisah yang terbaik". Secara tidak biasa, kisah ini dituturkan dari awal hingga akhir dalam satu surah, jadi bacalah dalam satu kali duduk sebagai perjalanan yang berkesinambungan — pengkhianatan, kesabaran dalam perbudakan dan penjara, dan akhirnya pengampunan serta pertemuan kembali — dan saksikan bagaimana rencana Allah terungkap di balik bertahun-tahun kemalangan yang tampak.',
    ],
    quran: [
      {
        excerpt:
          "Sesungguhnya pada kisah-kisah mereka itu terdapat pengajaran bagi orang-orang yang mempunyai akal…",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Mukjizat Al-Qur'an",
    summary: "Keunikan bahasa, penjagaan, ramalan — dengan kehati-hatian ilmiah.",
    body: [
      "Mukjizat utama Al-Qur'an adalah Al-Qur'an itu sendiri. Diturunkan kepada seorang yang buta huruf di masa paling fasih dalam sejarah puisi Arab, ia mengeluarkan tantangan terbuka kepada para penentangnya yang paling gigih — para pakar bahasa — untuk membuat bahkan satu surah saja yang serupa dengannya. Empat belas abad kemudian, tantangan itu masih belum terjawab. Kekuatan retorikanya, strukturnya, cara tema-temanya saling terkait, dan keselarasan bimbingan serta hukumnya dikaji dalam ilmu balaghah klasik, dan semuanya tetap, menurut klaim Al-Qur'an sendiri, tak tertandingi.",
      "Penjagaannya adalah tanda kedua yang dapat diverifikasi. Teks ini terjaga baik secara tertulis, melalui naskah yang ditransmisikan dengan cermat, maupun secara lisan, melalui qira'at — rantai qari yang tak terputus yang menghafal dan mengajarkannya secara persis, generasi demi generasi. Ini adalah sejarah yang terdokumentasi, bukan spekulasi saleh, dan ini memenuhi janji Allah sendiri untuk menjaga Adz-Dzikr.",
      'Kamu juga akan mendengar tentang "mukjizat ilmiah" — ayat-ayat yang menyentuh tahapan embrio, perluasan alam semesta, dan sejenisnya. Sikapi ini dengan hati-hati. Tafsir klasik seringkali memahami ayat-ayat semacam itu dengan cara yang cukup berbeda dari para pembela modern, dan memaksa Al-Qur\'an untuk cocok dengan setiap hipotesis ilmiah yang berubah-ubah bisa menjadi bumerang ketika teori-teori itu berganti. Bedakan dengan tegas antara penafsiran yang mapan dan dugaan kontemporer.',
      "Ramalan-ramalan sejarah juga dikutip oleh para ulama — kemenangan bangsa Romawi yang diramalkan, pembukaan Makkah secara damai — dan itu layak dikaji, tetapi melalui tafsir dan sirah yang cermat, bukan klip video yang sensasional. Argumen terkuat bagi Al-Qur'an selalu adalah tauhidnya, transformasi moral suatu kaum, serta bahasa dan penjagaannya yang tak tertandingi.",
    ],
    quran: [
      {
        excerpt: "Maka buatlah satu surah semisalnya… jika kamu orang-orang yang benar.",
      },
    ],
    disclaimer:
      "Hindari klaim mukjizat ilmiah yang berlebihan yang bisa mempermalukan dakwah ketika diteliti secara cermat. Utamakan tauhid, moralitas, dan bukti-bukti bahasa serta sejarah Al-Qur'an.",
  },
  {
    title: "Menghafal Al-Qur'an",
    summary: "Rencana dari Juz Amma hingga hafalan penuh — muraja'ah, audio, target harian.",
    body: [
      "Menghafal Al-Qur\\'an (hifz) adalah salah satu upaya paling mulia dalam kehidupan seorang mukmin, dan ini bukan hanya untuk para ulama atau anak-anak — orang dewasa pun menyelesaikannya. Nabi ﷺ mengajarkan bahwa pada Hari Kebangkitan, orang yang membawa Al-Qur\\'an akan dikatakan kepadanya, \"Bacalah dan naiklah,\" naik derajat dengan setiap ayat. Mulailah dari tempat semua orang memulai: Surah Al-Fatihah, yang sudah kamu baca di setiap shalat, lalu surah-surah pendek di bagian paling akhir mushaf, bergerak mundur.",
      "Pelajaran terpenting dalam hifz itu berlawanan dengan intuisi: muraja'ah (pengulangan) lebih penting daripada menambah hafalan baru. Nabi ﷺ memperingatkan bahwa Al-Qur'an yang dihafal lepas lebih cepat daripada unta yang terikat lepas dari talinya — biarkan tanpa diulang dan ia akan hilang. Jadi aturannya sederhana dan tegas: jangan pernah menambah bagian baru sampai kamu benar-benar mengulang dengan kuat apa yang sudah kamu pegang. Sedikit yang dihafal dengan kuat mengalahkan banyak yang dihafal dengan lemah.",
      "Metode praktis: gunakan pengulangan berjarak, tetaplah pada satu qari agar melodinya sendiri memicu ingatanmu, baca dari hafalan setiap hari, bukan hanya membaca teks, dan mintalah guru mendengarkan serta menandai kesalahanmu — kesalahan yang tidak bisa kamu dengar sendiri. Pelacak hifz Munib mencatat kemajuan hingga ke ayat perorangan sehingga kamu selalu tahu apa yang perlu diulang.",
      "Pilih rencana yang sesuai dengan tahapmu. Pemula: hafalkan Juz Amma, bagian terakhir, penuh dengan surah pendek. Menengah: tambahkan sepuluh surah yang sering dibaca seperti Al-Mulk, Ya-Sin, dan Al-Kahfi. Lanjut: selesaikan satu juz penuh dengan pengulangan yang kuat atas semua yang sebelumnya. Dan perjalanan Hafiz: seluruh mushaf, dihafal bersama guru yang mumpuni dan, idealnya, sanad — rantai transmisi bersertifikat kembali ke Nabi ﷺ.",
    ],
    hadith: [
      {
        excerpt:
          "Akan dikatakan kepada sahabat Al-Qur'an: Bacalah dan naiklah sebagaimana engkau dahulu membaca di dunia, karena derajatmu berada pada ayat terakhir yang engkau baca.",
      },
      {
        excerpt:
          "Perumpamaan sahabat Al-Qur'an adalah seperti pemilik unta yang terikat: jika ia menjaganya, ia akan tetap memilikinya, dan jika ia melepaskannya, ia akan kehilangannya.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Pelajaran harian",
    summary: "Satu ayat, konteks, renungan, dan tindakan — setiap hari.",
    body: [
      "Kedekatan seumur hidup dengan Al-Qur'an dibangun dengan cara yang sama seperti kebiasaan mendalam lainnya dibangun — sedikit demi sedikit, setiap hari, tanpa putus. Nabi ﷺ mengajarkan bahwa amalan yang paling dicintai Allah adalah yang dilakukan secara konsisten, sekalipun kecil, dan prinsip itulah seluruh gagasan di balik pelajaran harian. Setiap pelajaran memberimu satu ayat dalam bahasa Arab, terjemahannya, catatan tentang konteks sejarahnya, pertanyaan renungan untuk direnungkan, dan satu tindakan konkret untuk dibawa ke dalam harimu.",
      "Perlakukan ayat-ayat ini sebagai bimbingan yang hidup, bukan bacaan yang berlalu begitu saja. Tandai yang menyentuh hatimu, kembalilah kepadanya, dan bagikan apa yang menggerakkanmu kepada keluargamu — ketika orang lain mengamalkan kebaikan yang kamu sampaikan, pahalanya sampai juga kepadamu, sehingga mengajarkan melipatgandakan manfaatnya.",
      "Jangan tertipu oleh ukurannya yang kecil. Konsistensi selalu mengalahkan intensitas: lima menit yang tulus bersama Al-Qur'an setiap hari akan mengubahmu jauh lebih banyak daripada satu jam yang langka dan heroik sebulan sekali. Hadirlah setiap hari, dan biarkan hari-hari itu terkumpul.",
    ],
    appLinks: [{}],
  },
  {
    title: "Perenungan (Tadabbur)",
    summary: "Pertanyaan terpandu — apa yang Allah ajarkan, dan bagaimana kamu akan menghayatinya?",
    body: [
      "Tadabbur berarti merenungkan Al-Qur\\'an secara mendalam, membolak-balik sebuah ayat dalam hati hingga ia menggerakkanmu untuk berubah. Ini adalah perintah langsung, bukan tambahan opsional: Allah bertanya, \"Maka tidakkah mereka menghayati Al-Qur\\'an, ataukah hati mereka terkunci?\" Tujuan membaca tidak pernah sekadar bunyi — ia dimaksudkan untuk mencapai hati dan membentuk ulang sebuah kehidupan.",
      "Tadabbur tidak sama dengan tafsir. Tafsir adalah penjelasan ilmiah tentang makna sebuah ayat; tadabbur adalah respons pribadimu yang penuh penghormatan terhadap makna itu setelah kamu memahaminya. Keduanya bekerja bersama: kamu terlebih dahulu mempelajari makna yang sahih dari tafsir, lalu kamu merenunginya dan bertanya bagaimana ia berbicara kepadamu. Kerangka yang membantu adalah tiga pertanyaan — Apa yang Allah ajarkan kepadaku di sini? Bagaimana ini mengubah apa yang kulakukan hari ini? Kebiasaan apa yang harus kubangun atau kutinggalkan karena ayat ini?",
      "Satu batasan tegas menjaga tadabbur tetap aman: renungkan apa yang diminta sebuah ayat darimu, tetapi jangan pernah mengarang makna baru untuk teks itu sendiri. Biarkan tafsir yang sahih menetapkan batas-batas penafsiran, dan simpan renunganmu sendiri di tempatnya — jurnal pribadi, seperti milik Munib, sangat ideal untuk menangkap apa yang digerakkan sebuah ayat dalam dirimu dan untuk kembali kepadanya nanti.",
    ],
    quran: [
      {
        excerpt: "Maka tidakkah mereka menghayati Al-Qur'an, ataukah hati mereka terkunci?",
      },
      {
        excerpt:
          "Maka tidakkah mereka menghayati Al-Qur'an? Sekiranya (Al-Qur'an) itu bukan dari sisi Allah, tentulah mereka mendapat banyak pertentangan di dalamnya.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Mengamalkan Al-Qur'an",
    summary: "Tantangan hari ini dari sebuah ayat — catat penyelesaian, hayati ayatnya.",
    body: [
      "Ilmu tentang Al-Qur\\'an dimaksudkan untuk menjadi amal. Allah mengkritik tajam orang-orang sebelum kita yang membaca Kitab namun hidup bertentangan dengannya: \"Mengapa kamu suruh orang lain (mengerjakan) kebaikan, sedangkan kamu melupakan diri (kewajiban)mu sendiri, padahal kamu membaca Al-Kitab?\" Al-Qur\\'an adalah perjanjian antara kamu dan Tuhanmu, dan setiap ayat diam-diam meminta sesuatu darimu — pertanyaannya adalah apakah kamu menjawabnya.",
      "Itulah tujuan tantangan-tantangan ini. Setiap tantangan menghubungkan satu ayat tertentu dengan satu perilaku yang bisa dilakukan hari ini: menjaga lisan dengan perkataan yang baik, memberi sedekah secara diam-diam, menundukkan pandangan dari yang diharamkan, melepaskan dendam yang selama ini kamu pendam. Satu ayat, satu tindakan — cukup kecil untuk benar-benar bisa dilakukan, cukup nyata untuk mengubahmu.",
      "Tandai sebuah tantangan selesai hanya ketika kamu benar-benar telah melakukannya. Tujuan pencatatan bukan pamer — itu justru akan mengalahkan maksudnya — melainkan pertanggungjawaban yang jujur kepada Allah, yang melihat apa yang tidak dilihat orang lain. Seiring waktu, ayat demi ayat, begitulah cara bacaan berubah menjadi karakter.",
    ],
    quran: [
      {
        excerpt:
          "Mengapa kamu suruh orang lain (mengerjakan) kebaikan, sedangkan kamu melupakan diri (kewajiban)mu sendiri, padahal kamu membaca Al-Kitab?",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Kuis Al-Qur'an",
    summary: "Ulas nama surah, struktur, tajwid, kosakata, dan kisah-kisah.",
    body: [
      "Menguji diri sendiri adalah salah satu cara paling efektif untuk membuat ilmu melekat — mengingat kembali sebuah jawaban memperkuat ingatan jauh lebih baik daripada sekadar membaca ulang. Kuis ini mengambil dari segala sesuatu di hub ini: jumlah surah dan juz, wahyu pertama dan bagaimana Al-Qur'an dijaga, kaidah tajwid seperti mad dan qalqalah, kosakata berfrekuensi tinggi, dan para nabi yang kisahnya diceritakan Al-Qur'an.",
      "Jagalah niat tetap lurus. Skor hanyalah cermin dari pembelajaranmu — ia bukan ukuran derajatmu di sisi Allah, yang hanya menjadi milik-Nya. Gunakan setiap pertanyaan untuk mengungkap sisi yang lemah, lalu kembali ke pelajaran yang sesuai dan pelajari tepat topik itu, bukan mengejar angka.",
      "Pertanyaan terakhir adalah renungan, bukan pertanyaan bernilai: pilih satu surah atau bagian untuk dipahami dan dihafal berikutnya, sehingga ulasanmu selalu berakhir dengan mengarahkanmu kembali ke Kitab itu sendiri.",
    ],
    appLinks: [{}],
  },
  {
    title: "Rujukan dan sumber",
    summary: "Bagaimana kami mengutip Al-Qur'an, hadis, tafsir, dan perbedaan pendapat ulama.",
    body: [
      "Ilmu Islam yang sahih dibangun di atas bukti yang transparan, jadi setiap pelajaran di hub ini berusaha menunjukkan sumbernya. Klaim tentang Al-Qur'an didukung dengan rujukan dalam bentuk surah:ayat; klaim dari Sunnah menyebutkan nama kumpulan hadis (Bukhari, Muslim, Tirmidzi, dan sebagainya), nomor hadis, dan derajatnya (sahih, hasan, atau lebih lemah); klaim tentang makna sebuah ayat menyebutkan tafsir dari mana ia berasal; dan di tempat para ulama benar-benar berbeda pendapat, perbedaan itu dicatat, bukan disembunyikan.",
      "Penting juga membedakan mana yang pasti dan mana yang bersifat penafsiran. Fakta yang mapan — shalat lima waktu, penjagaan Al-Qur'an, peristiwa-peristiwa utama sirah — dinyatakan secara gamblang. Perkara yang sejak lama diperselisihkan oleh para ulama yang tulus, seperti rincian halus eskatologi atau pembacaan isyarat ilmiah, disajikan sebagai penafsiran, bukan sebagai kepastian yang mapan. Keyakinan harus sepadan dengan kekuatan buktinya.",
      "Untuk kajian yang lebih dalam, bersandarlah pada rujukan yang mapan: terjemahan Al-Qur\\'an yang dapat dipercaya (seperti Sahih International atau Pickthall), kumpulan hadis utama (terutama Sahih Al-Bukhari dan Sahih Muslim), tafsir yang dihormati (Ibnu Katsir dan As-Sa\\'di), dan sirah yang tepercaya (karya klasik Ibnu Hisyam, dan Ar-Rahiq Al-Makhtum, \"Nektar yang Tersegel,\" untuk narasi modern).",
      "Terakhir, ketahuilah batas sebuah aplikasi. Munib mengedukasi dan mengarahkanmu ke sumber-sumber, tetapi tidak mengeluarkan fatwa agama. Untuk fikih bacaan, untuk ijazah tajwid, atau untuk pertanyaan apa pun yang memengaruhi ibadah atau keputusan hidupmu, konsultasikan dengan ulama yang mumpuni sesuai mazhab dan wilayahmu.",
    ],
    sources: [
      "Al-Qur'an — cetakan Kompleks Raja Fahd / mushaf digital yang telah diverifikasi",
      "Hadis — rujukan silang penilaian sunnah.com",
      "Tafsir Ibnu Katsir (ringkasan Darussalam)",
      "Tafsir As-Sa'di (bahasa Inggris)",
    ],
    disclaimer:
      "Munib menghimpun konten edukasi terbuka. Verifikasi perkara-perkara penting dengan ulama yang mumpuni sesuai mazhab dan wilayahmu.",
  },
];

export const QURAN_GUIDE_STRUCTURE_LEVELS_MS: DeepPartial<QuranGuideStructureLevel>[] = [
  {
    count: "1 Kitab",
    detail:
      "Satu Kitab — Kalamullah, kalam Allah yang sesungguhnya, diturunkan melalui malaikat Jibril kepada Muhammad ﷺ, dalam bahasa Arab yang jelas, secara bertahap selama kurang lebih 23 tahun. Ia adalah satu-satunya teks yang sama di seluruh dunia.",
  },
  {
    count: "114",
    detail:
      "Al-Qur'an terbagi menjadi 114 surah, mulai dari hanya tiga ayat hingga 286 ayat. Masing-masing punya nama, biasanya diambil dari kata kunci di dalamnya, dan digolongkan sebagai Makki atau Madani. Urutannya dalam mushaf ditetapkan (tawqifi) oleh wahyu dan berbeda dari urutan turunnya.",
  },
  {
    count: "30",
    detail:
      "Tiga puluh bagian yang kurang lebih sama besar, dibuat untuk memudahkan bacaan. Membaca satu juz setiap hari menyelesaikan seluruh Al-Qur'an dalam sebulan — cara klasik untuk khatam saat Ramadhan.",
  },
  {
    count: "60",
    detail:
      "Setiap juz terbagi menjadi dua hizb, sehingga totalnya 60, dan setiap hizb terbagi lagi menjadi seperempatan. Unit-unit kecil ini memudahkanmu menetapkan porsi harian yang ringan — setengah atau seperempat hizb — dan menjaga kebiasaan yang stabil.",
  },
  {
    count: "6.236",
    detail:
      "Ayat-ayat perorangan, diberi nomor sehingga bagian mana pun bisa dirujuk secara tepat sebagai surah:ayat. 6.236 adalah hitungan standar Madinah; metode historis lain hanya berbeda dalam cara beberapa batas ayat ditandai — kata-katanya sendiri identik.",
  },
  {
    count: "2 periode",
    detail:
      "Setiap surah termasuk salah satu dari dua periode wahyu. Surah Makki (sebelum Hijrah) sering lebih pendek dan berfokus pada akidah, tauhid, dan akhirat. Surah Madani (sesudah Hijrah) sering lebih panjang dan menambahkan perundangan serta bimbingan komunitas. Beberapa surah memuat ayat dari keduanya.",
  },
  {
    count: "Banyak",
    detail:
      "Al-Qur'an dianyam di sekitar tema-tema yang berulang, bukan disusun tema demi tema. Tauhid, shalat, kisah para nabi, keluarga, sedekah, kesabaran, dan akhirat berjalan di seluruh Kitab, saling memperkuat di banyak surah.",
  },
];

export const QURAN_GUIDE_TIMELINE_MS: DeepPartial<QuranGuideTimelineEvent>[] = [
  {
    title: "Kehidupan sebelum wahyu",
    body: "Pada tahun-tahun sebelum kenabian, Muhammad ﷺ sering menyendiri berhari-hari di Gua Hira untuk merenung, gelisah dengan kemusyrikan dan ketidakadilan masyarakat Makkah. Meski dunia di sekelilingnya menyembah berhala, ia tidak pernah melakukannya, dan kaumnya begitu memercayainya hingga menjulukinya Al-Amin — yang tepercaya — jauh sebelum klaim kenabian.",
    location: "Makkah",
  },
  {
    title: "Gua Hira",
    body: 'Pada bulan Ramadhan, ketika ia berusia sekitar empat puluh tahun, malaikat Jibril datang ke gua itu dengan satu perintah: "Bacalah!" Nabi ﷺ, yang tidak bisa membaca atau menulis, menjawab bahwa ia tidak sanggup. Malaikat itu mendekapnya erat tiga kali lalu menyampaikan kata-kata pertama Surah Al-Alaq — "Bacalah dengan (menyebut) nama Tuhanmu yang menciptakan." Terguncang, ia bergegas pulang menemui istrinya Khadijah, yang menyelimutinya dan menenangkannya.',
    location: "Gunung Nur, Makkah",
  },
  {
    title: "Wahyu pertama — Surah Al-Alaq",
    body: "Perintah membaca menandai dimulainya kenabian dan turunnya Al-Qur'an. Khadijah membawanya kepada kerabatnya yang berilmu, Waraqah bin Naufal, yang mengenali malaikat itu sebagai utusan yang sama yang datang kepada Musa dan meramalkan bahwa kaumnya sendiri akan mengusirnya. Wahyu-wahyu Makkah paling awal setelah itu berfokus pada keesaan Allah, kepastian akhirat, dan seruan luas untuk perbaikan moral.",
  },
  {
    title: "Awal periode Makkah",
    body: "Beberapa tahun pertama dakwah dilakukan secara diam-diam, lalu secara terang-terangan. Seiring meluasnya dakwah, kaum Quraisy beralih ke kekerasan — menyiksa kaum mukmin yang lemah dan budak — dan akhirnya memberlakukan boikot keras selama tiga tahun terhadap keluarga Nabi ﷺ, Bani Hasyim. Untuk lolos dari penganiayaan, sekelompok muslim hijrah ke Habasyah, di mana seorang raja Kristen yang adil melindungi mereka. Surah-surah dari periode ini umumnya berbicara dalam ayat-ayat pendek, mendesak, dan berirama.",
    location: "Makkah",
  },
  {
    title: "Hijrah ke Madinah",
    body: "Setelah bertahun-tahun teraniaya, dan setelah 'Amul Huzni (Tahun Duka) di mana ia kehilangan baik Khadijah maupun Abu Thalib, Nabi ﷺ dan para sahabatnya hijrah ke Madinah. Hijrah ini begitu penting hingga kelak menjadi awal penanggalan Islam. Di Madinah, kaum muslimin bukan lagi minoritas yang diburu, melainkan komunitas yang membangun masyarakat, dan wahyu mulai berbicara tentang hukum, keluarga, ekonomi, dan hubungan dengan Ahli Kitab.",
    location: "Madinah",
  },
  {
    title: "Periode Madinah",
    body: "Surah-surah Madinah umumnya lebih panjang dan lebih rinci, meletakkan hukum yang dibutuhkan komunitas yang telah menetap: shalat, zakat, puasa, pernikahan dan perceraian, warisan, rincian perjanjian dan perdamaian. Periode ini juga menyaksikan peperangan besar — Badar, Uhud, dan Ahzab — dan Al-Qur'an menggambarkan ujian kaum mukmin serta makar kaum munafik dengan kejelasan yang mengagumkan.",
    location: "Madinah",
  },
  {
    title: "Haji Wada",
    body: 'Pada tahun kesepuluh Hijrah, Nabi ﷺ menunaikan satu-satunya hajinya dan menyampaikan Khutbah Haji Wada di hadapan kumpulan besar di Arafah, mengingatkan umat akan kesucian jiwa dan harta, hak-hak perempuan, kesetaraan semua manusia tanpa memandang ras, serta berpegang teguh pada Al-Qur\'an dan Sunnah. Di sanalah ayat ini diturunkan: "Pada hari ini telah Kusempurnakan untuk kamu agamamu."',
    location: "Arafah / Mina",
  },
  {
    title: "Kodifikasi di masa Abu Bakar",
    body: "Tak lama setelah wafatnya Nabi ﷺ, banyak sahabat yang telah menghafal seluruh Al-Qur'an gugur syahid dalam Perang Yamamah. Khawatir akan hilangnya para penghafal, Umar mendesak Khalifah Abu Bakar untuk mengumpulkan Al-Qur'an dalam satu tempat. Abu Bakar menugaskan penulis tepercaya Zaid bin Tsabit, yang dengan cermat mengumpulkan wahyu tertulis — memverifikasinya dengan ingatan para sahabat — menjadi satu kumpulan suhuf.",
  },
  {
    title: "Mushaf standar — Utsman",
    body: "Seiring meluasnya Islam ke berbagai wilayah, perbedaan bacaan di antara muslim baru mulai memicu perselisihan. Untuk menyatukan umat pada satu teks tertulis, Khalifah Utsman membuat salinan resmi dari suhuf Abu Bakar dalam dialek Quraisy dan mengirimkannya ke kota-kota besar, memerintahkan agar salinan pribadi lainnya dimusnahkan. Mushaf Utsmani inilah standar yang diikuti seluruh dunia muslim sejak saat itu.",
  },
  {
    title: "Terjaga hingga hari ini",
    body: "Empat belas abad kemudian, Al-Qur\\'an tidak berubah, terjaga melalui tiga jaminan yang saling terkait — hafalan massal di setiap generasi, transmisi tertulis yang setia, dan rantai bacaan (qira\\'at) guru-ke-murid yang tak terputus hingga kembali ke Nabi ﷺ. Ini memenuhi janji Allah sendiri: \"Sesungguhnya Kamilah yang menurunkan Adz-Dzikr (Al-Qur\\'an), dan sesungguhnya Kami benar-benar memeliharanya.\"",
  },
];

export const QURAN_GUIDE_STORIES_MS: DeepPartial<QuranGuideStory>[] = [
  {
    prophetName: "Adam AS",
    title: "Adam AS — Nabi pertama dan bapak umat manusia",
    summary: "Penciptaan, sujud para malaikat, ujian pohon terlarang, diterimanya taubat.",
    body: [
      "Allah menciptakan manusia pertama, Adam AS, dari tanah dengan tangan-Nya sendiri, meniupkan ruh-Nya kepadanya, dan memberinya anugerah yang tidak diberikan kepada makhluk lain: Allah mengajarkan Adam nama-nama segala sesuatu. Ketika Allah menunjukkan ilmu itu, para malaikat mengakui keterbatasan mereka dan keutamaan Adam menjadi jelas — ilmu itu sendiri adalah bagian dari apa yang membedakan umat manusia.",
      "Kemudian Allah memerintahkan para malaikat untuk sujud kepada Adam sebagai penghormatan, dan semua patuh — kecuali Iblis, yang berasal dari golongan jin. Ia menolak dengan sombong, berdalih bahwa ia diciptakan dari api dan Adam dari tanah, sehingga ia menganggap dirinya lebih unggul. Kesombongan itulah, bukan kebodohan, yang membinasakannya, dan ia bersumpah akan menyesatkan keturunan Adam.",
      'Adam dan istrinya Hawa ditempatkan di surga dan diberi tahu bahwa mereka boleh makan apa saja dengan bebas kecuali mendekati satu pohon tertentu. Setan terus membisikkan godaan hingga akhirnya mereka memakannya. Seketika aurat mereka tersingkap, dan mereka menyadari kesalahan mereka. Namun alih-alih putus asa atau mencari alasan, mereka dengan rendah hati kembali kepada Allah: "Ya Tuhan kami, kami telah menganiaya diri kami sendiri, dan jika Engkau tidak mengampuni kami dan memberi rahmat kepada kami, niscaya pastilah kami termasuk orang-orang yang merugi."',
      'Allah menerima taubat mereka dan menurunkan mereka ke bumi — bukan sebagai hukuman sewenang-wenang, melainkan sebagai awal ujian kemanusiaan, disertai janji petunjuk: "Barang siapa yang mengikuti petunjuk-Ku, ia tidak akan sesat dan tidak akan celaka." Kisah Adam dengan demikian adalah kisah setiap manusia: diciptakan dengan kemuliaan, diuji, rentan berbuat salah, dan selalu bisa kembali.',
    ],
    lessons: [
      "Pintu taubat selalu terbuka — taubat Adam, yang diajukan tanpa alasan dan tanpa penundaan, adalah teladan bagi setiap pendosa.",
      "Kesombongan adalah akar kebinasaan: Iblis mengetahui kebenaran namun tetap menolak karena angkuh, menunjukkan bahwa ilmu tanpa kerendahan hati justru menghancurkan.",
      "Cara setan adalah bisikan yang terus-menerus, bukan paksaan — mengenali bisikannya adalah separuh jalan untuk menghindarinya.",
      "Nilai kemanusiaan terikat pada ilmu dan kembali kepada Allah, bukan pada tidak pernah berbuat salah — responsmu terhadap kesalahanlah yang mendefinisikan siapa dirimu.",
    ],
    quran: [
      {
        excerpt: "Penciptaan Adam dan sujud para malaikat.",
      },
      {
        excerpt: "Ujian, kekhilafan, dan taubat.",
      },
    ],
    location: "Surga, lalu bumi",
  },
  {
    prophetName: "Nuh AS",
    title: "Nuh AS — Kesabaran dalam penolakan berabad-abad",
    summary: "950 tahun berdakwah, bahtera, dan banjir sebagai keputusan ilahi.",
    body: [
      "Nuh AS diutus kepada kaum yang telah terjerumus dalam penyembahan berhala, dan ia menyerukan mereka untuk hanya menyembah Allah selama jangka waktu yang luar biasa — Al-Qur'an menyebutkan ia tinggal bersama mereka selama seribu tahun kurang lima puluh tahun. Ia menyeru mereka siang dan malam, secara terang-terangan dan sembunyi-sembunyi, menawarkan setiap bujukan: ampunan, hujan, harta, keturunan, dan kebun. Namun generasi demi generasi tetap berpaling, mengejek, dan menutup telinga.",
      "Ketika menjadi jelas bahwa tidak akan ada lagi yang beriman, Allah memerintahkan Nuh AS untuk membuat bahtera. Kaumnya mengejeknya ketika ia membangun kapal besar jauh dari laut mana pun, tetapi ia menjawab bahwa akan datang hari ketika mereka akan mengerti. Tandanya datang ketika tungku meluap; Nuh AS membawa naik orang-orang yang beriman — hanya sedikit — dan sepasang dari setiap jenis hewan ke dalam bahtera.",
      "Banjir bangkit dan menenggelamkan orang-orang yang mendustakan. Dalam salah satu momen paling menyentuh dalam kisah ini, putra Nuh AS sendiri menolak untuk naik, bersikeras bahwa ia akan naik ke gunung untuk menyelamatkan diri dari air, dan ia termasuk di antara yang tenggelam — kesedihan seorang ayah tidak bisa menghalangi kekufuran putranya. Ketika Nuh AS memohon untuknya, Allah mengajarkan bahwa perbuatan anak itu telah memutus ikatan iman di antara mereka.",
      'Ketika perintah datang, air surut dan bahtera berhenti di Gunung Judi. Al-Qur\'an mengabadikan seluruh peristiwa itu sebagai "sebuah tanda" bagi siapa saja yang merenungkan bagaimana Allah menyelamatkan orang-orang yang beriman dan bagaimana kesabaran akhirnya membuahkan hasil.',
    ],
    lessons: [
      "Misi yang panjang dan sulit dengan sedikit pengikut bukanlah kegagalan — Nuh AS berdakwah selama berabad-abad, dan keikhlasannya, bukan jumlah pengikutnya, yang dicintai Allah.",
      "Tidak ada ikatan keluarga yang bisa menyelamatkan seseorang tanpa iman: putra Nuh AS sendiri tenggelam, membuktikan bahwa petunjuk tidak diwariskan.",
      "Keteguhan dalam menyeru kepada Allah bahkan menghadapi ejekan terus-menerus adalah ibadah tersendiri.",
      "Pertolongan Allah datang pada waktu yang telah ditetapkan — orang beriman membangun 'bahtera' ketaatan sebelum badai datang, percaya pada janji itu.",
    ],
    quran: [
      {
        excerpt: "Kisah Nuh AS secara rinci.",
      },
      {
        excerpt: "Permohonan Nuh AS kepada kaumnya.",
      },
    ],
    location: "Mesopotamia kuno (perkiraan ilmiah)",
  },
  {
    prophetName: "Ibrahim AS",
    title: "Ibrahim AS — Kekasih Allah (Khalilullah)",
    summary:
      "Menghancurkan berhala, api yang menjadi dingin, pengorbanan Ismail, membangun Ka'bah.",
    body: [
      'Sejak muda, Ibrahim AS menemukan tauhid melalui akalnya sendiri dan menolak berhala-berhala yang dipahat dan disembah oleh kaumnya serta ayahnya sendiri. Ia berdebat dengan mereka, lalu bertindak: ketika mereka pergi ke sebuah perayaan, ia menghancurkan semua berhala kecuali yang terbesar, dan ketika orang-orang menuntut penjelasan, ia berkata agar mereka bertanya kepada berhala yang terbesar itu — mengungkap ketidakberdayaan apa yang mereka sembah. Marah karenanya, mereka menyalakan api besar dan melemparkannya ke dalamnya, tetapi Allah memerintahkan: "Wahai api! Jadilah dingin dan keselamatan bagi Ibrahim," dan ia keluar dengan selamat.',
      "Atas perintah Allah, Ibrahim AS meninggalkan istrinya Hajar dan bayinya Ismail di lembah tandus Makkah. Ketika air mereka habis, Hajar berlari cemas antara bukit Shafa dan Marwah mencari pertolongan — pencarian yang diulang kaum muslimin dalam sa'i haji — hingga mata air Zamzam memancar di dekat kaki bayi itu. Bertahun-tahun kemudian, Ibrahim AS bermimpi bahwa ia menyembelih putranya yang tercinta. Baik ayah maupun anak sama-sama tunduk pada kehendak Allah; dan tepat ketika Ibrahim AS akan melaksanakannya, Allah menebus Ismail dengan seekor domba jantan yang agung, yang diperingati setiap tahun pada Idul Adha.",
      'Bersama-sama, Ibrahim dan Ismail AS meninggikan fondasi Ka\\\'bah di Makkah, sambil berdoa saat membangunnya: "Ya Tuhan kami, terimalah dari kami (amalan kami)." Ibrahim AS juga berdoa agar seorang rasul dibangkitkan dari keturunannya — doa yang dikabulkan berabad-abad kemudian dalam diri Nabi Muhammad ﷺ. Karena ibadahnya yang tak tergoyahkan, Allah menganugerahinya gelar unik: Khalilullah, kekasih Allah yang mendalam.',
    ],
    lessons: [
      "Tauhid menuntut pemutusan hubungan palsu, sekalipun penyembahan berhala populer, mengakar dari tradisi, dan melawannya berbahaya.",
      "Tawakal penuh kepada Allah paling bersinar ketika perintah-Nya paling berat — Ibrahim AS bahkan tunduk pada pengorbanan putranya, dan Allah mengubah ujian itu menjadi rahmat.",
      "Tawakal kepada Allah bukan berarti pasif: Hajar berlari dan berusaha mencari, dan Zamzam pun datang — usaha dan tawakal bekerja bersama.",
      "Amal ibadah yang ikhlas bergema melintasi generasi; ritual haji dan keutamaan Ka'bah kembali kepada ketaatan Ibrahim AS.",
    ],
    quran: [
      {
        excerpt: "Ibrahim, Ismail, dan pengorbanan.",
      },
      {
        excerpt: "Perjanjian dan warisan.",
      },
    ],
    location: "Irak, Syam, Makkah",
  },
  {
    prophetName: "Yusuf AS",
    title: "Yusuf AS — Keindahan kesabaran (Sabrun Jamil)",
    summary: "Pengkhianatan, perbudakan, penjara, mencapai kekuasaan — tawakal dalam setiap ujian.",
    body: [
      "Sejak kecil, Yusuf AS bermimpi melihat sebelas bintang, matahari, dan bulan bersujud kepadanya — pertanda masa depan yang agung. Ayahnya, Ya'qub AS, yang juga seorang nabi, menyuruhnya menyembunyikan mimpi itu dari saudara-saudaranya yang iri hati. Rasa iri mereka menguasai mereka: mereka melemparkan Yusuf ke dalam sumur yang dalam dan memberi tahu ayah mereka bahwa ia dimakan serigala. Sebuah kafilah yang lewat menemukan anak itu dan menjualnya di Mesir.",
      'Di rumah seorang pembesar, ia tumbuh menjadi pria yang tampan dan jujur. Ketika istri pembesar itu mencoba menggodanya, Yusuf AS menolak, berkata: "Aku berlindung kepada Allah," dan ketika ia diancam, ia lebih memilih penjara daripada dosa. Meski tak bersalah, ia dipenjara bertahun-tahun. Di sana ia menyeru sesama tahanan kepada tauhid dan menafsirkan mimpi mereka dengan izin Allah.',
      "Ketika raja tergelisah dengan mimpi tujuh sapi gemuk yang dimakan tujuh sapi kurus, Yusuf AS menafsirkannya sebagai tujuh tahun kemakmuran, lalu tujuh tahun paceklik, dan menyarankan untuk menyimpan hasil panen. Akhirnya dikenali karena kebijaksanaan dan kejujurannya, ia diangkat menjadi penjaga perbendaharaan Mesir.",
      'Paceklik akhirnya membawa saudara-saudaranya ke Mesir mencari makanan, tanpa mengenali menteri berkuasa yang berdiri di hadapan mereka. Setelah mengujinya, Yusuf AS memperkenalkan dirinya dan — alih-alih membalas dendam — mengampuni mereka sepenuhnya: "Pada hari ini tak ada cercaan terhadap kamu. Semoga Allah mengampuni kamu." Keluarga itu bersatu kembali, orang tuanya dimuliakan, dan mimpi masa kecilnya menjadi kenyataan.',
    ],
    lessons: [
      "Sabrun jamil — kesabaran yang indah — berarti menanggung kesulitan tanpa kepahitan atau mengeluh kepada manusia, membawa kesedihan hanya kepada Allah sebagaimana dilakukan Ya'qub AS.",
      "Menjaga kesucian diri layak dengan harga berapa pun: Yusuf AS memilih penjara daripada dosa, dan karena itu Allah mengangkat derajatnya.",
      "Rencana Allah seringkali tersembunyi di balik bertahun-tahun kemalangan yang tampak — sumur, perbudakan, dan penjara semuanya adalah langkah menuju kemuliaan Yusuf AS.",
      "Orang yang berkuasa menunjukkan kekuatannya melalui pengampunan: pada puncak kekuasaannya, Yusuf AS mengampuni mereka yang telah menzaliminya.",
    ],
    quran: [
      {
        excerpt: "Kisah yang terbaik — dituturkan dalam satu surah.",
      },
    ],
    location: "Kanaan, Mesir",
  },
  {
    prophetName: "Musa AS",
    title: "Musa AS — Berbicara langsung dengan Allah dan menghadapi Fir'aun",
    summary:
      "Semak yang menyala, tanda-tanda melawan Fir'aun, keluarnya Bani Israil, Taurat, dan kaum yang tersesat.",
    body: [
      "Musa AS, dengan pengaturan Allah, dibesarkan justru di istana Fir'aun, setelah ibunya menghanyutkannya di sungai untuk menyelamatkannya dari pembantaian bayi laki-laki Israil oleh Fir'aun. Dewasa muda, ia meninggalkan Mesir setelah sebuah pembunuhan, dan bertahun-tahun kemudian, dalam perjalanan kembali dari padang pasir, ia melihat api di Gunung Sinai. Di sana Allah berbicara langsung kepadanya — sebuah keutamaan yang memberi Musa gelar Kalimullah, ia yang berbicara dengan Allah — berfirman: \"Sesungguhnya Akulah Tuhanmu.\" Ia diutus kembali, dengan bantuan saudaranya Harun AS, kepada Fir'aun yang durhaka dengan tuntutan: bebaskan Bani Israil.",
      "Fir'aun mengaku sebagai tuhan dan menolak. Allah memberi Musa AS tanda-tanda yang nyata — tongkatnya menjadi ular hidup dan tangannya bersinar putih. Fir'aun memanggil para penyihir terbaiknya untuk mendustakannya, tetapi ketika tongkat Musa menelan tipu daya mereka, para penyihir itu mengenali kebenaran sejati di balik sihir semu dan tersungkur sujud, menyatakan iman kepada Tuhan Musa dan Harun — meski Fir'aun mengancam mereka dengan kematian. Berbagai azab silih berganti setelah itu, namun Fir'aun tetap keras kepala.",
      "Akhirnya Allah memerintahkan Musa AS untuk membawa kaumnya pergi di malam hari. Fir'aun mengejar mereka hingga ke laut; Musa memukulkan tongkatnya dan air terbelah, membiarkan orang-orang beriman melewati tanah kering. Ketika Fir'aun dan pasukannya mengikuti, laut menutup kembali atas mereka dan mereka tenggelam. Kemudian Musa AS menerima Taurat, tetapi Bani Israil terbukti durhaka — menyembah anak sapi emas saat ketiadaannya dan menolak memasuki Tanah Suci — dan akibatnya mengembara selama empat puluh tahun.",
    ],
    lessons: [
      "Berkatalah benar di hadapan kezaliman sambil bertawakal penuh kepada Allah — Musa AS menghadapi orang paling berkuasa di zamannya hanya dengan senjata keimanan.",
      "Bahkan orang beriman yang tulus bisa goyah: para penyihir yang menentang Musa, dalam satu momen kejelasan, menjadi lebih teguh daripada seluruh kaum yang telah menyaksikan mukjizat.",
      "Melihat mukjizat itu sendiri tidak menciptakan iman — petunjuk adalah anugerah Allah yang datang kepada hati yang rendah hati, bukan yang durhaka.",
      "Allah menyelamatkan yang tertindas dan menjatuhkan hukuman pada yang sombong, sekuat apa pun mereka.",
    ],
    quran: [
      {
        excerpt: "Musa AS di Gunung Sinai dan di hadapan Fir'aun.",
      },
      {
        excerpt: "Kelahiran dan pengasuhan.",
      },
    ],
    location: "Mesir, Sinai",
  },
  {
    prophetName: "Isa AS",
    title: "Isa bin Maryam AS — Kalimat dan ruh dari Allah",
    summary:
      "Kelahiran ajaib, tanda-tanda, diangkat oleh Allah — menurut Al-Qur'an bukan dibunuh dan bukan disalib.",
    body: [
      'Maryam AS, seorang wanita suci dan tekun beribadah yang dipilih Allah sebagai wanita terbaik pada zamannya, mengasingkan diri dari keluarganya ke arah timur. Di sana malaikat Jibril mendatanginya dalam wujud seorang pria dan mengumumkan bahwa Allah akan menganugerahinya seorang putra yang suci, meski tidak ada laki-laki yang menyentuhnya. Ia mengandung dengan kalimat Allah "Jadilah," dan Isa pun lahir — Al-Qur\\\'an menyamakan penciptaannya dengan penciptaan Adam, yang dibuat tanpa ayah, menunjukkan bahwa Allah menciptakan sekehendak-Nya.',
      'Ketika ia kembali membawa bayinya, kaumnya menuduhnya. Untuk membelanya, bayi Isa berbicara dari buaian, menyatakan dirinya sebagai hamba Allah yang diberi Kitab dan diangkat menjadi nabi — sebuah mukjizat yang membersihkan kehormatan ibunya. Sebagai nabi bagi Bani Israil, Isa AS diberi tanda-tanda yang nyata dengan izin Allah: ia menyembuhkan orang buta dan berpenyakit kusta, menghidupkan orang mati, dan membentuk seekor burung dari tanah liat yang lalu terbang — selalu menegaskan bahwa semua itu terjadi "dengan izin Allah," bukan dengan kekuatannya sendiri.',
      "Al-Qur'an menyatakan dengan tegas bahwa Isa AS tidak dibunuh dan tidak disalib; sebaliknya, hal itu diserupakan bagi musuh-musuhnya, dan Allah mengangkatnya kepada-Nya. Keyakinan Ahlus Sunnah adalah bahwa ia akan kembali sebelum Hari Kiamat. Yang penting, Al-Qur'an menegaskan bahwa Isa adalah seorang nabi manusia dan hamba Allah, bukan tuhan dan bukan putra Allah — pesan yang ia sendiri nyatakan sejak dari buaian hingga akhir.",
    ],
    lessons: [
      "Allah menciptakan sekehendak-Nya — kelahiran Isa AS tanpa ayah, seperti penciptaan Adam dari tanah, menunjukkan bahwa kekuasaan-Nya tidak terikat sebab duniawi mana pun.",
      'Mukjizat apa pun yang ditunjukkan Isa AS secara tegas terjadi "dengan izin Allah," mengajarkan bahwa para nabi adalah perantara kekuasaan Allah, bukan pemiliknya.',
      "Para nabi adalah hamba Allah yang mulia, tidak pernah layak disembah — Al-Qur'an melindungi kedudukan sejati Isa dari pengagungan yang berlebihan.",
      "Kesucian, kesabaran, dan tawakal Maryam AS menjadikannya teladan iman bagi semua orang beriman, baik perempuan maupun laki-laki.",
    ],
    quran: [
      {
        excerpt: "Kelahiran dan perkataan dari buaian.",
      },
      {
        excerpt: "Tidak dibunuh dan tidak disalib; melainkan diangkat.",
      },
    ],
    location: "Palestina",
  },
  {
    prophetName: "Muhammad ﷺ",
    title: "Muhammad ﷺ — Penutup para nabi",
    summary: "Rasul terakhir; Al-Qur'an diturunkan selama 23 tahun; rahmat bagi semesta alam.",
    body: [
      'Muhammad ﷺ lahir sekitar tahun 570 M dalam suku Quraisy di Makkah. Menjadi yatim piatu sejak kecil — ayahnya wafat sebelum ia lahir dan ibunya ketika ia berusia enam tahun — ia dibesarkan pertama oleh kakeknya lalu oleh pamannya, Abu Thalib. Jauh sebelum kenabian, ia begitu tepercaya karena kejujurannya hingga kaumnya menjulukinya Al-Amin, "yang tepercaya". Pada usia empat puluh tahun, saat merenung di Gua Hira, ia menerima wahyu pertama Al-Qur\\\'an melalui malaikat Jibril.',
      'Selama tiga belas tahun di Makkah, ia menyeru manusia untuk hanya menyembah Allah dan menghadapi penganiayaan yang keras: ejekan, penyiksaan terhadap pengikutnya yang lemah, dan boikot sosial-ekonomi yang melumpuhkan bagi keluarganya. Dalam satu "Tahun Duka" yang sama, ia kehilangan baik istrinya yang tercinta, Khadijah, maupun pelindungnya, Abu Thalib, dan ketika ia mencari perlindungan di Thaif yang berdekatan, ia diusir dan dilempari batu — namun ia mendoakan petunjuk bagi mereka, bukan kehancuran mereka.',
      'Setelah hijrah ke Madinah, ia membangun sebuah komunitas dan membawanya melalui ujian-ujian Badar, Uhud, dan Ahzab. Ketika akhirnya ia kembali menaklukkan Makkah dengan kekuatan yang luar biasa, ia tidak membalas dendam kepada mereka yang telah menyiksa dan mengusirnya; ia mengampuni mereka dan berkata: "Pergilah, kalian bebas." Al-Qur\\\'an merangkum misinya dalam satu kalimat — "rahmat bagi semesta alam" — dan menjelaskan bahwa tugasnya adalah menyampaikan pesan dengan jelas, bukan memaksa siapa pun untuk beriman.',
    ],
    lessons: [
      "Akhlak terbaik yang bisa dimiliki seseorang adalah akhlak Nabi ﷺ — pelajari sirahnya dengan saksama dan berusahalah menerapkannya dalam kehidupan sehari-hari.",
      "Rahmat dan pengampunan adalah kekuatan, bukan kelemahan: pada puncak kekuasaannya, ia mengampuni musuh-musuhnya yang paling jahat.",
      "Pesan dakwah kepada Allah disampaikan dengan keikhlasan dan kesabaran tetapi hasilnya diserahkan kepada Allah — memberi petunjuk adalah urusan-Nya semata.",
      "Ujian adalah jalan para nabi; menanggung kesulitan demi Allah, sebagaimana yang ia lakukan, adalah tanda keimanan yang sejati.",
    ],
    quran: [
      {
        excerpt:
          "Dan tiadalah Kami mengutus kamu, melainkan untuk (menjadi) rahmat bagi semesta alam.",
      },
      {
        excerpt: "Berkasih sayang sesama mereka, keras terhadap orang-orang kafir.",
      },
    ],
    appLinks: [{}],
  },
];

export const QURAN_GUIDE_THEMES_MS: DeepPartial<QuranGuideTheme>[] = [
  {
    title: "Iman",
    summary:
      "Keimanan kepada Allah, malaikat-Nya, kitab-kitab-Nya, rasul-rasul-Nya, Hari Akhir, dan takdir.",
    lessons: [
      "Iman berdiri di atas enam rukun yang dihimpun Al-Qur'an dalam satu tempat: keimanan kepada Allah, malaikat-Nya, kitab-kitab yang diturunkan-Nya, rasul-rasul-Nya, Hari Akhir, dan takdir — baik dan buruknya.",
      "Iman bukanlah pengakuan yang tetap dan sekali jadi. Dalam keyakinan Ahlus Sunnah, iman bertambah dengan ketaatan dan dzikir serta berkurang dengan dosa dan kelalaian, sehingga iman adalah sesuatu yang secara aktif kamu tumbuhkan.",
      "Nabi ﷺ mengajarkan bahwa iman memiliki lebih dari tujuh puluh cabang, dari yang tertinggi — kesaksian bahwa tiada tuhan selain Allah — hingga menyingkirkan sesuatu yang mengganggu dari jalan, menunjukkan bahwa kebaikan kecil pun bagian dari iman.",
      "Iman yang sejati adalah urusan hati sebelum lisan: benar-benar mengenal Allah, mencintai-Nya melebihi segalanya, takut akan murka-Nya, dan bertawakal sepenuhnya kepada-Nya.",
    ],
    quran: [
      {
        excerpt:
          "Rasul telah beriman kepada apa yang diturunkan kepadanya dari Tuhannya, demikian pula orang-orang yang beriman…",
      },
    ],
    hadith: [
      {
        excerpt:
          'Iman itu memiliki lebih dari tujuh puluh cabang; yang tertinggi adalah ucapan "laa ilaaha illallah", dan yang terendah adalah menyingkirkan gangguan dari jalan — dan rasa malu adalah salah satu cabang iman.',
      },
    ],
    actions: [
      "Ucapkan kembali syahadatmu hari ini dengan perhatian penuh pada maknanya, bukan sekadar kalimat rutin.",
      "Pelajari salah satu nama Allah, pahami maknanya, dan panggillah Allah dengannya dalam doamu.",
    ],
  },
  {
    title: "Shalat",
    summary:
      "Amalan pertama yang ditanya pada Hari Kiamat — tiang yang menghubungkan hamba dengan Tuhannya.",
    lessons: [
      "Shalat adalah rukun kedua Islam dan amalan pertama yang akan ditanyakan kepada hamba pada Hari Kiamat — jika ini benar, biasanya seluruh catatan amal lainnya pun ikut menjadi baik.",
      "Al-Qur'an menyatakan bahwa shalat, jika dilaksanakan dengan kehadiran hati yang sesungguhnya, mencegah manusia dari perbuatan keji dan mungkar; ia bukan sekadar ritual melainkan pembaruan jiwa yang diulang lima kali sehari.",
      "Berbeda dari kewajiban lain yang diturunkan di bumi, shalat diwajibkan bagi umat ini selama perjalanan malam dan mikraj Nabi ﷺ (Al-Isra wal Mi'raj), menjadikannya anugerah khusus dan sarana kenaikan hamba menuju Allah.",
      "Karena diulang lima kali sehari, shalat adalah irama yang mantap yang menjaga iman tetap hidup di antara satu ibadah dengan ibadah lainnya.",
    ],
    quran: [
      {
        excerpt:
          "Sesungguhnya shalat itu mencegah dari (perbuatan-perbuatan) keji dan mungkar, dan dzikir kepada Allah lebih besar (keutamaannya).",
      },
    ],
    hadith: [
      {
        excerpt:
          "Amalan pertama yang akan dihisab dari seorang hamba pada Hari Kiamat adalah shalatnya; jika baik, ia beruntung dan sukses, dan jika rusak, ia gagal dan merugi.",
      },
    ],
    actions: [
      "Kerjakan satu shalat hari ini dengan perlahan, memahami kata-kata Al-Fatihah saat kamu membacanya.",
      "Buka panduan Belajar Shalat Munib untuk memperkuat satu bagian dari shalatmu.",
    ],
  },
  {
    title: "Orang tua",
    summary:
      "Berbakti kepada orang tua dihubungkan dengan ibadah kepada Allah — peringatan keras terhadap durhaka setelah kemusyrikan.",
    lessons: [
      "Allah menghubungkan berbakti kepada orang tua langsung dalam ayat yang sama dengan ibadah kepada-Nya sendiri — tanda betapa beratnya hak mereka dalam Islam.",
      'Al-Qur\'an melarang bahkan tanda ketidaksenangan yang paling kecil: jangan katakan "ah" kepada mereka, jangan membentak mereka, melainkan bicaralah kepada mereka dengan kata-kata yang lembut dan mulia.',
      "Perintah ini memuncak di masa tua, ketika orang tua paling membutuhkan kesabaran: rawatlah mereka sebagaimana mereka dahulu merawatmu, dan rendahkanlah dirimu di hadapan mereka dengan penuh kasih sayang.",
      "Ibadah tidak berakhir dengan kematian — terus mendoakan orang tua, bersedekah atas nama mereka, dan menghormati sahabat serta janji mereka adalah bentuk kesetiaan yang berkelanjutan.",
    ],
    quran: [
      {
        excerpt:
          "Dan Tuhanmu telah memerintahkan supaya kamu jangan menyembah selain Dia dan hendaklah kamu berbuat baik pada ibu bapakmu…",
      },
    ],
    actions: [
      "Hari ini, teleponlah atau kirim pesan kepada ayah atau ibumu dengan kata-kata yang lembut.",
      "Doakan kedua orang tuamu dengan menyebut nama mereka.",
    ],
  },
  {
    title: "Kesabaran",
    summary:
      "Keteguhan dalam ketaatan, menahan diri dari dosa, dan menerima takdir dengan lapang dada.",
    lessons: [
      "Para ulama menjelaskan sabar dalam tiga bentuk: sabar dalam menaati Allah, sabar dalam menjauhi dosa, dan sabar dalam menerima takdir-Nya saat menghadapi ujian.",
      "Sabar bukanlah keputusasaan yang pasrah atau menggerutu sendirian — Al-Qur'an menghubungkannya dengan shalat sebagai sumber pertolongan, jadi sabar bersifat aktif dan mengarahkanmu kepada Allah, bukan menjauh dari-Nya.",
      'Allah menyebut diri-Nya "bersama orang-orang yang sabar," dan menjanjikan pahala tanpa batas bagi mereka yang sabar — sebuah kemuliaan yang hampir tidak dikaitkan dengan sifat lain mana pun.',
      "Para nabi diuji paling berat, dan Al-Qur'an menyajikan keteguhan mereka — Ayyub AS dalam sakitnya, Ya'qub AS dalam kesedihannya, Yusuf AS dalam pengkhianatan dan penjaranya — sebagai teladan.",
    ],
    quran: [
      {
        excerpt:
          "Hai orang-orang yang beriman, jadikanlah sabar dan shalat sebagai penolongmu, sesungguhnya Allah beserta orang-orang yang sabar.",
      },
    ],
    actions: [
      'Hari ini, ketika rasa kesal muncul, berhentilah, tarik napas, dan ucapkan "innaa lillaahi wa innaa ilaihi raaji\'uun" sebelum bereaksi.',
      "Minggu ini, ubahlah satu momen kesulitan menjadi dua rakaat shalat, bukan keluhan.",
    ],
  },
  {
    title: "Sedekah (Sedekah dan Zakat)",
    summary:
      "Menyucikan harta dan memberi makan orang yang membutuhkan — tanda keimanan yang sejati.",
    lessons: [
      "Zakat — sedekah wajib tahunan yang menyucikan atas harta yang mencapai nisab — adalah rukun ketiga Islam dan sebuah kewajiban, sementara sedekah adalah pemberian sukarela yang tidak terbatas dan memiliki banyak bentuk.",
      "Al-Qur'an menjanjikan bahwa harta yang dibelanjakan di jalan Allah tidak sia-sia melainkan dilipatgandakan: seperti sebutir benih yang menumbuhkan tujuh tangkai, setiap tangkai berisi seratus biji, dan Allah melipatgandakan lagi bagi siapa yang Dia kehendaki.",
      "Sedekah bukan hanya harta. Nabi ﷺ mengajarkan bahwa senyum kepada saudaramu pun adalah sedekah, jadi tak ada seorang pun yang terlalu miskin untuk memberi.",
      'Memberi menyucikan baik harta maupun pemberinya, melonggarkan cengkeraman ketamakan dan menumbuhkan kepedulian — itulah sebabnya kata "zakat" sendiri bermakna penyucian dan pertumbuhan.',
    ],
    quran: [
      {
        excerpt:
          "Perumpamaan (nafkah yang dikeluarkan oleh) orang-orang yang menafkahkan hartanya di jalan Allah adalah serupa dengan sebutir benih yang menumbuhkan tujuh bulir…",
      },
    ],
    actions: [
      "Hari ini, berilah sesuatu — harta, waktumu, atau sepatah kata yang tulus dan baik — sekalipun kecil dan tak terlihat.",
      "Tinjau kewajiban zakatmu di Munib dan catat kapan pembayaran berikutnya jatuh tempo.",
    ],
  },
  {
    title: "Taubat",
    summary:
      "Allah mencintai orang-orang yang bertaubat — pintu tetap terbuka selama ruh belum sampai ke tenggorokan.",
    lessons: [
      "Taubat yang sejati memiliki syarat yang jelas: penyesalan yang sungguh-sungguh atas dosa, segera meninggalkannya, dan tekad kuat untuk tidak mengulanginya — dan jika dosa itu menzalimi orang lain, mengembalikan haknya juga.",
      "Allah tidak sekadar mengizinkan taubat — Dia mencintai orang-orang yang terus-menerus kembali kepada-Nya, sehingga kembali setelah tergelincir itu sendiri dicintai-Nya, bukan noda yang memberatkanmu.",
      "Pintu rahmat terbuka sangat luas: Allah bahkan kepada mereka yang telah menzalimi diri mereka sendiri secara berlebihan, berfirman agar tidak putus asa, karena Dia mengampuni semua dosa bagi yang bertaubat dengan sungguh-sungguh.",
      "Taubat tidak hanya untuk dosa besar atau momen dramatis — istighfar sepanjang hari menjaga hati tetap lembut dan catatan amal tetap bersih.",
    ],
    quran: [
      {
        excerpt:
          "Katakanlah: Hai hamba-hamba-Ku yang melampaui batas terhadap diri mereka sendiri, janganlah kamu berputus asa dari rahmat Allah…",
      },
    ],
    actions: [
      'Hari ini, ucapkan "astaghfirullah" 100 kali, dengan sepenuh hati, dan rasakan beban itu meringan.',
      "Sebutkan satu kebiasaan yang kamu tahu tidak disukai Allah dan ambillah langkah nyata pertama untuk meninggalkannya.",
    ],
  },
  {
    title: "Surga",
    summary:
      "Balasan abadi yang disiapkan bagi orang-orang bertakwa — digambarkan dengan rincian yang hidup dan menggugah.",
    lessons: [
      "Al-Qur'an menggambarkan surga dengan rincian yang hidup dan menggugah — taman-taman yang di bawahnya mengalir sungai-sungai, kenyamanan abadi, dan pertemuan kembali dengan orang-orang saleh — tepat agar orang beriman merindukannya dan berusaha meraihnya.",
      "Memasuki surga pada akhirnya adalah karena rahmat Allah, bukan semata amal; keimanan dan usaha yang tulus adalah sarana, tetapi amal seseorang tidak bisa meraih balasan abadi tanpa rahmat-Nya.",
      'Al-Qur\\\'an mengajak orang-orang beriman untuk bersegera dan berlomba menuju ampunan dan surga yang "seluas langit dan bumi" — meraihnya secara aktif, bukan sekadar duduk berharap.',
      "Balasan terbesar bukanlah taman atau sungai, melainkan memandang wajah Allah — kebahagiaan tertinggi yang dijanjikan bagi penghuni surga.",
    ],
    quran: [
      {
        excerpt:
          "Dan bersegeralah kamu kepada ampunan dari Tuhanmu dan kepada surga yang luasnya seluas langit dan bumi…",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Neraka",
    summary:
      "Peringatan yang nyata — bukan untuk membuat orang beriman putus asa, melainkan untuk membangunkan kewaspadaan.",
    lessons: [
      "Neraka adalah peringatan yang nyata, bukan kiasan — Al-Qur'an menjelaskannya dengan gamblang agar manusia menganggap bahaya itu serius dan berbalik arah selagi masih bisa.",
      "Ketakutan akan api itu dimaksudkan untuk bekerja bersama harapan akan rahmat Allah: orang beriman berjalan di antara takut dan harap, agar tidak putus asa mendominasi maupun rasa aman yang keliru.",
      "Satu-satunya dosa yang Al-Qur'an nyatakan tidak terampuni jika seseorang mati dalam keadaan itu adalah syirik — menyekutukan Allah; selain itu Dia mengampuni siapa yang Dia kehendaki.",
      "Allah memperingatkan untuk membawa manusia kembali kepada-Nya, bukan untuk menghancurkan orang yang bertaubat — setiap peringatan dalam Al-Qur'an dipasangkan dengan ajakan terbuka untuk kembali.",
    ],
    quran: [
      {
        excerpt:
          "Sesungguhnya Allah tidak akan mengampuni dosa syirik, dan Dia mengampuni segala dosa yang selain dari (syirik) itu, bagi siapa yang dikehendaki-Nya.",
      },
    ],
    actions: [
      "Hari ini, setelah setiap shalat, mohonlah perlindungan dari api dengan sepenuh hati kepada Allah.",
      "Perbarui tauhidmu: renungkan hanya beribadah kepada Allah, perlindungan paling pasti dari neraka.",
    ],
  },
  {
    title: "Keadilan",
    summary: "Berdirilah teguh untuk keadilan, sekalipun melawan dirimu sendiri atau kerabatmu.",
    lessons: [
      "Keadilan dalam Al-Qur'an tidak bisa ditawar: berdirilah teguh untuknya sekalipun kebenaran itu melawan dirimu, orang tuamu, atau kerabat terdekatmu.",
      'Allah memerintahkan agar kebencian terhadap suatu kaum tidak pernah mendorongmu berbuat tidak adil — "berlaku adillah, karena itu lebih dekat kepada takwa" — jadi keadilan adalah hak bahkan bagi musuh sekalipun.',
      "Kezaliman diperingatkan dengan tegas; Nabi ﷺ mengajarkan bahwa kezaliman akan muncul sebagai kegelapan berlapis-lapis bagi pelakunya pada Hari Kiamat.",
      "Keadilan bukan hanya urusan hakim dan penguasa — ia hidup dalam ucapan yang jujur, transaksi yang jujur, menepati janji, dan memberikan hak setiap orang.",
    ],
    quran: [
      {
        excerpt:
          "Jadilah kamu orang yang benar-benar penegak keadilan, menjadi saksi karena Allah, biarpun terhadap dirimu sendiri atau ibu bapak dan kaum kerabatmu.",
      },
    ],
    actions: [
      "Hari ini, berikan hak seseorang — upah yang adil, jawaban yang jujur, atau pengakuan yang menjadi haknya.",
      "Tangkap satu momen ketika bias mendorongmu berbuat tidak adil, dan pilihlah keadilan sebagai gantinya.",
    ],
  },
  {
    title: "Ilmu",
    summary: 'Bacalah, renungkanlah, dan ucapkanlah "Ya Tuhanku, tambahkanlah ilmu kepadaku."',
    lessons: [
      'Kata pertama yang diturunkan dalam Al-Qur\\\'an adalah "Bacalah" — Islam dibuka bukan dengan sebuah ritual, melainkan dengan perintah untuk belajar, memuliakan baik kecerdasan akal maupun ilmu hati.',
      'Allah bahkan menyuruh Nabi-Nya ﷺ untuk terus meminta lebih: "Ya Tuhanku, tambahkanlah ilmu kepadaku" — satu-satunya hal yang diperintahkan Al-Qur\\\'an kepadanya untuk memintanya ditambahkan.',
      "Ilmu yang bermanfaat dimaksudkan untuk diamalkan dan diteruskan; Nabi ﷺ mengajarkan bahwa para ulama adalah pewaris para nabi, yang mewarisi bukan harta melainkan ilmu.",
      'Menuntut ilmu agama itu sendiri adalah ibadah, dan Al-Qur\\\'an dengan jelas membedakan antara yang berilmu dan yang tidak — "apakah sama?"',
    ],
    quran: [
      {
        excerpt: "Dan katakanlah: Ya Tuhanku, tambahkanlah ilmu kepadaku.",
      },
    ],
    actions: [
      "Hari ini, pelajari satu hal baru dari Al-Qur'an — satu ayat, satu kata, atau satu hukum — dan ajarkan kepada seseorang.",
      'Hafalkan doa "Rabbi zidnii \'ilman" dan ucapkan sebelum belajar.',
    ],
  },
  {
    title: "Para nabi",
    summary: "Kisah petunjuk, ujian, dan pertolongan ilahi — bukan hiburan, melainkan pengajaran.",
    lessons: [
      'Al-Qur\\\'an mengajarkan bahwa tidak ada kaum yang dibiarkan tanpa petunjuk: "Tidak ada suatu umat pun melainkan telah ada padanya seorang pemberi peringatan" — pesan tauhid yang sama diutus ke mana-mana.',
      'Semua nabi membawa satu seruan dasar yang sama — sembahlah hanya Allah — dan kisah mereka dituturkan bukan sebagai sejarah, melainkan sebagai pengajaran bagi "orang-orang yang berakal".',
      "Muhammad ﷺ adalah Khataman Nabiyyin, penutup para rasul, dan seorang muslim wajib beriman kepada semua nabi sebelumnya — Nuh, Ibrahim, Musa, Isa, dan yang lainnya — tanpa membeda-bedakan mereka.",
      "Para nabi adalah manusia dan hamba Allah, bukan tuhan; Al-Qur'an memuliakan mereka namun menempatkan mereka dengan tegas sebagai makhluk, tidak pernah disembah bersama Sang Pencipta.",
    ],
    quran: [
      {
        excerpt:
          "Sesungguhnya pada kisah-kisah mereka itu terdapat pelajaran bagi orang-orang yang mempunyai akal…",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Perempuan",
    summary: "Hak, martabat, dan kesetaraan spiritual — Maryam AS termasuk sebaik-baik perempuan.",
    lessons: [
      'Al-Qur\'an mengajarkan kesetaraan spiritual laki-laki dan perempuan di hadapan Allah: "laki-laki yang beriman dan perempuan yang beriman" dijanjikan keimanan yang setara, amal yang setara, dan pahala yang setara.',
      'Perempuan dan laki-laki digambarkan sebagai sahabat dan pelindung satu sama lain dalam iman, bukan kepemilikan — surah keempat, An-Nisa ("Perempuan"), sebagian besar didedikasikan untuk melindungi hak, martabat, warisan, dan perlakuan terhadap mereka.',
      "Al-Qur'an menghadirkan Maryam, ibu Isa AS, sebagai teladan bagi semua orang beriman, dan memuliakan para ibu hingga sebuah ajaran terkenal menempatkan surga di bawah telapak kaki mereka.",
      'Kedua jenis kelamin berasal dari satu asal yang sama — "menciptakan kamu dari diri yang satu" — menetapkan kemanusiaan dan martabat yang sama sejak ayat pertama Surah An-Nisa.',
    ],
    quran: [
      {
        excerpt:
          "Bertakwalah kepada Tuhanmu yang telah menciptakan kamu dari diri yang satu, dan daripadanya Allah menciptakan pasangannya…",
      },
    ],
    actions: [
      "Hari ini, berikan kepada seorang perempuan dalam hidupmu — ibu, istri, saudari, atau putri — suatu hak atau kebaikan tertentu yang menjadi haknya.",
    ],
  },
  {
    title: "Anak-anak",
    summary: "Sebuah amanah — untuk dibesarkan dengan tauhid dan kasih sayang.",
    lessons: [
      'Anak-anak adalah amanah — sesuatu yang dititipkan dari Allah — dan Al-Qur\'an membebankan tanggung jawab pengasuhan mereka kepada orang tua: "Jagalah dirimu dan keluargamu dari api neraka" dimulai dengan mengajarkan mereka tauhid dan akhlak yang baik.',
      "Nabi ﷺ menyebut belajar dan mengajarkan Al-Qur'an sebagai salah satu amalan terbaik, sehingga membimbing seorang anak membaca sekalipun sedikit menanam kebaikan yang terus berbuah, dengan pahala yang terus mengalir kepada orang tua.",
      "Kebijaksanaan pengasuhan yang banyak diriwayatkan menganjurkan untuk memperlakukan anak sesuai tahapannya — bermain bersama mereka di tahun-tahun awal, lalu mengajari dan mendidik mereka dengan lembut, kemudian menjadi sahabat mereka setelah baligh.",
      "Membesarkan anak yang saleh adalah investasi yang melampaui kehidupan ini: keturunan yang saleh yang mendoakan orang tuanya terus memberi manfaat bahkan lama setelah kematian.",
    ],
    quran: [
      {
        excerpt: "Hai orang-orang yang beriman, peliharalah dirimu dan keluargamu dari api neraka…",
      },
    ],
    actions: [
      "Hari ini, ajarkan seorang anak satu ayat pendek atau satu akhlak baik dengan penuh kesabaran dan dorongan.",
      "Doakan anak-anakmu (atau anak-anak dalam asuhanmu) dengan menyebut namanya agar menjadi lurus dan dicintai Allah.",
    ],
  },
];

export const QURAN_GUIDE_TAJWEED_MS: DeepPartial<QuranGuideTajweedLesson>[] = [
  {
    title: "Nun sukun dan tanwin",
    summary: "Hukum nun mati dan tanwin — izhar, idgham, iqlab, ikhfa.",
    explanation: [
      "Nun sukun adalah nun yang mati (tidak berharakat); tanwin adalah akhiran vokal ganda (an, in, un) yang di akhir kata terdengar persis seperti nun. Keduanya mengikuti empat hukum yang sama, yang ditentukan sepenuhnya oleh huruf yang mengikutinya.",
      "Izhar (pengucapan jelas): ketika diikuti salah satu dari enam huruf tenggorokan (hamzah, ha, ain, ha, ghain, kha), ucapkan nun dengan jelas dan gamblang, tanpa campuran dengung.",
      'Idgham (peleburan): sebelum huruf-huruf dalam kata "yarmaluuna" (ي ر م ل و ن), nun melebur ke huruf berikutnya — dengan ghunnah (dengung) untuk ي ن م و, dan tanpa ghunnah untuk ل ر.',
      "Iqlab (penggantian): ketika diikuti huruf ba, nun berubah menjadi bunyi mim samar disertai ghunnah.",
      'Ikhfa (penyamaran): sebelum lima belas huruf sisanya, nun tidak diucapkan sepenuhnya jelas maupun dilebur sepenuhnya — ia "disamarkan" dengan ghunnah hidung yang ringan sementara lidah bersiap untuk huruf berikutnya.',
    ],
    practice:
      "Bacalah Surah Al-Fatihah perlahan-lahan, dan setiap kali menemukan nun sukun atau tanwin, berhentilah dan sebutkan hukum mana dari empat hukum itu yang berlaku dan mengapa.",
  },
  {
    title: "Mim sukun",
    summary: "Ikhfa syafawi, idgham syafawi, dan izhar syafawi untuk mim mati.",
    explanation: [
      'Mim sukun adalah mim yang mati. Hukumnya hanya ada tiga, masing-masing disebut "syafawi" (berkaitan dengan bibir) karena mim diucapkan dengan bibir, dan mana yang berlaku hanya bergantung pada huruf yang mengikutinya.',
      "Idgham syafawi (peleburan bibir): ketika mim sukun diikuti mim lainnya, keduanya melebur menjadi satu mim yang ditekan disertai ghunnah.",
      "Ikhfa syafawi (penyamaran bibir): ketika diikuti huruf ba, mim disamarkan sedikit — bibir mendekat tetapi tidak sepenuhnya menutup — disertai ghunnah.",
      "Izhar syafawi (kejelasan bibir): sebelum huruf lain mana pun, mim diucapkan dengan jelas. Berhati-hatilah khususnya sebelum wau dan fa, di mana pembelajar lebih cenderung mengaburkannya.",
    ],
    practice:
      "Bacalah beberapa surah pendek dari Juz Amma dan tandai setiap mim sukun, sebutkan hukumnya sebelum membaca kata itu.",
  },
  {
    title: "Mad (pemanjangan)",
    summary: "Pemanjangan vokal asli, cabang, dan wajib.",
    explanation: [
      "Mad berarti memanjangkan bunyi sebuah vokal, dan ini terjadi pada tiga huruf mad — alif (ا), wau (و), dan ya (ي) — ketika mereka sendiri tidak berharakat dan mengikuti harakat kecil yang sejenis.",
      "Mad ashli (mad thabi'i) adalah pemanjangan dasar sekitar dua harakat, hadir di mana pun huruf mad muncul tanpa sebab khusus. Setiap qari memanjangkannya secara seragam.",
      "Mad far'i (mad cabang) muncul karena hamzah atau sukun yang mengikutinya dan dipanjangkan lebih lama — biasanya empat atau enam harakat. Panjang yang tepat bergantung pada jenis mad dan riwayat yang kamu ikuti.",
      "Karena berhenti di akhir kata bisa menghasilkan sukun, ini juga bisa memanjangkan mad — alasan lain untuk mempelajari panjang-panjang ini dengan mendengar dari guru yang mumpuni, bukan menebak-nebak.",
    ],
    practice:
      'Pilih sebuah surah pendek yang sudah dikenal dan hitung perlahan "1-2" untuk setiap mad thabi\'i dan "1-2-3-4" untuk setiap mad far\'i, jaga kecepatanmu tetap konsisten.',
  },
  {
    title: "Ghunnah",
    summary: "Dengung hidung dengan nun dan mim dalam idgham dan ikhfa.",
    explanation: [
      "Ghunnah adalah dengung yang dihasilkan dari hidung, yang merupakan sifat bawaan huruf nun (ن) dan mim (م). Dalam bacaan standar, dengung ini ditahan sekitar dua harakat.",
      "Ini wajib dan paling menonjol dalam beberapa hukum yang telah kamu temui: idgham ma'al ghunnah, ikhfa, iqlab, dan kapan pun ada tasydid pada nun atau mim.",
      "Bunyinya harus halus dan terkendali — ini bukan nyanyian atau senandung, melainkan dengung hidung yang stabil yang diukur sesuai panjang yang tepat.",
      "Uji sederhana: pencet hidungmu sedikit saat mengucapkan huruf berdengung; jika bunyinya berhenti, berarti dengungnya memang benar-benar dari hidung sebagaimana seharusnya.",
    ],
    practice:
      "Baca sebuah kata dengan tasydid pada nun atau mim, tahan ghunnah selama dua harakat yang konsisten, lalu rekam dirimu dan bandingkan dengan qari yang mumpuni.",
  },
  {
    title: "Qalqalah",
    summary: "Pantulan bergema pada qaf, tha, ba, jim, dal saat mati atau saat berhenti padanya.",
    explanation: [
      'Qalqalah adalah "pantulan" bergema yang ringan yang diberikan pada lima huruf — terhimpun dalam frasa "qathbu jadin", yaitu ق ط ب ج د — kapan pun huruf-huruf itu mati.',
      'Pantulan ini adalah getaran ringan pada titik keluarnya huruf; kamu tidak menambahkan harakat penuh setelah huruf itu, cukup biarkan ia "memantul" dengan bersih.',
      "Ia ringan (sughra) ketika huruf itu mati di tengah kata, dan lebih kuat serta jelas (kubra) ketika kamu berhenti pada huruf itu di akhir kata.",
      'Jagalah pantulan itu netral — jangan condongkan ke bunyi "a", "i", atau "u"; terlepas dari harakat di sekitarnya, ia tetap dengungan bersih yang sama.',
    ],
    practice:
      'Bacalah Surah Al-Ikhlas dan berhentilah dengan mantap pada setiap huruf qalqalah — dal pada "ahad" dan "yuulad" — rasakan pantulan bersih itu.',
  },
  {
    title: "Waqaf (berhenti)",
    summary: "Di mana berhenti, bernapas, dan bagaimana berhenti mengubah pelafalan.",
    explanation: [
      "Waqaf adalah seni tentang di mana dan bagaimana berhenti. Mushaf menunjukkan tempat-tempat berhenti dengan tanda-tanda kecil — misalnya mim untuk berhenti wajib, tha dan jim untuk berhenti yang diperbolehkan, dan laa yang berarti jangan berhenti di sini — untuk membimbing pembaca.",
      "Berhenti umumnya membisukan harakat terakhir, mengubah huruf terakhir menjadi sukun. Perubahan ini bisa memunculkan hukum lain, seperti qalqalah atau mad yang lebih panjang, sehingga sebuah kata bisa terdengar berbeda saat kamu berhenti dibanding saat kamu melanjutkan.",
      "Di mana kamu berhenti bisa memengaruhi makna, jadi jangan pernah berhenti di tengah kalimat sedemikian rupa hingga merusak makna. Satu kasus khusus adalah waqaf mu'anaqah (berhenti berpelukan), ditandai tiga titik, di mana kamu bisa berhenti di salah satu dari dua tempat tetapi tidak keduanya.",
      "Cara paling aman mempelajari waqaf yang benar adalah dengan menggunakan mushaf bertanda waqaf bersama guru yang mumpuni, sehingga tempat berhentimu sesuai dengan bacaan yang diwariskan.",
    ],
    practice:
      "Ambil satu halaman bertanda waqaf dan bacalah dengan suara keras mengikuti rekaman seorang guru tajwid, berhenti tepat di tempat yang ditunjukkan tanda-tanda itu.",
  },
];

export const QURAN_GUIDE_VOCABULARY_MS: DeepPartial<QuranGuideVocabEntry>[] = [
  {
    meaning:
      "Satu-satunya sesembahan yang benar — nama pribadi yang mencakup semua nama-nama-Nya yang indah.",
    frequency: "2.700+ kali",
    example: "Bismillah — dengan nama Allah",
    quranRef: {
      excerpt: "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.",
    },
  },
  {
    meaning:
      "Tuhan, pemilik, pemelihara — Dia yang menciptakan, memiliki, memelihara, dan mengatur.",
    frequency: "sangat sering",
    example: "Rabbana — Tuhan kami",
    quranRef: {
      excerpt: "Segala puji bagi Allah, Tuhan semesta alam.",
    },
  },
  {
    meaning: "Rahmat, kasih sayang, kelembutan — dari Allah dan di antara sesama makhluk.",
    frequency: "akar kata umum r-h-m",
    example: "Ar-Rahman, Ar-Rahim",
  },
  {
    meaning: "Taman, surga — tempat balasan yang abadi.",
    frequency: "sering",
    example: "Surga-surga yang mengalir sungai-sungai di bawahnya",
  },
  {
    meaning: "Api — merujuk kepada neraka, sebagai peringatan dan konsekuensi.",
    frequency: "sering",
    example: "Takutlah pada api yang disediakan bagi orang-orang kafir",
  },
  {
    meaning: "Iman, keyakinan, kepercayaan kepada Allah dan penerimaan risalah-Nya.",
    frequency: "sangat sering",
    example: "Wahai orang-orang yang beriman (yaa ayyuhal ladziina aamanuu)",
  },
  {
    meaning: "Kesabaran, keteguhan, ketabahan demi Allah.",
    frequency: "sering",
    example: "Sesungguhnya Allah beserta orang-orang yang sabar",
  },
  {
    meaning: "Syukur — pengakuan atas nikmat dengan hati, lisan, dan anggota badan.",
    frequency: "sering",
    example: "Jika kamu bersyukur, pasti akan Kutambah (nikmat) kepadamu",
  },
  {
    meaning:
      "Rasa takut kepada Allah, ketakwaan, menjaga diri dari dosa karena takut kepada Allah.",
    frequency: "sangat sering",
    example: "Sesungguhnya orang yang paling mulia di sisi Allah adalah yang paling bertakwa",
  },
  {
    meaning: "Rezeki, penghidupan — yang ditetapkan Allah bagi setiap jiwa.",
    frequency: "sering",
    example: "Dan Allah adalah sebaik-baik pemberi rezeki",
  },
  {
    meaning: "Cahaya — petunjuk, wahyu, dan penerangan hati.",
    frequency: "sering",
    example: "Allah (Pemberi) cahaya (kepada) langit dan bumi",
    quranRef: {
      excerpt: "Allah (Pemberi) cahaya (kepada) langit dan bumi…",
    },
  },
  {
    meaning:
      'Kehidupan dunia ini — secara harfiah kehidupan yang "lebih rendah/dekat". Dalam Al-Qur\\\'an, ini sementara dan sebuah ujian, berlawanan dengan akhirat yang kekal, dan bukan rumah sejati bagi orang beriman.',
    frequency: "sering",
    example: "Kehidupan dunia (al-hayaatud dunya) tidak lain hanyalah permainan dan senda gurau",
  },
  {
    meaning:
      "Akhirat — kehidupan abadi setelah kematian, termasuk kebangkitan, hisab, surga, dan neraka. Inilah kehidupan sejati dan kekal yang untuknya Al-Qur'an mendorong orang beriman berusaha.",
    frequency: "sering",
    example: "Dan sesungguhnya akhirat (al-aakhirah) itu lebih baik bagimu dan lebih kekal",
  },
  {
    meaning:
      "Shalat, rukun kedua Islam, ditunaikan lima kali sehari. Kata ini juga mengandung makna hubungan dan doa kepada Allah.",
    frequency: "sangat sering",
    example: "Dan dirikanlah shalat untuk mengingat-Ku (aqimish shalaata)",
  },
  {
    meaning:
      'Kitab atau catatan — sering merujuk pada Al-Qur\'an sendiri ("Kitab ini"), tetapi juga kitab-kitab yang diturunkan sebelumnya dan catatan amal. Berasal dari akar kata k-t-b, yaitu menulis.',
    frequency: "sangat sering",
    example: "Kitab (dzaalikal kitaab) ini tidak ada keraguan padanya",
  },
];

export const QURAN_GUIDE_LETTERS_MS: DeepPartial<QuranGuideLetter>[] = [
  {
    name: "Alif",
    pronunciation: 'vokal panjang /a/ seperti pada "father" (ketika berupa hamzah atau mad)',
  },
  {
    name: "Ba",
    pronunciation: 'seperti "b" dalam bahasa Indonesia',
  },
  {
    name: "Ta",
    pronunciation: 'seperti "t" dalam bahasa Indonesia',
  },
  {
    name: "Tsa",
    pronunciation: 'seperti "th" dalam bahasa Inggris pada "think"',
  },
  {
    name: "Jim",
    pronunciation: 'seperti "j" pada "jam"',
  },
  {
    name: "Ha (berat)",
    pronunciation: 'bunyi ha yang tajam dan berhembus dari tenggorokan — bukan "h" biasa',
  },
  {
    name: "Kha",
    pronunciation: 'seperti "ch" pada bahasa Skotlandia "loch" — gesekan di tenggorokan',
  },
  {
    name: "Dal",
    pronunciation: 'seperti "d" dalam bahasa Indonesia',
  },
  {
    name: "Dzal",
    pronunciation: 'seperti "th" dalam bahasa Inggris pada "this"',
  },
  {
    name: "Ra",
    pronunciation: '"r" yang bergulir/bergetar',
  },
  {
    name: "Za",
    pronunciation: 'seperti "z" dalam bahasa Indonesia',
  },
  {
    name: "Sin",
    pronunciation: 'seperti "s" dalam bahasa Indonesia',
  },
  {
    name: "Syin",
    pronunciation: 'seperti "sh" pada "ship"',
  },
  {
    name: "Shad",
    pronunciation: '"s" tebal (mufakhkham) — lidah terangkat, bunyi lebih penuh',
  },
  {
    name: "Dhad",
    pronunciation: '"d" tebal — khas bahasa Arab',
  },
  {
    name: "Tha (tebal)",
    pronunciation: '"t" tebal — diucapkan lebih dalam di mulut',
  },
  {
    name: "Zha (tebal)",
    pronunciation: 'versi tebal dari bunyi "dh"',
  },
  {
    name: "Ain",
    pronunciation:
      "penyempitan bersuara dari tengah tenggorokan — tidak ada padanan dalam bahasa Indonesia; pelajari dengan menirukan seorang qari",
  },
  {
    name: "Ghain",
    pronunciation: 'seperti "r" Prancis atau "gh" yang digelutur',
  },
  {
    name: "Fa",
    pronunciation: 'seperti "f" dalam bahasa Indonesia',
  },
  {
    name: "Qaf",
    pronunciation: '"k" yang dalam dari bagian paling belakang lidah — bukan "k" biasa',
  },
  {
    name: "Kaf",
    pronunciation: 'seperti "k" dalam bahasa Indonesia (lebih ke depan mulut)',
  },
  {
    name: "Lam",
    pronunciation: 'seperti "l" dalam bahasa Indonesia',
  },
  {
    name: "Mim",
    pronunciation: 'seperti "m" dalam bahasa Indonesia',
  },
  {
    name: "Nun",
    pronunciation: 'seperti "n" dalam bahasa Indonesia',
  },
  {
    name: "Ha (ringan)",
    pronunciation: '"h" lembut di akhir kata',
  },
  {
    name: "Wau",
    pronunciation: 'seperti "w" atau "u" panjang',
  },
  {
    name: "Ya",
    pronunciation: 'seperti "y" atau "i" panjang',
  },
];

export const QURAN_GUIDE_PRONUNCIATION_MS: DeepPartial<QuranGuidePronunciationPair>[] = [
  {
    title: "Ain vs Ha",
    tip: "Keduanya keluar dari tenggorokan tetapi berbeda bunyinya. Ain (ع) adalah penyempitan bersuara dari tengah tenggorokan — pita suara bergetar. Ha (ح) adalah gesekan kuat dan tak bersuara yang berhembus, seperti helaan napas berat tanpa getaran. Keduanya tidak ada dalam bahasa Indonesia, jadi pelajarilah dengan mendengar langsung dari seorang qari.",
  },
  {
    title: "Ha vs Kha",
    tip: 'Ha lebih tajam dan ringan; Kha lebih dalam dan lebih banyak gesekan — seperti "loch".',
  },
  {
    title: "Sin vs Shad",
    tip: 'Sin (س) adalah "s" yang ringan dan tipis seperti pada "see" dalam bahasa Inggris. Shad (ص) adalah kembarannya yang tebal dan mufakhkham: angkat bagian belakang lidah, bulatkan mulut sedikit, dan bunyinya menjadi lebih dalam. Mencampuradukkan keduanya bisa mengubah kata — sabr dibanding bacaan dengan s ringan.',
  },
  {
    title: "Dal vs Dhad",
    tip: 'Dal (د) adalah "d" biasa. Dhad (ض) adalah "d" tebal dan mufakhkham yang khas bahasa Arab — tekan tepi lidah ke gigi geraham atas dan biarkan bunyinya memenuhi mulut. Karena huruf khas inilah bahasa Arab juga disebut "lughatudh dhaad" (bahasa huruf dhad).',
  },
  {
    title: "Ta vs Tha (tebal)",
    tip: 'Tha yang mufakhkham lebih dalam; jangan menggantinya begitu saja dengan "t" biasa.',
  },
  {
    title: "Dzal vs Zha (tebal)",
    tip: 'Keduanya memiliki bunyi "dh"; Zha lebih tebal dan mufakhkham.',
  },
  {
    tip: 'Kaf (ك) adalah "k" dari depan mulut seperti pada "key" dalam bahasa Inggris. Qaf (ق) dibentuk dari jauh lebih belakang — bagian paling belakang lidah menyentuh langit-langit lunak, menghasilkan "k" yang dalam dari tenggorokan yang tidak memiliki padanan dalam bahasa Indonesia. Jagalah keduanya tetap terpisah: qalb (hati) bukan kalb (anjing).',
    title: "Kaf vs Qaf",
  },
  {
    title: "Ghain vs Kha",
    tip: "Ghain bersuara; Kha adalah gesekan tak bersuara.",
  },
];

export const QURAN_GUIDE_MEMORIZATION_PLANS_MS: DeepPartial<QuranGuideMemorizationPlan>[] = [
  {
    title: "Pemula — Juz Amma",
    summary:
      "Titik awal yang alami bagi semua orang. Mulailah dari surah-surah yang sangat pendek di bagian paling akhir mushaf — bergerak mundur dari An-Nas — yang mudah, cepat memberi pahala, dan berguna di setiap shalat.",
    surahs: ["An-Nas", "Al-Falaq", "Al-Ikhlas", "Al-Masad", "An-Nasr", "Al-Kafirun", "Al-Kautsar"],
    tip: "Hafalkan hanya satu ayat sehari: dengarkan seorang qari mengulanginya sekitar sepuluh kali, ulangi dengan suara keras hingga lancar, lalu sambungkan dengan yang sudah kamu miliki sebelum melanjutkan.",
  },
  {
    title: "Menengah — sepuluh surah inti",
    summary:
      "Ketika surah-surah pendek sudah kuat, ambillah surah-surah panjang yang disukai yang memiliki keutamaan besar dan sering dibaca pada hari Jumat serta malam hari — Al-Mulk, Ya-Sin, Ar-Rahman, Al-Waqi'ah, dan Al-Kahfi termasuk di antaranya.",
    surahs: [
      "Al-Fatihah",
      "Al-Mulk",
      "Ya-Sin",
      "Ar-Rahman",
      "Al-Waqi'ah",
      "Al-Kahfi",
      "Al-Jumu'ah",
      "Al-Hasyr",
    ],
    tip: "Kaitkan hafalan baru dengan waktu tetap harian — sesaat setelah Subuh yang tenang dan pikiran jernih adalah yang terbaik — sehingga konsistensi itu sendiri yang menanggung sebagian besar bebannya.",
  },
  {
    title: "Lanjut — satu juz",
    summary:
      "Berkomitmenlah menyelesaikan satu juz penuh sambil menjaga semua yang sebelumnya tetap benar-benar kuat. Banyak orang memulai dari juz 29 atau 30, yang surah-surahnya sudah sebagian mereka kenal, lalu meluas keluar juz demi juz.",
    surahs: ["Pilih satu juz — banyak yang memulai dari juz 29 atau 30 lalu melanjutkan"],
    tip: "Jangan pernah menambah bagian baru sampai yang lama sudah diulang dengan kuat. Nabi ﷺ memperingatkan bahwa Al-Qur'an yang dihafal lepas lebih cepat daripada unta yang terikat lepas dari talinya.",
  },
  {
    title: "Perjalanan Hafiz",
    summary:
      "Menghafal seluruh Al-Qur'an — sebuah kehormatan seumur hidup yang mengangkat derajat orang yang membawanya, dan dengan karunia Allah, juga orang tuanya. Ini adalah komitmen serius, biasanya membentang selama bertahun-tahun hafalan baru harian dan pengulangan yang teratur.",
    surahs: ["Seluruh mushaf — biasanya 3–7 tahun dengan pengulangan harian"],
    tip: "Jangan lakukan ini sendirian: gunakan pelacak hifz Munib untuk mengatur jadwal pengulanganmu, dan perdengarkan bacaanmu secara teratur kepada seorang hafiz atau guru yang mumpuni yang bisa menangkap dan membetulkan kesalahanmu.",
  },
];

export const QURAN_GUIDE_DAILY_LESSONS_MS: DeepPartial<QuranGuideDailyLesson>[] = [
  {
    translation:
      "Hai orang-orang yang beriman, jadikanlah sabar dan shalat sebagai penolongmu, sesungguhnya Allah beserta orang-orang yang sabar.",
    context:
      "Dari Surah Al-Baqarah, yang diturunkan di Madinah. Allah menggabungkan dua sumber kekuatan bagi orang beriman yang menghadapi kesulitan — ketabahan melalui kesabaran dan berpaling kepada shalat — dan menjanjikan kebersamaan khusus-Nya bagi mereka yang teguh.",
    reflection:
      "Ujian apa yang sedang kulalui saat ini di mana aku justru condong pada jalan keluar yang cepat, alih-alih pada kesabaran dan shalat yang diarahkan ayat ini kepadaku?",
    action:
      "Hari ini, kerjakan satu shalat tanpa tergesa-gesa, dan dalam sujudmu, mohonlah kesabaran kepada Allah dalam ujian tertentu yang sedang kamu lalui.",
  },
  {
    translation: "Rahmat-Ku meliputi segala sesuatu.",
    context:
      "Dari Surah Al-A'raf, diucapkan dalam konteks Musa AS dan kaumnya. Allah menggambarkan rahmat-Nya meliputi segala sesuatu — rahmat yang begitu luas hingga mendahului dan melampaui azab-Nya, yang khusus bagi mereka yang tetap teguh dalam kezaliman.",
    reflection:
      "Kesalahan siapa yang kutolak untuk kumaafkan, padahal aku sendiri sepenuhnya bergantung pada rahmat Allah yang tak terbatas?",
    action:
      "Pilihlah satu orang yang membuatmu kesal, maafkanlah ia hari ini dengan tulus, dan panjatkan doa singkat agar Allah juga memberinya petunjuk dan ampunan.",
  },
  {
    translation: "Jika kamu bersyukur, pasti akan Kutambah (nikmat) kepadamu.",
    context:
      "Dari Surah Ibrahim, bagian dari nasihat Musa AS kepada Bani Israil. Allah menghubungkan pertambahan nikmat-Nya langsung dengan rasa syukur — bersyukur atas suatu nikmat itulah yang membuatnya bertambah, sementara kufur nikmat mengundang berkurangnya.",
    reflection:
      "Nikmat Allah apa — kesehatanku, keluargaku, imanku, atau rezekiku — yang mulai kuanggap remeh dan biasa saja minggu ini?",
    action:
      'Malam ini sebelum tidur, ucapkan "Alhamdulillah" dengan suara keras atas tiga nikmat tertentu, sebutkan masing-masing agar syukurmu disadari, bukan otomatis.',
  },
  {
    translation: "Dan ucapkanlah kepada manusia perkataan yang baik.",
    context:
      "Dari Surah Al-Isra. Di tengah bimbingan tentang bagaimana orang beriman seharusnya bersikap, Allah memerintahkan agar kita berbicara kepada manusia — semua manusia — dengan cara yang terbaik, karena kata-kata kasar adalah salah satu pintu yang dimasuki setan untuk memecah belah.",
    reflection:
      'Menengok hari ini, apakah kata-kataku lebih banyak membangun atau melukai orang lain — dan apakah aku juga mengucapkan "perkataan yang baik" kepada mereka yang kuanggap sulit?',
    action:
      "Hari ini, berikan pujian atau ucapan terima kasih yang tulus kepada satu orang tanpa kritik yang tersembunyi, dan tahanlah satu kata kasar yang hampir kamu ucapkan.",
  },
  {
    translation:
      "Dan barangsiapa yang bertawakal kepada Allah, niscaya Allah akan mencukupkan (keperluan)nya.",
    context:
      "Dari Surah Ath-Thalaq, di tengah hukum tentang perceraian dan rezeki — tepat di mana orang paling cemas secara finansial. Di sana Allah berjanji akan memberi rezeki kepada siapa yang bertakwa dari arah yang tidak disangka-sangka, dan siapa yang bertawakal kepada-Nya akan mendapati-Nya mencukupi.",
    reflection:
      "Di mana aku membuat rencana yang hati-hati tetapi tidak melibatkan Allah di dalamnya — atau bersandar pada bantuan manusia tanpa pernah berpaling kepada-Nya dalam doa?",
    action:
      "Ambil satu keputusan yang sedang mengganggumu, kerjakan dua rakaat shalat istikharah atau berdoalah dengan tulus, lalu serahkan hasilnya kepada Allah.",
  },
  {
    translation: "Ya Tuhanku, tambahkanlah ilmu kepadaku.",
    context:
      "Dari Surah Thaha. Di seluruh Al-Qur'an, ini adalah satu-satunya hal yang Allah perintahkan kepada Nabi ﷺ untuk memintanya ditambahkan — ilmu — menunjukkan betapa berharganya ilmu yang bermanfaat dan bahwa siapa pun, seberapa pun luas ilmunya, tidak pernah selesai menuntutnya.",
    reflection:
      "Berapa banyak waktu luangku hari ini habis untuk menggulir tanpa henti, dan bisakah sebagian darinya dipakai untuk mempelajari satu ayat atau satu hadis?",
    action:
      'Hafalkan doa singkat "Rabbi zidnii \'ilman" ini, dan jadikan kebiasaan mengucapkannya setelah Subuh sebelum memulai harimu.',
  },
  {
    translation:
      "Perumpamaan orang yang membelanjakan hartanya di jalan Allah adalah seperti sebutir benih yang menumbuhkan tujuh bulir…",
    context:
      "Dari Surah Al-Baqarah. Allah melukiskan gambaran hidup tentang bagaimana sedekah bertumbuh: satu benih menghasilkan tujuh bulir, setiap bulir berisi seratus biji — balasan tujuh ratus kali lipat, dan Allah melipatgandakan lagi bagi siapa yang Dia kehendaki. Harta yang diberikan karena-Nya tidak pernah benar-benar hilang.",
    reflection:
      "Ketika aku memberi, apakah itu diam-diam karena Allah, atau aku mendapati diriku ingin dilihat orang lain dan dipuji karenanya?",
    action:
      "Hari ini, berikan sedekah kecil, dan jika memungkinkan, berikan secara diam-diam — agar itu murni antara kamu dan Allah.",
  },
];

export const QURAN_GUIDE_APPLY_CHALLENGES_MS: DeepPartial<QuranGuideApplyChallenge>[] = [
  {
    verseExcerpt: "Dan ucapkanlah kepada manusia perkataan yang baik.",
    challenge:
      "Lewati satu hari penuh tanpa mengucapkan satu pun kata kasar, sindiran, atau ejekan — sekalipun dalam candaan, sekalipun kamu dipancing.",
    habit:
      "Ketika amarah muncul, berhentilah sejenak sebelum menjawab dan pilihlah diam atau ucapan yang baik.",
  },
  {
    verseExcerpt: "Katakanlah kepada laki-laki yang beriman agar mereka menahan pandangannya…",
    challenge:
      "Hari ini, sengaja alihkan pandanganmu dari apa yang Allah haramkan — di layarmu, di berandamu, dan di tempat umum.",
    habit:
      "Setiap kali kamu menangkap dirimu melakukannya, alihkan momen itu ke lima menit membaca Al-Qur'an sebagai gantinya.",
  },
  {
    verseExcerpt: 'Janganlah engkau katakan kepada keduanya "ah"…',
    challenge:
      "Hari ini, bicaralah kepada seorang orang tua atau orang yang lebih tua dengan kelembutan dan kesabaran yang nyata, tanpa sedikit pun kekesalan — dan lakukan sesuatu untuk melayani mereka.",
    habit:
      "Jika mereka masih hidup, janjikan telepon atau kunjungan rutin; jika tidak, doakan mereka.",
  },
  {
    verseExcerpt: "Bergabunglah bersama orang-orang yang jujur.",
    challenge:
      "Lewati satu hari penuh dengan berkata jujur tanpa kebohongan kecil, tanpa berlebihan, dan tanpa ghibah — bahkan dalam bercanda.",
    habit:
      "Jika tergelincir, segera bertaubat dan perbaiki apa yang telah dirusak oleh kata-katamu.",
  },
  {
    verseExcerpt: "Allah beserta orang-orang yang sabar.",
    challenge:
      "Lain kali sesuatu membuatmu jengkel, tahan setiap kata kasar selama enam puluh detik penuh sebelum menjawab.",
    habit:
      "Kapan pun memungkinkan, ubahlah momen-momen kejengkelan menjadi dzikir atau dua rakaat shalat.",
  },
  {
    verseExcerpt: "Jika kamu bersyukur, akan Kutambah kepadamu.",
    challenge:
      "Hari ini, ucapkan terima kasih dengan menyebut nama kepada tiga orang berbeda atas suatu perbuatan tertentu yang mereka lakukan untukmu.",
    habit: "Akhiri setiap malam dengan mencatat satu nikmat — satu baris di buku harian Munib-mu.",
  },
  {
    verseExcerpt:
      "Dan barangsiapa memaafkan dan berbuat baik, maka pahalanya atas (tanggungan) Allah.",
    challenge:
      "Lepaskan satu dendam yang selama ini kamu pendam — setidaknya dalam hatimu sendiri, lepaskanlah dengan tulus.",
    habit: "Alih-alih terus mengenang luka itu, diam-diam doakan orang yang telah menzalimimu.",
  },
];

export const QURAN_GUIDE_TADABBUR_PROMPTS_MS: DeepPartial<QuranGuideTadabburPrompt>[] = [
  {
    question: "Apa yang Allah ajarkan kepadaku dalam ayat ini?",
    hint: "Baca ayat itu perlahan-lahan dan renungkan bagian-bagiannya: apakah Allah memberi perintah, peringatan, janji, atau menceritakan sebuah kisah? Nama-nama apa yang Dia gunakan, dan apa yang ditunjukkan nama itu tentang bagaimana Dia memperlakukan kita di sini?",
  },
  {
    question: "Bagaimana aku bisa mengamalkan ini hari ini dalam tindakan yang konkret?",
    hint: "Niat yang samar memudar; niat yang spesifik terwujud. Ubahlah ayat itu menjadi satu langkah yang bisa dilakukan — sebuah percakapan yang harus dilakukan, kebiasaan yang harus dimulai, pilihan yang harus diambil sebelum hari berakhir.",
  },
  {
    question: "Kebiasaan apa yang harus kuperbaiki atau kutinggalkan karena ayat ini?",
    hint: "Bawa ayat itu ke dalam rutinitas harianmu — tidurmu, ucapanmu, pengeluaranmu, shalatmu, hubunganmu. Yang mana dari semua itu yang secara diam-diam disentuh ayat ini?",
  },
  {
    question:
      "Apakah ayat ini membawaku pada harapan akan rahmat Allah atau pada rasa takut akan keadilan-Nya — dan mengapa keduanya sama-sama penting?",
    hint: "Orang beriman berjalan di antara khauf (takut akan azab Allah) dan raja' (harapan akan rahmat-Nya), seperti dua sayap. Renungkan yang mana dari keduanya yang diperkuat ayat ini dalam dirimu saat ini, dan yang mana yang lebih dibutuhkan hatimu.",
  },
  {
    question: "Bagaimana Nabi ﷺ menghayati ayat ini?",
    hint: 'Nabi ﷺ disebut sebagai "Al-Qur\\\'an yang berjalan". Lihatlah sirah dan tafsir yang otentik — Ibnu Katsir sering menyebutkan bagaimana beliau ﷺ mewujudkan sebuah ayat — dan jadikan teladannya sebagai contoh nyata.',
  },
  {
    question: "Doa apa yang digugah oleh ayat ini?",
    hint: "Biarkan ayat itu menjadi sebuah doa. Dalam sujudmu, dengan kata-katamu sendiri, mintalah kepada Allah segala yang digugah ayat ini dalam hatimu — perlindungan dari sebuah peringatan, bagian dari sebuah janji, atau taufik untuk menaati sebuah perintah.",
  },
];

export const QURAN_GUIDE_READING_LEVELS_MS: DeepPartial<QuranGuideReadingLevel>[] = [
  {
    title: "Alfabet Arab",
    summary:
      "Pelajari mengenali semua 28 huruf dalam bentuk tersendirinya dan mengenal masing-masing dengan namanya. Ini adalah pengenalan murni — melihat sebuah huruf dan langsung menyebutkan nama bunyinya — dan inilah fondasi tempat semua hal lainnya dibangun.",
    topics: ["Nama-nama huruf", "Bentuk dasar", "Arah kanan ke kiri"],
  },
  {
    title: "Bentuk huruf",
    summary:
      "Temukan bahwa sebagian besar huruf berubah bentuk sesuai posisinya — di awal, tengah, atau akhir kata — karena bahasa Arab tersambung seperti tulisan sambung. Pelajari beberapa huruf yang tidak pernah tersambung dengan huruf setelahnya.",
    topics: ["Tulisan sambung", "Huruf yang tidak tersambung", "Bentuk alif, wau, ya"],
  },
  {
    title: "Harakat",
    summary:
      "Kuasai tanda-tanda kecil yang memberi vokal pada setiap huruf: fathah (a), kasrah (i), dhammah (u), sukun tanpa vokal, tasydid yang menggandakan, dan akhiran tanwin. Tanda-tanda inilah yang mengubah huruf mati menjadi kata yang bisa dibaca.",
    topics: ["Harakat pendek", "Sukun", "Penggandaan tasydid", "Tanwin"],
  },
  {
    title: "Menggabungkan huruf",
    summary:
      'Satukan semuanya: rangkai huruf dan harakatnya menjadi suku kata dan kata-kata pendek, membaca dari kanan ke kiri. Kuasai aturan huruf syamsiyah dan qamariyah yang menentukan bagaimana "al" di awal kata dibaca.',
    topics: ["Pola huruf-harakat", "Awalan yang umum", "Huruf syamsiyah dan qamariyah"],
  },
  {
    title: "Membaca kata",
    summary:
      "Mulailah membaca kata-kata Al-Qur'an yang sesungguhnya secara perlahan dan tepat — dimulai dari kata-kata Bismillah dan Al-Fatihah yang kamu baca di setiap shalat — sehingga bacaan langsung terhubung dengan ibadah sejak awal.",
    topics: ["Kata-kata berfrekuensi tinggi", "Bismillah", "Kata-kata Al-Fatihah"],
  },
  {
    title: "Membaca ayat",
    summary:
      "Beralihlah ke ayat-ayat pendek yang lengkap dari Juz Amma, menambahkan kesadaran akan tajwid dasar dan tempat berhenti untuk bernapas (waqaf), selalu mengikuti bacaan seorang qari agar telingamu membimbing lisanmu.",
    topics: ["Surah-surah Juz Amma", "Tanda-tanda waqaf", "Mengikuti seorang qari"],
  },
  {
    title: "Bacaan lancar",
    summary:
      "Capai bacaan yang halus dan percaya diri di mana kaidah tajwid diterapkan secara alami. Pertahankan porsi harian dan teruslah diperiksa oleh guru atau qari yang mumpuni, karena kelancaran terasah melalui koreksi yang terus-menerus, bukan dicapai sekali lalu ditinggalkan.",
    topics: ["Porsi harian", "Penerapan kaidah tajwid", "Bimbingan guru"],
  },
];

export const QURAN_GUIDE_QUIZ_MS: DeepPartial<QuranGuideQuizQuestion>[] = [
  {
    prompt: "Ada berapa surah (bab) dalam Al-Qur'an?",
    options: ["99", "114", "124", "144"],
    explanation:
      "Al-Qur'an memiliki 114 surah, mulai dari tiga ayat hingga 286 ayat. Urutannya dalam mushaf ditetapkan (tawqifi) oleh wahyu.",
  },
  {
    prompt:
      "Menjadi berapa bagian sama besar (juz) Al-Qur'an dibagi untuk memudahkan bacaan harian?",
    options: ["7", "12", "30", "60"],
    explanation:
      "Tiga puluh juz. Membaca satu juz setiap hari menyelesaikan seluruh Al-Qur'an dalam sebulan — cara klasik untuk khatam saat Ramadhan.",
  },
  {
    prompt: "Surah manakah yang terpanjang dalam Al-Qur'an, dengan 286 ayat?",
    options: ["Al-Fatihah", "Al-Baqarah", "Ya-Sin", "An-Nas"],
    explanation:
      "Surah Al-Baqarah adalah yang terpanjang, dengan 286 ayat. Ini adalah surah Madani yang kaya akan hukum dan bimbingan.",
  },
  {
    prompt: "Benar atau salah: surah Makki adalah surah yang diturunkan sebelum hijrah ke Madinah.",
    options: ["Benar", "Salah"],
    explanation:
      "Surah Makki diturunkan sebelum Hijrah dan sering berfokus pada akidah dan tauhid; surah Madani diturunkan setelahnya dan sering menambahkan hukum serta bimbingan komunitas.",
  },
  {
    prompt:
      "Surah manakah yang memuat ayat-ayat pertama yang diturunkan kepada Nabi ﷺ di Gua Hira?",
    options: ["Al-Fatihah", "Al-Alaq (Iqra)", "Al-Baqarah", "Al-Ikhlas"],
    explanation:
      'Wahyu pertama adalah ayat-ayat awal Surah Al-Alaq (96): "Iqra — Bacalah, dengan (menyebut) nama Tuhanmu yang menciptakan."',
  },
  {
    prompt: "Al-Qur'an diturunkan selama kira-kira berapa tahun?",
    options: ["3 tahun", "10 tahun", "23 tahun", "40 tahun"],
    explanation:
      "Al-Qur'an diturunkan secara bertahap selama kurang lebih 23 tahun — 13 tahun di Makkah dan 10 tahun di Madinah — sebagai respons atas peristiwa dan kebutuhan.",
  },
  {
    prompt:
      "Benar atau salah: penurunan Al-Qur'an dimulai pada bulan Ramadhan, pada malam Lailatul Qadar.",
    options: ["Benar", "Salah"],
    explanation:
      "Allah berfirman bahwa Al-Qur'an diturunkan pada bulan Ramadhan (2:185) pada malam kemuliaan (97:1). Mencari malam itu memiliki keutamaan besar.",
  },
  {
    prompt: "Surah manakah yang dibaca di setiap rakaat shalat harian?",
    options: ["Al-Ikhlas", "Al-Fatihah", "Al-Kautsar", "An-Nasr"],
    explanation:
      'Surah Al-Fatihah — tujuh ayat — dibaca di setiap rakaat shalat. "Tidak sah shalat seseorang yang tidak membaca Ummul Kitab (Al-Fatihah)."',
  },
  {
    prompt: 'Surah manakah satu-satunya yang tidak dimulai dengan "Bismillahir Rahmanir Rahim"?',
    options: ["Al-Fatihah", "At-Taubah", "Al-Ikhlas", "An-Nas"],
    explanation:
      "Surah At-Taubah (9) adalah satu-satunya surah yang tidak dimulai dengan basmalah.",
  },
  {
    prompt: "Kaidah mad dalam tajwid mengendalikan apa?",
    options: [
      "Melebur dua huruf menjadi satu",
      "Memanjangkan bunyi sebuah harakat",
      "Pantulan bergema pada huruf tertentu",
      "Di mana berhenti dan bernapas",
    ],
    explanation:
      "Mad berarti memanjangkan bunyi vokal pada huruf-huruf mad — alif (ا), wau (و), dan ya (ي) — hingga sejumlah harakat tertentu.",
  },
  {
    prompt:
      "Qalqalah adalah pantulan bergema ringan yang diberikan pada kumpulan huruf apa saja ketika huruf itu mati?",
    explanation:
      'Lima huruf qalqalah terhimpun dalam frasa "qathbu jadin" — ق ط ب ج د — yang diberi pantulan bersih ketika mati.',
  },
  {
    prompt: 'Kata Al-Qur\\\'an yang sering muncul, "Rabb", berarti:',
    options: ["Rahmat", "Tuhan, pemilik, pemelihara", "Kitab", "Taman"],
    explanation:
      'Rabb berarti Tuhan, pemilik, dan pemelihara — Dia yang menciptakan, memiliki, memelihara, dan mengatur. "Rabbana" berarti "Tuhan kami".',
  },
  {
    prompt: 'Kata "jannah" merujuk pada:',
    options: ["Api", "Taman surga", "Shalat", "Puasa"],
    explanation:
      'Jannah berarti taman — tempat balasan yang abadi, "surga-surga yang mengalir sungai-sungai di bawahnya".',
  },
  {
    prompt: "Nabi manakah yang bersama putranya Ismail membangun fondasi Ka'bah di Makkah?",
    options: ["Nuh", "Musa", "Ibrahim", "Yusuf"],
    explanation:
      'Ibrahim (Khalilullah, kekasih Allah) dan Ismail membangun Ka\'bah, sambil berdoa "Ya Tuhan kami, terimalah dari kami" (2:127).',
  },
  {
    prompt:
      "Nabi manakah yang berbicara langsung dengan Allah, menghadapi Fir'aun, dan membawa Bani Israil melintasi laut yang terbelah?",
    options: ["Isa", "Musa", "Adam", "Yunus"],
    explanation:
      "Musa (Kalimullah) berbicara dengan Allah, diutus kepada Fir'aun, dan laut terbelah atas perintah Allah agar kaumnya menyeberang dengan selamat.",
  },
  {
    prompt:
      "Surah atau bagian pendek manakah yang akan kamu niatkan untuk dipahami dan dihafal selanjutnya, insya Allah?",
    explanation:
      "Langkah-langkah kecil yang konsisten membangun hubungan seumur hidup dengan Kitab Allah. Pilih bagianmu, pelajari maknanya, dan ulangi sesering mungkin.",
  },
];
