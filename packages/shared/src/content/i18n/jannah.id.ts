import type {
  JannahDuaEntry,
  JannahGate,
  JannahPromisedEntry,
  JannahTopic,
  JannahVerseEntry,
} from "../../types/jannah";
import type { DeepPartial } from "./localize";

// Indonesian translation overlay for the Learn "Journey to Jannah" content. Mirrors
// the order of JANNAH_TOPICS / JANNAH_GATES / JANNAH_VERSES / JANNAH_PROMISED /
// JANNAH_DUAS in ../jannah.ts (index-aligned); untranslated entries fall back to
// English. Only human-readable text is translated — ids, routes, duaIds,
// surah/ayah numbers, collections, citations, grades and verse-reference labels
// stay in the English source.

export const JANNAH_TOPICS_ID: DeepPartial<JannahTopic>[] = [
  {
    // about — What is Jannah?
    title: "Apa itu Jannah?",
    summary: "Taman abadi yang Allah siapkan bagi orang-orang yang saleh.",
    body: [
      "Jannah (Surga) adalah tempat tinggal kekal penuh ganjaran yang Allah siapkan bagi mereka yang beriman kepada-Nya dan beramal saleh. Secara bahasa, kata ini berarti taman yang rimbun dan teduh — tetapi Al-Qur'an menggunakannya untuk sebuah kenyataan yang jauh lebih agung daripada taman mana pun di bumi: sebuah alam berisi sungai-sungai, buah-buahan, istana, dan kebersamaan, tempat orang beriman hidup selamanya dalam keridaan Tuhannya. Inilah tujuan yang diserukan oleh setiap nabi, dan inilah destinasi yang menjadi inti seluruh perjalanan ini.",
      "Kehidupan di Jannah berbeda dari segala sesuatu di dunia ini karena ia bebas dari setiap cacat yang merusak kebahagiaan duniawi. Tidak ada kematian, tidak ada penyakit, tidak ada penuaan, tidak ada rasa takut, tidak ada kesedihan, dan tidak ada keletihan. Penghuninya tidak pernah bertengkar, tidak pernah lelah, dan tidak pernah kehilangan yang mereka cintai. Apa pun yang diinginkan hati akan dikabulkan, dan Allah bahkan menambahkan lebih banyak lagi dari kemurahan-Nya — 'Mereka memperoleh di dalamnya apa yang mereka kehendaki, dan pada sisi Kami ada tambahannya' (Qur'an 50:35).",
      "Kenikmatan Surga berada di luar jangkauan imajinasi manusia. Dalam sebuah hadis qudsi, Allah berfirman bahwa Dia telah menyiapkan bagi hamba-hamba-Nya yang saleh apa yang belum pernah dilihat mata, belum pernah didengar telinga, dan belum pernah terlintas di hati manusia. Karena itulah Al-Qur'an menggambarkan Surga dengan citra yang familiar — taman-taman, sungai-sungai, dan naungan — sembari mengingatkan bahwa kenyataannya jauh melampaui setiap penggambaran. Ganjaran terbesar dari semuanya bukanlah taman-taman itu sendiri, melainkan keridaan Allah, dan bagi yang berderajat tertinggi, kehormatan memandang wajah-Nya yang mulia.",
      "Seorang mukmin harus memegang dua kebenaran sekaligus. Pertama, Surga itu nyata, dekat, dan layak diperjuangkan dengan segenap usaha — Al-Qur'an memerintahkan kita untuk 'berlomba-lomba' menujunya (Qur'an 3:133). Kedua, tidak ada seorang pun yang meraih Surga semata-mata dengan amalnya; masuknya pada akhirnya adalah karena rahmat Allah, dengan iman yang tulus dan amal saleh sebagai sarana yang Dia pilih untuk diterima. Keseimbangan ini menjaga harapan tetap hidup tanpa menumbuhkan kesombongan: kita berusaha sekuat tenaga, lalu menyerahkan diri sepenuhnya pada rahmat-Nya.",
      "Secara praktis, biarkan kenyataan tentang Jannah membentuk pilihan harianmu. Ketika ibadah terasa berat atau godaan terasa kuat, ingatlah apa yang menanti dan apa yang dipertaruhkan. Mintalah Surga kepada Allah dengan sering, berusahalah untuknya secara konsisten dengan cara-cara kecil yang berkelanjutan, dan biarkan kerinduan padanya melembutkan hatimu dalam kehidupan yang fana ini.",
    ],
    quran: [
      {
        excerpt:
          "Bukanlah menghadapkan wajahmu ke arah timur dan barat itu suatu kebajikan, akan tetapi sesungguhnya kebajikan itu ialah beriman kepada Allah, hari kemudian, malaikat-malaikat, kitab-kitab, nabi-nabi…",
      },
      {
        excerpt:
          "Allah menjanjikan kepada laki-laki dan perempuan yang mukmin, (akan mendapat) surga yang di bawahnya mengalir sungai-sungai, kekal mereka di dalamnya, dan (mendapat) tempat-tempat yang bagus di surga 'Adn. Dan keridaan Allah adalah lebih besar.",
      },
      {
        excerpt:
          "Seorang pun tidak mengetahui berbagai nikmat yang menyenangkan hati yang disembunyikan (untuk mereka) sebagai balasan atas apa yang telah mereka kerjakan.",
      },
      {
        excerpt:
          "Mereka memperoleh di dalamnya apa yang mereka kehendaki, dan pada sisi Kami ada tambahannya.",
      },
      {
        excerpt:
          "Sesungguhnya orang-orang yang beriman dan beramal saleh, bagi mereka adalah surga Firdaus menjadi tempat tinggal.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah berfirman: Aku telah menyiapkan bagi hamba-hamba-Ku yang saleh apa yang belum pernah dilihat mata, belum pernah didengar telinga, dan belum pernah terlintas di hati manusia.",
      },
      {
        excerpt:
          "Allah Yang Mahatinggi berfirman: Aku telah menyiapkan bagi hamba-hamba-Ku yang saleh apa yang belum pernah dilihat mata, belum pernah didengar telinga, dan belum pernah sama sekali terlintas di hati manusia.",
      },
    ],
    appLinks: [{ label: "Meminta Al-Firdaus" }, { label: "Zikir pagi & petang" }],
  },
  {
    // ranks — Ranks in Paradise
    title: "Tingkatan di Surga",
    summary: "Surga memiliki banyak derajat — bukan tangga tetap berjumlah tujuh.",
    body: [
      "Surga bukanlah satu tempat datar yang seragam; ia memiliki banyak derajat, disebut darajat, dan orang-orang beriman diangkat di dalamnya sesuai dengan iman dan amal mereka. Salah satu kesalahpahaman yang sangat umum adalah bahwa Jannah memiliki tepat tujuh tingkatan. Ini mencampuradukkan dua hal yang berbeda: Al-Qur'an berbicara tentang tujuh langit (samawat) — lapisan langit yang diciptakan di atas kita — bukan tujuh tingkatan tetap Surga. Nas-nas tidak pernah membatasi Jannah pada tujuh derajat.",
      "Apa yang diberitahukan sumber-sumber sahih kepada kita adalah bahwa derajat-derajat itu sangat banyak dan luas. Nabi ﷺ bersabda bahwa Surga memiliki seratus tingkat yang Allah siapkan bagi orang-orang yang berjuang di jalan-Nya, dan jarak antara satu tingkat dengan tingkat berikutnya bagaikan jarak antara langit dan bumi. Bahkan angka ini menunjuk pada keluasan, bukan pada tangga kaku yang bisa kita daki dengan mencentang daftar.",
      "Allah mengangkat setiap mukmin sesuai dengan kekuatan imannya, ketulusan niatnya, dan bobot amalnya — 'Dan masing-masing orang memperoleh derajat-derajat (seimbang) dengan apa yang dikerjakannya' (Qur'an 6:132). Derajat pasti yang dicapai setiap orang hanya diketahui oleh Allah. Wahyu dengan sengaja tidak memberi kita daftar mekanis 'lakukan amal X untuk mencapai tingkat N', karena ibadah dimaksudkan untuk didorong oleh cinta dan keikhlasan, bukan dengan menghitung derajat.",
      "Hikmah di balik ini sungguh indah. Jika kita mengetahui posisi kita secara pasti, sebagian akan menjadi lengah dan sebagian lagi akan berputus asa. Sebaliknya, kita diajarkan untuk terus memandang kepada Allah, terus berusaha, dan terus berharap. Orang beriman berlomba dalam kebaikan — 'maka hendaklah orang yang berlomba-lomba berlomba dalam hal ini' — sambil menyerahkan penilaian akhir kepada Yang Mahaadil.",
      "Maka daripada membidik tingkatan bernomor, bidiklah yang tertinggi dan biarkan Allah menempatkanmu di mana Dia kehendaki. Nabi ﷺ mengajarkan para sahabat untuk tidak puas dengan permintaan yang biasa-biasa saja, tetapi meminta secara khusus Al-Firdaus, puncak tertinggi Surga.",
    ],
    quran: [
      {
        excerpt:
          "Dan masing-masing orang memperoleh derajat-derajat (seimbang) dengan apa yang dikerjakannya.",
      },
      {
        excerpt:
          "Perhatikanlah bagaimana Kami lebihkan sebagian dari mereka atas sebagian (yang lain). Dan sesungguhnya kehidupan akhirat lebih tinggi tingkatnya dan lebih besar keutamaannya.",
      },
      {
        excerpt:
          "Dan barang siapa yang menaati Allah dan Rasul-Nya, mereka itu akan bersama-sama dengan orang-orang yang dianugerahi nikmat oleh Allah, yaitu para nabi, para siddiqin, orang-orang yang mati syahid, dan orang-orang saleh. Dan mereka itulah teman yang sebaik-baiknya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Surga memiliki seratus tingkat yang Allah siapkan bagi orang-orang yang berjuang di jalan-Nya. Jarak antara setiap dua tingkat bagaikan jarak antara langit dan bumi. Maka apabila kalian meminta kepada Allah, mintalah Al-Firdaus, karena ia adalah bagian Surga yang terbaik dan tertinggi.",
      },
      {
        excerpt:
          "Apabila kalian meminta kepada Allah, mintalah Al-Firdaus, karena ia adalah bagian Surga yang tertinggi dan pertengahan Surga, dan darinyalah mengalir sungai-sungai Surga, dan di atasnya adalah Arsy Yang Maha Pengasih.",
      },
    ],
    appLinks: [{ label: "Minta Al-Firdaus" }],
  },
  {
    // al-firdaws
    title: "Al-Firdaus — yang tertinggi",
    summary: "Puncak Surga, paling dekat dengan Arsy.",
    body: [
      "Al-Firdaus adalah tingkatan Surga yang tertinggi dan paling utama yang disebutkan dalam Sunnah yang sahih. Nabi ﷺ menggambarkannya sebagai yang terbaik dari Surga dan pertengahannya — jantungnya yang sejati — tempat mengalirnya sungai-sungai Surga, dan di atasnya adalah Arsy Yang Maha Pengasih. Mencapai Al-Firdaus berarti berada sedekat mungkin dengan Allah sebagaimana makhluk ciptaan bisa capai.",
      "Yang membuat topik ini begitu praktis adalah sebuah tuntunan kenabian: ketika kita berdoa memohon Surga, kita tidak boleh membidik rendah. Nabi ﷺ mengajarkan para sahabat bahwa ketika mereka meminta Surga kepada Allah, mereka hendaknya meminta secara khusus Al-Firdaus, bukannya puas dengan permintaan yang lebih rendah. Kemurahan Allah tidak terbatas, sehingga merupakan suatu kekurangan jika kita hanya meminta yang minimal dari-Nya. Ini mengajarkan kita keberanian bercita-cita tinggi dalam ibadah: bidiklah puncaknya, dan biarkan Allah, dengan rahmat-Nya, memutuskan di mana menempatkanmu.",
      "Bagaimana seorang hamba menjadi layak untuk derajat seperti itu? Sarana-sarananya sama dengan sarana yang mengantar menuju Surga itu sendiri, ditempuh dengan keunggulan: akidah yang benar (tauhid) yang dipegang dengan tulus, pemenuhan yang cermat atas kewajiban-kewajiban yang Allah perintahkan, kemudian kehidupan ibadah sunah yang terus bertambah di atasnya — salat malam, puasa tambahan, zikir, sedekah, dan akhlak yang baik. Dalam sebuah hadis qudsi yang terkenal, Allah menggambarkan bagaimana hamba terus mendekat kepada-Nya melalui amalan-amalan sunah hingga Allah mencintainya.",
      "Namun anugerah terakhir dan penentu selalu adalah rahmat Allah. Dalam napas yang sama saat kita membidik yang tertinggi, kita mengingat sabda Nabi ﷺ sendiri: tidak seorang pun masuk Surga semata-mata karena amalnya — bahkan Nabi ﷺ sendiri pun tidak — kecuali bahwa Allah menyelimutinya dengan rahmat-Nya. Inilah keseimbangan sempurna yang dipegang orang beriman: harapan dan cita-cita yang tinggi di satu sisi, kerendahan hati yang tulus di sisi lain.",
      "Maka jadikanlah Al-Firdaus bagian tetap dari doamu — dalam sujud, di sepertiga malam terakhir, dan sebelum tidur — sementara engkau diam-diam berusaha sebaik mungkin setiap hari dan bersandar sepenuhnya pada rahmat Tuhanmu untuk selebihnya.",
    ],
    hadith: [
      {
        excerpt:
          "Apabila kalian meminta kepada Allah, mintalah Al-Firdaus, karena ia adalah bagian Surga yang tertinggi dan pertengahan Surga, dan darinyalah mengalir sungai-sungai Surga, dan di atasnya adalah Arsy Yang Maha Pengasih.",
      },
      {
        excerpt:
          "Tidak seorang pun di antara kalian yang masuk Surga semata-mata karena amalnya. Para sahabat bertanya: Tidak juga engkau, wahai Rasulullah? Beliau bersabda: Tidak juga aku, kecuali bahwa Allah menyelimutiku dengan rahmat-Nya.",
      },
    ],
    actions: [
      "Mintalah Al-Firdaus kepada Allah dalam doamu, terutama saat sujud dan sebelum tidur.",
      "Sempurnakan apa yang wajib atasmu, lalu perbanyak ibadah sunah.",
      "Perbarui tobat dengan sering, dan bersandarlah pada rahmat Allah, bukan semata pada amalmu.",
    ],
    appLinks: [{ label: "Doa-doa Surga" }, { label: "Zikir pagi & petang" }],
  },
  {
    // warnings
    title: "Apa yang membahayakan akhirat",
    summary: "Dosa besar memerlukan tobat yang tulus; ampunan Allah sangat luas.",
    body: [
      "Bagian ini tidak dimaksudkan untuk menakutimu hingga putus asa — justru sebaliknya. Allah mengampuni semua dosa bagi orang yang kembali kepada-Nya dengan tulus, dan Dia menyatakannya dengan kata-kata paling tegas: 'Katakanlah: Wahai hamba-hamba-Ku yang melampaui batas terhadap diri mereka sendiri, janganlah kamu berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni dosa-dosa semuanya' (Qur'an 39:53). Tujuan di sini hanyalah untuk mengetahui apa yang diperingatkan oleh nas-nas, agar kita mengenali bahaya dan segera kembali kepada-Nya sebelum terlambat.",
      "Ada satu dosa yang berdiri terpisah dari semua yang lain: syirik — menyekutukan sesuatu dengan Allah dalam ibadah. Ini adalah satu-satunya dosa yang tidak akan Allah ampuni jika seseorang meninggal dalam keadaan itu tanpa bertobat, sebagaimana Dia nyatakan dengan jelas dalam Qur'an 4:48. Segala sesuatu yang lain termasuk dalam 'Dia mengampuni apa (dosa) yang selain dari (syirik) itu, bagi siapa yang dikehendaki-Nya'. Inilah sebabnya tauhid yang benar adalah fondasi di bawah setiap amal yang diterima: rumah yang dibangun di atas fondasi retak tidak dapat berdiri.",
      "Setelah syirik, nas-nas memberikan bobot khusus pada meninggalkan salat. Mengabaikan lima waktu salat secara terus-menerus dan tanpa uzur yang sah termasuk di antara peringatan-peringatan paling berat dalam Sunnah — Nabi ﷺ menyebut salat sebagai perjanjian yang membedakan orang beriman, sedemikian rupa sehingga meninggalkannya mendekati kekufuran. Dosa-dosa besar lainnya — pembunuhan yang tidak sah, hubungan yang tidak halal, memakan riba, memakan harta anak yatim, dan kezaliman yang berat — adalah perkara serius yang memerlukan tobat yang tulus dan dapat mendatangkan hukuman jika Allah tidak mengampuni.",
      "Dosa-dosa yang disebut 'kecil' pun penting dan tidak boleh pernah dianggap remeh. Gibah, dusta, kesombongan, memutus silaturahmi, dan kelalaian perlahan-lahan mengikis hati dan akhlak. Nabi ﷺ memperingatkan bahwa dosa-dosa kecil yang menumpuk dapat membinasakan seseorang sebagaimana ranting-ranting kecil yang dikumpulkan dapat memasak satu hidangan penuh. Masing-masing memerlukan kembali kepada Allah tersendiri.",
      "Intinya adalah harapan dalam tindakan: jangan pernah biarkan besarnya suatu dosa meyakinkanmu bahwa tobat itu sia-sia. Kembalilah kepada Allah begitu engkau tergelincir, ikuti perbuatan buruk dengan perbuatan baik untuk menghapusnya, dan jagalah pintu istigfar terbuka setiap hari. Rahmat-Nya selalu lebih besar daripada kesalahanmu.",
    ],
    quran: [
      {
        excerpt:
          "Sesungguhnya Allah tidak akan mengampuni dosa syirik, dan Dia mengampuni segala dosa yang selain dari (syirik) itu, bagi siapa yang dikehendaki-Nya.",
      },
      {
        excerpt:
          "Katakanlah: Wahai hamba-hamba-Ku yang melampaui batas terhadap diri mereka sendiri, janganlah kamu berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni dosa-dosa semuanya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Perjanjian antara kami dan mereka adalah salat; barang siapa meninggalkannya, ia telah kafir.",
      },
    ],
    appLinks: [{ label: "Pelacak Salah" }, { label: "Qaza & mengganti ibadah yang terlewat" }],
    disclaimer:
      "Daftar dosa besar dalam fikih berbeda-beda antar ulama, dan penilaian atas individu adalah wewenang orang yang berilmu. Ini adalah pengingat umum untuk bertobat — bukan vonis pribadi. Konsultasikan situasimu dengan ulama yang tepercaya.",
  },
  {
    // promised — Those honoured in the texts
    title: "Mereka yang dimuliakan dalam nas",
    summary: "Orang-orang dan kelompok yang disebutkan Nabi ﷺ berkaitan dengan Surga.",
    body: [
      "Al-Qur'an dan Sunnah menonjolkan individu-individu tertentu, kategori-kategori orang beriman, dan amal-amal tertentu yang dikaitkan dengan kabar gembira Surga. Penting untuk memahami ini dengan benar: ini adalah kabar yang jujur tentang orang-orang atau sifat-sifat tertentu tersebut — bukan jaminan yang dapat dipindahkan kepada siapa pun yang sekadar mendengar nama mereka atau mengaguminya. Kabar gembira itu bergantung pada iman dan amal mereka, dan pintu yang sama terbuka bagi kita melalui sarana yang sama.",
      "Kelompok paling terkenal adalah Sepuluh yang Dijanjikan Surga (al-'Asyrah al-Mubasysyarah), disebutkan bersama oleh Nabi ﷺ dalam satu riwayat: Abu Bakar, Umar, Utsman, Ali, Thalhah, Zubair, Abdurrahman bin Auf, Sa'ad bin Abi Waqqash, Sa'id bin Zaid, dan Abu Ubaidah bin Al-Jarrah (semoga Allah meridai mereka semua). Mereka adalah sahabat Nabi ﷺ yang paling dekat dan paling banyak berkorban, dan Ahlus Sunnah mencintai serta memuliakan mereka semua tanpa berlebihan atau merendahkan siapa pun di antara mereka.",
      "Di luar individu-individu yang disebutkan namanya, nas-nas menggambarkan kategori-kategori yang diberi kabar gembira: orang-orang yang jujur dan sabar, mereka yang mati sebagai syahid sejati di jalan Allah sesuai syariat Islam, dan mereka yang kata-kata terakhirnya dalam hidup ini adalah kalimat tauhid, la ilaha illallah. Setiap sifat menunjuk pada suatu kenyataan batin — keikhlasan, pengorbanan, atau hati yang terpaut kepada Allah pada napas terakhir — bukan sekadar label lahiriah.",
      "Pelajaran bagi kita bukanlah merasa aman karena keterkaitan, ataupun mengklaim derajat-derajat ini untuk diri kita sendiri, melainkan agar terinspirasi. Biarkan teladan mereka menarik kita ke atas: cintailah apa yang mereka cintai, berjuanglah sebagaimana mereka berjuang, dan ubahlah kekaguman itu menjadi doa dan amal, memohon di atas segalanya kepada Allah husnul khatimah — akhir yang baik.",
    ],
    hadith: [
      {
        excerpt:
          "Abu Bakar di Surga, Umar di Surga, Utsman di Surga, Ali di Surga, Thalhah di Surga, Zubair di Surga, Abdurrahman bin Auf di Surga, Sa'ad di Surga, Sa'id bin Zaid di Surga, dan Abu Ubaidah bin Al-Jarrah di Surga.",
      },
      {
        excerpt:
          "Barang siapa yang kata-kata terakhirnya adalah 'Tiada tuhan selain Allah' akan masuk Surga.",
      },
    ],
    disclaimer:
      "Kabar gembira dalam hadis merujuk pada mereka yang disebutkan namanya atau kategori yang digambarkan. Ini tidak menggantikan kebutuhan akan iman, amal, dan akhir yang baik bagi diri seseorang. Allah yang paling mengetahui.",
  },
  {
    // tawheed
    title: "Tauhid — akidah yang benar",
    summary: "Tidak ada amal yang diterima tanpa tauhid yang tulus.",
    body: [
      "Tauhid berarti mengesakan Allah semata dalam ibadah — meyakini bahwa hanya Dia Tuhan dan Pencipta, hanya Dia yang berhak disembah, dan bahwa Dia Maha Esa dalam nama-nama dan sifat-sifat-Nya. Inilah pesan yang dibawa oleh setiap nabi dan hal pertama yang menjadi pintu masuk seseorang ke dalam Islam. Karena ini menyangkut Zat yang kita sembah, inilah fondasi tempat seluruh bangunan agama berdiri.",
      "Kepentingannya tidak dapat dilebih-lebihkan: Allah tidak menerima amal apa pun dari orang yang menyekutukan-Nya. 'Jika kamu mempersekutukan (Allah), niscaya akan hapuslah amalmu' (Qur'an 39:65). Gunungan amal saleh yang dibangun di atas syirik tidak memiliki bobot sama sekali pada Hari Kiamat, sementara amal terkecil yang dibangun di atas tauhid yang murni bisa menjadi sangat berat. Inilah sebabnya menjaga akidah bahkan lebih mendesak daripada memperbanyak amal.",
      "Tauhid juga menuntut keikhlasan, disebut ikhlas — bahwa kita menyembah Allah 'dengan memurnikan ketaatan kepada-Nya dalam (menjalankan) agama' (Qur'an 98:5). Bahaya tersembunyi di sini adalah riya, yaitu beribadah untuk dilihat dan dipuji orang. Nabi ﷺ memperingatkan bahwa riya yang tersembunyi pun dapat diam-diam merusak sebuah amal. Obatnya adalah terus-menerus memperbarui niat: sebenarnya untuk siapa aku melakukan ini? Keikhlasan adalah yang mengubah amal biasa menjadi ibadah yang berharga.",
      "Hikmah menjadikan tauhid sebagai fondasi adalah bahwa ia membebaskan hati. Orang yang menyembah Allah semata dibebaskan dari rasa takut kepada makhluk, dari mengejar restu semua orang, dan dari keletihan melayani banyak tuan. Hidupnya memperoleh satu arah yang jelas: meridakan Yang menciptakannya.",
      "Secara praktis, pelajarilah akidah yang benar dari ulama yang tepercaya, murnikan ibadahmu dari syirik dan kemunafikan, dan periksalah niatmu sebelum bertindak. Langkah pertama ini bukan opsional atau lanjutan — di sinilah setiap jalan menuju Surga dimulai.",
    ],
    quran: [
      {
        excerpt:
          "Dan sesungguhnya telah diwahyukan kepadamu dan kepada (nabi-nabi) yang sebelummu: Jika kamu mempersekutukan (Allah), niscaya akan hapuslah amalmu dan tentulah kamu termasuk orang-orang yang merugi.",
      },
      {
        excerpt:
          "Padahal mereka tidak disuruh kecuali supaya menyembah Allah dengan memurnikan ketaatan kepada-Nya dalam (menjalankan) agama.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sesungguhnya setiap amal tergantung niatnya, dan setiap orang akan mendapatkan sesuai dengan apa yang ia niatkan.",
      },
    ],
    actions: [
      "Pelajari dasar-dasar tauhid dari ulama yang tepercaya.",
      "Perbarui niatmu sebelum beribadah.",
      "Mohonlah ampunan atas riya yang tersembunyi.",
    ],
  },
  {
    // salah
    title: "Salah — sang tiang",
    summary: "Menjaga lima waktu salah termasuk di antara amal yang paling agung.",
    body: [
      "Salah — lima waktu salah wajib — adalah rukun kedua Islam dan amal ibadah harian yang paling utama. Nabi ﷺ menggambarkan salah sebagai tiang agama: siapa yang menegakkannya telah menegakkan agama, dan siapa yang meninggalkannya telah merobohkan banyak hal yang menopangnya. Salah adalah lima pertemuan harian orang beriman dengan Tuhannya, berdiri, rukuk, dan sujud dalam hubungan langsung dengan Allah.",
      "Kedudukannya tak tertandingi di antara amal-amal praktis karena apa yang Nabi ﷺ sabdakan tentang Hari Kiamat: perkara pertama yang akan dihisab dari seorang hamba adalah salahnya. Jika ia baik, maka baiklah seluruh amalnya; jika ia rusak, maka amal yang lain pun dalam bahaya. Di dunia ini pun, salah adalah sarana penyucian — Nabi ﷺ mengumpamakan lima waktu salah dengan sungai yang mengalir di depan pintu seseorang: siapa yang mandi di dalamnya lima kali sehari, tidak akan tersisa kotoran padanya, dan begitulah salah menghapus dosa-dosa kecil.",
      "Namun salah dimaksudkan untuk lebih dari sekadar gerakan fisik. Al-Qur'an memuji 'orang-orang yang khusyuk dalam salatnya' (Qur'an 23:1–2) dan memuliakan 'orang-orang yang tetap setia melaksanakan salatnya' (Qur'an 70:22–23). Dua hal yang paling penting: khusyuk — hati yang hadir dan rendah hati yang menyadari bahwa ia sedang berdiri di hadapan Allah — dan konsistensi, menjaga setiap salah pada waktunya. Salah berjamaah, bagi yang mampu, melipatgandakan pahala berkali-kali lipat.",
      "Hikmah mendalam dari salah adalah transformasi. Salah yang dilaksanakan dengan benar mencegah seseorang dari perbuatan keji dan mungkar; ia adalah pengatur ulang berulang yang menarik kembali hati kepada Allah di tengah hari yang sibuk. Karena itu, meninggalkan salah tanpa uzur yang sah adalah perkara serius yang memerlukan tobat yang tulus dan mengqada-nya. Salah sunah dan rawatib — salah sunah sebelum dan sesudah yang wajib — menambahkan cahaya lebih dan mengangkat derajat.",
      "Secara praktis: jagalah lima waktu salah pada waktunya sebagai prioritas utamamu, gantilah (qaza) salah yang terlewat, dan tambahkan salah sunah yang bisa kau lakukan secara konsisten. Jika salahmu membaik, seluruh ibadahmu yang lain cenderung membaik bersamanya.",
    ],
    quran: [
      {
        excerpt:
          "Sesungguhnya beruntunglah orang-orang yang beriman, (yaitu) orang-orang yang khusyuk dalam salatnya.",
      },
      {
        excerpt:
          "Kecuali orang-orang yang mengerjakan salat, yang mereka tetap setia melaksanakan salatnya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Perkara pertama yang akan dihisab dari seorang hamba pada Hari Kiamat adalah salahnya. Jika ia baik, maka ia beruntung dan berhasil; dan jika ia rusak, maka ia gagal dan merugi.",
      },
      {
        excerpt:
          "Seandainya ada sungai di depan pintu salah seorang dari kalian, lalu ia mandi di dalamnya lima kali sehari, apakah masih tersisa kotoran padanya? Para sahabat menjawab: Tidak. Beliau bersabda: Itulah perumpamaan lima waktu salah — dengannya Allah menghapus dosa-dosa.",
      },
    ],
    actions: [
      "Jagalah lima waktu salah pada waktunya.",
      "Qadalah salah yang terlewat dengan tulus.",
      "Tambahkan salah sunah sebelum dan sesudah yang wajib jika memungkinkan.",
    ],
    appLinks: [
      { label: "Daftar periksa Salah" },
      { label: "Jadwal Salah" },
      { label: "Panduan Salah" },
      { label: "Jurnal khusyuk" },
    ],
  },
  {
    // tawbah
    title: "Tobat yang tulus",
    summary: "Allah mencintai mereka yang terus-menerus kembali kepada-Nya.",
    body: [
      "Tobat adalah kembali kepada Allah setelah berbuat dosa. Tobat yang tulus (tobat nasuha) memiliki rukun yang jelas: penyesalan yang tulus dalam hati atas apa yang telah dilakukan, segera menghentikan dosa itu, dan tekad yang kukuh untuk tidak pernah mengulanginya — dan jika dosa itu melibatkan kezaliman terhadap orang lain, mengembalikan haknya atau meminta maaf kepadanya. Ini bukan peristiwa sekali saja, melainkan kembali seumur hidup, sebuah pintu yang Allah jaga tetap terbuka bagi setiap orang beriman.",
      "Kepentingannya adalah bahwa tidak ada manusia yang bebas dari dosa, sehingga tobat bukan untuk segelintir pendosa, melainkan untuk semua orang. Nabi ﷺ bersabda bahwa setiap anak Adam berbuat dosa, dan sebaik-baik orang yang berbuat dosa adalah mereka yang bertobat. Allah menerima tobat seorang hamba hingga saat ruh mencapai kerongkongan menjelang kematian, dan bahkan terbitnya matahari dari barat adalah batas waktu bagi dunia ini — hingga saat itu, undangan tetap terbuka.",
      "Yang mengagumkan, Allah tidak sekadar menerima hamba yang kembali — Dia bergembira. Nabi ﷺ menggambarkan Allah lebih bergembira atas tobat hamba-Nya daripada seseorang yang, tersesat di padang gurun yang tandus, berputus asa dari kehidupan setelah untanya hilang membawa seluruh perbekalan makanan dan minumannya, lalu tiba-tiba menemukannya kembali. Gambaran kegembiraan yang meluap itu memberi tahu kita betapa dicintainya hamba yang bertobat di sisi Tuhannya.",
      "Hikmahnya sangat dalam: dosa tidak harus menjadi akhir dari kisah seseorang. 'Allah akan mengganti kejahatan mereka dengan kebajikan' (Qur'an 25:70) — tobat yang tulus dapat mengubah catatan kegagalan menjadi keberhasilan, dan dapat mengubah keterjatuhan menjadi awal baru yang membawa seseorang lebih dekat kepada Allah daripada sebelumnya. Putus asa setelah berbuat dosa itu sendiri adalah jebakan setan; harapan pada rahmat Allah adalah jawaban orang beriman.",
      "Secara praktis: jangan menunda tobat walau sehari — kembalilah begitu engkau tergelincir. Ikuti setiap perbuatan buruk dengan perbuatan baik untuk menghapusnya, dan jagalah istigfar terus mengalir di lidahmu sepanjang hari, sebagaimana Nabi ﷺ memohon ampunan berkali-kali setiap hari meskipun beliau telah diampuni.",
    ],
    quran: [
      {
        excerpt:
          "Wahai orang-orang yang beriman, bertobatlah kepada Allah dengan tobat yang semurni-murninya, mudah-mudahan Tuhanmu akan menghapus kesalahan-kesalahanmu dan memasukkanmu ke dalam surga yang mengalir di bawahnya sungai-sungai.",
      },
      {
        excerpt:
          "Kecuali orang-orang yang bertobat, beriman, dan mengerjakan amal saleh; maka Allah akan mengganti kejahatan mereka dengan kebajikan. Dan Allah Maha Pengampun lagi Maha Penyayang.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah lebih bergembira dengan tobat hamba-Nya daripada seseorang di antara kalian yang, setelah kehilangan untanya di padang tandus, tiba-tiba menemukannya kembali.",
      },
    ],
    actions: [
      "Bertobatlah segera saat engkau berbuat dosa — jangan menunda.",
      "Ikuti dosa dengan perbuatan baik untuk menghapusnya.",
      "Ucapkanlah istigfar sepanjang hari.",
    ],
    appLinks: [{ label: "Zikir pagi & petang" }, { label: "Pelacak Qaza" }],
  },
  {
    // quran
    title: "Al-Qur'an",
    summary: "Bacalah, hafalkanlah, dan amalkanlah Kitab Allah.",
    body: [
      "Al-Qur'an adalah firman Allah yang sebenarnya, diturunkan sebagai petunjuk, rahmat, dan penyembuh bagi hati. Membangun hubungan dengannya — membacanya, merenungkan maknanya, mengamalkan perintah-perintahnya, dan mengajarkannya kepada orang lain — termasuk di antara ibadah yang paling agung dan paling berpahala yang bisa ditekuni seorang mukmin sepanjang hidupnya. Ia adalah tali Allah yang terulur kepada kita; siapa yang berpegang teguh padanya akan dituntun ke jalan yang lurus.",
      "Pahala yang menyertainya luar biasa. Nabi ﷺ mengajarkan bahwa Allah memberikan kepada mereka yang membaca Kitab-Nya dan menegakkan salah, ganjaran besar yang tidak akan pernah musnah (Qur'an 35:29–30), dan bahwa setiap satu huruf yang dibaca mendapat pahala yang dilipatgandakan sepuluh kali. Bahkan orang yang tertatih-tatih dan bersusah payah dengan kata-katanya, selama ia terus berusaha, mendapat pahala ganda — satu untuk bacaannya dan satu untuk usahanya.",
      "Al-Qur'an juga mengangkat derajat seseorang di kehidupan berikutnya dengan cara yang jelas dan nyata. Nabi ﷺ bersabda bahwa sahabat Al-Qur'an akan dikatakan kepadanya pada Hari Kiamat: 'Bacalah dan naiklah, dan bacalah sebagaimana engkau dahulu membaca di dunia, karena kedudukanmu berada pada ayat terakhir yang engkau baca.' Dengan kata lain, kedudukan seseorang di Surga meningkat sejalan dengan bagiannya dari Kitab tersebut — dorongan yang kuat untuk terus menghafal dan mengulang.",
      "Namun tujuan yang lebih dalam bukanlah bacaan demi bacaan itu sendiri, melainkan transformasi. Allah memerintahkan kita untuk 'membaca Al-Qur'an dengan tartil' (Qur'an 73:4) justru agar maknanya meresap dan membentuk ulang cara kita berpikir, merasa, dan berperilaku. Al-Qur'an diturunkan untuk dijalani, bukan sekadar dibaca; para sahabat mempelajari sepuluh ayat dan tidak melangkah maju sampai mereka memahaminya dan mengamalkannya.",
      "Secara praktis: bacalah sebagian setiap hari, walau hanya beberapa ayat, tetapi bacalah dengan perenungan. Hafalkan surah-surah baru atau jagalah yang sudah kau hafal, dan — yang terpenting — amalkan apa yang kau pelajari sebelum bergegas mempelajari lebih banyak lagi.",
    ],
    quran: [
      {
        excerpt:
          "Sesungguhnya orang-orang yang selalu membaca kitab Allah dan mendirikan salat dan menafkahkan sebagian dari rezeki yang Kami anugerahkan kepada mereka dengan diam-diam dan terang-terangan, mereka itu mengharapkan perniagaan yang tidak akan merugi, agar Allah menyempurnakan kepada mereka pahalanya dan menambah kepada mereka dari karunia-Nya.",
      },
      { excerpt: "Dan bacalah Al-Qur'an itu dengan perlahan-lahan (tartil)." },
    ],
    hadith: [
      {
        excerpt:
          "Akan dikatakan kepada sahabat Al-Qur'an: Bacalah dan naiklah, dan bacalah sebagaimana engkau dahulu membaca di dunia, karena kedudukanmu berada pada ayat terakhir yang engkau baca.",
      },
    ],
    actions: [
      "Bacalah setiap hari — walau beberapa ayat dengan perenungan.",
      "Hafalkan surah-surah baru atau jagalah yang sudah kau hafal.",
      "Amalkan apa yang kau pelajari sebelum mencari lebih banyak.",
    ],
    appLinks: [
      { label: "Pembaca Al-Qur'an" },
      { label: "Perencana khatam" },
      { label: "Pelacak hafalan" },
    ],
  },
  {
    // dhikr
    title: "Zikir — mengingat Allah",
    summary: "Ringan di lidah, berat di timbangan.",
    body: [
      "Zikir berarti mengingat Allah — menghadirkan-Nya di hati dan lidah melalui kata-kata pengagungan (subhanallah), pujian (alhamdulillah), pembesaran (Allahu akbar), penegasan keesaan-Nya (la ilaha illallah), dan permohonan ampun (istigfar). Dari semua jalan menuju Surga, zikir termasuk yang paling mudah dilakukan namun paling besar pahalanya, karena bisa dilakukan di mana saja, dalam keadaan apa pun, kapan pun.",
      "Allah sendiri memerintahkannya dengan penuh kemurahan — 'Wahai orang-orang yang beriman, berzikirlah (dengan menyebut nama) Allah, zikir yang sebanyak-banyaknya' (Qur'an 33:41–42) — dan menjanjikan buah yang unik baginya: ketenteraman hati. 'Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram' (Qur'an 13:28). Dalam dunia yang gelisah dan cemas, ini adalah salah satu anugerah terbesar zikir. Nabi ﷺ juga menimbang pahalanya, bersabda bahwa ada dua kalimat yang ringan di lidah namun berat di timbangan dan dicintai oleh Yang Maha Pengasih: 'subhanallahi wa bihamdihi, subhanallahil-'azhim'.",
      "Sebuah kategori khusus adalah zikir pagi dan petang — doa-doa sahih yang Nabi ﷺ ajarkan untuk dua ujung hari. Ini bekerja seperti benteng spiritual, menjaga orang beriman dari bahaya dan menarik perlindungan dan keridaan Allah. Hanya beberapa menit di awal dan akhir setiap hari, diucapkan dengan kehadiran hati, diam-diam membentuk ulang hati seiring waktu.",
      "Hikmah zikir adalah bahwa ia menjaga hubungan dengan Allah tetap hidup di sela-sela amal ibadah formal. Lidah yang basah dengan zikir dan — yang lebih penting — hati yang mengingat Allah dalam pilihan-pilihan hariannya, berhenti sejenak sebelum marah, sebelum berbelanja, sebelum mengambil keputusan — itulah tujuan sesungguhnya. Zikir tidak dimaksudkan untuk tinggal di bibir saja; ia dimaksudkan untuk mengarahkan kehidupan.",
      "Secara praktis: jadikan zikir pagi dan petang sebagai kebiasaan harian, jagalah sebagian sederhana tasbih, istigfar, atau selawat tetap mengalir di waktu-waktu luang, dan ingatlah Allah terutama sebelum tidur dan setelah bangun. Konsistensi dalam sedikit lebih baik daripada semangat sesaat dalam jumlah banyak.",
    ],
    quran: [
      {
        excerpt:
          "(Yaitu) orang-orang yang beriman dan hati mereka menjadi tenteram dengan mengingat Allah. Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.",
      },
      {
        excerpt:
          "Wahai orang-orang yang beriman, berzikirlah (dengan menyebut nama) Allah, zikir yang sebanyak-banyaknya. Dan bertasbihlah kepada-Nya pagi dan petang.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ada dua kalimat yang ringan di lidah, berat di timbangan, dan dicintai oleh Yang Maha Pengasih: subhanallahi wa bihamdihi, subhanallahil-'azhim.",
      },
    ],
    actions: [
      "Selesaikan zikir pagi dan petang setiap hari.",
      "Gunakan penghitung tasbih untuk istigfar atau selawat.",
      "Ingatlah Allah sebelum tidur dan setelah bangun.",
    ],
    appLinks: [{ label: "Pustaka zikir" }, { label: "Penghitung tasbih" }],
  },
  {
    // charity
    title: "Sedekah & zakat",
    summary: "Berinfaklah dari apa yang Allah berikan — secara tersembunyi maupun terang-terangan.",
    body: [
      "Islam memerintahkan orang beriman untuk berinfak dari harta yang Allah percayakan kepadanya, baik secara wajib maupun sukarela. Zakat adalah kewajiban tahunan atas harta yang telah mencapai nisab — salah satu dari lima rukun Islam — dan ia wajib, bukan opsional, bagi mereka yang memenuhi syarat-syaratnya. Di luar itu ada sedekah: pemberian sukarela dalam jumlah berapa pun, kapan pun, karena Allah.",
      "Pahala berinfak di jalan Allah dilipatgandakan melampaui hitungan biasa. Allah mengumpamakan orang yang berinfak di jalan-Nya seperti sebutir benih yang menumbuhkan tujuh bulir, setiap bulir berisi seratus biji — 'Allah melipatgandakan (ganjaran) bagi siapa yang Dia kehendaki' (Qur'an 2:261). Alih-alih mengurangi harta, sedekah menyucikannya dan menambah keberkahannya, serta memadamkan dosa sebagaimana air memadamkan api.",
      "Dua bentuk sedekah patut mendapat perhatian khusus. Yang pertama adalah sedekah tersembunyi, diberikan dengan begitu diam-diam sehingga, sebagaimana digambarkan Nabi ﷺ, tangan kiri tidak mengetahui apa yang diberikan tangan kanan — keikhlasan ini sangat dicintai Allah dan akan menaungi seseorang pada Hari Kiamat. Yang kedua adalah sedekah jariah, sedekah yang terus mengalir yang manfaatnya berlanjut setelah kematian. Nabi ﷺ bersabda bahwa ketika seseorang meninggal, amalnya terputus kecuali tiga: sedekah jariah, ilmu yang bermanfaat bagi orang lain, dan anak saleh yang mendoakannya.",
      "Hikmah sedekah adalah bahwa ia bekerja pada pemberi sama besarnya seperti pada penerima. Ia melonggarkan cengkeraman keserakahan dari hati, membangun rasa iba, memperkuat ikatan masyarakat, dan mengingatkan orang kaya bahwa ia adalah pemegang amanah, bukan pemilik sejati. Dan Islam meluaskan definisi sedekah sehingga tidak seorang pun terkecualikan: Nabi ﷺ mengajarkan bahwa senyum kepada saudaramu, perkataan yang bermanfaat, dan bahkan menyingkirkan benda berbahaya dari jalan adalah bentuk-bentuk sedekah.",
      "Secara praktis: jika engkau wajib berzakat, hitunglah dan bayarlah dengan akurat; berilah sedekah secara rutin, sekecil apa pun, agar memberi menjadi kebiasaan bukan sekadar peristiwa; dan carilah sedekah jariah yang bertahan lama — membiayai seorang penuntut ilmu, membangun sumur, atau mendukung sebuah masjid — yang terus memberimu pahala jauh setelah engkau tiada.",
    ],
    quran: [
      {
        excerpt:
          "Perumpamaan (nafkah yang dikeluarkan oleh) orang-orang yang menafkahkan hartanya di jalan Allah adalah serupa dengan sebutir benih yang menumbuhkan tujuh bulir, pada tiap-tiap bulir seratus biji. Allah melipatgandakan (ganjaran) bagi siapa yang Dia kehendaki.",
      },
      {
        excerpt:
          "Dan infakkanlah sebagian dari apa yang telah Kami berikan kepadamu sebelum datang kematian kepada salah seorang di antara kamu, lalu ia berkata: Ya Tuhanku, mengapa Engkau tidak menangguhkan (kematian)ku sampai waktu yang dekat, yang menyebabkan aku dapat bersedekah dan aku termasuk orang-orang yang saleh.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Apabila seorang manusia meninggal dunia, maka terputuslah amalnya kecuali tiga perkara: sedekah jariah, ilmu yang bermanfaat, atau anak saleh yang mendoakannya.",
      },
    ],
    actions: [
      "Hitung dan bayarlah zakat jika engkau wajib atasnya.",
      "Berilah sedekah rutin, walau sedikit.",
      "Carilah peluang sedekah jariah.",
    ],
    appLinks: [{ label: "Kalkulator zakat" }],
  },
  {
    // character
    title: "Akhlak yang baik",
    summary: "Hal yang paling berat di timbangan bisa jadi adalah akhlak yang mulia.",
    body: [
      "Akhlak yang baik (husn al-khuluq) adalah kumpulan sifat mulia yang ditampilkan seorang mukmin dalam berinteraksi dengan makhluk Allah: kejujuran, kesabaran, kerendahan hati, kasih sayang, kedermawanan, kelembutan, dan menepati janji. Jauh dari sekadar kesopanan sosial, Islam menjadikan akhlak sebagai ukuran mendasar keimanan dan salah satu amal terberat yang bisa dibawa seseorang pada Hari Kiamat.",
      "Kedudukannya dinyatakan dengan kata-kata yang paling terang. Nabi ﷺ bersabda bahwa tidak ada sesuatu pun yang diletakkan di timbangan yang lebih berat daripada akhlak yang baik, dan bahwa orang beriman yang paling sempurna imannya adalah mereka yang paling baik akhlaknya. Beliau bahkan meringkas misinya sendiri dengan mengatakan bahwa beliau diutus untuk menyempurnakan akhlak yang mulia. Ini berarti cara engkau memperlakukan orang tuamu, pasanganmu, anak-anakmu, tetanggamu, bahkan orang asing, tidaklah terpisah dari ibadahmu — melainkan bagian utamanya.",
      "Akhlak yang indah begitu kuat karena apa yang Nabi ﷺ janjikan dapat dicapainya: dengan akhlaknya yang baik, seorang mukmin dapat mencapai derajat orang yang berpuasa sepanjang hari dan salat sepanjang malam. Dengan kata lain, akhlak yang unggul dapat mengangkat orang biasa ke tingkat para ahli ibadah yang paling tekun, karena ia sulit, konstan, dan menguji ego di setiap kesempatan — menahan amarah, memaafkan penghinaan, dan memilih kelembutan ketika kekerasan lebih mudah.",
      "Hikmahnya adalah bahwa Islam bukan hanya hubungan pribadi antara seseorang dengan Allah; ia dimaksudkan untuk meluap ke dalam cara seseorang memperlakukan semua orang di sekitarnya. Seorang ahli ibadah yang salatnya tidak melembutkan sikapnya telah kehilangan intinya, sedangkan akhlak yang baik adalah dakwah itu sendiri, menarik orang menuju keimanan melalui teladan hidup. Inilah sebabnya nas-nas berulang kali memasangkan ibadah kepada Allah dengan keunggulan terhadap makhluk-Nya.",
      "Secara praktis: kerjakan satu sifat pada satu waktu — tahanlah lidahmu saat tersulut amarah, maafkanlah mereka yang menzalimimu, perbaikilah hubungan yang telah putus, dan tepatilah janjimu meski harus membayar mahal. Perenungan singkat setiap hari setelah salah tentang bagaimana engkau memperlakukan orang hari itu adalah cara sederhana untuk terus berkembang.",
    ],
    quran: [
      { excerpt: "Dan sesungguhnya engkau benar-benar berbudi pekerti yang agung." },
      {
        excerpt:
          "(Yaitu) orang-orang yang menafkahkan (hartanya), baik di waktu lapang maupun sempit, dan orang-orang yang menahan amarahnya dan memaafkan (kesalahan) orang. Allah menyukai orang-orang yang berbuat kebajikan.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Tidak ada sesuatu pun yang lebih berat di timbangan seorang mukmin pada Hari Kiamat daripada akhlak yang baik. Dan sesungguhnya Allah membenci orang yang berkata keji dan kasar.",
      },
      {
        excerpt:
          "Orang beriman yang paling sempurna imannya adalah mereka yang paling baik akhlaknya, dan sebaik-baik kalian adalah yang paling baik terhadap istri-istrinya.",
      },
    ],
    actions: [
      "Berlatihlah bersabar ketika tersulut.",
      "Maafkanlah orang lain dan perbaikilah hubungan yang putus.",
      "Renungkan akhlakmu setelah salah dalam jurnal harian.",
    ],
    appLinks: [{ label: "Jurnal khusyuk & akhlak" }],
  },
  {
    // knowledge
    title: "Menuntut ilmu",
    summary: "Allah memudahkan jalan menuju Surga bagi penuntut ilmu.",
    body: [
      "Menuntut ilmu yang bermanfaat — mempelajari apa yang Allah dan Rasul-Nya ﷺ ajarkan, lalu mengamalkannya dan meneruskannya — adalah sebuah ibadah dan, dalam hal-hal pokoknya, kewajiban bagi setiap muslim. Inilah ilmu suci yang menjernihkan akidah, memurnikan ibadah, dan membedakan yang benar dari yang salah; ia bukan ilmu untuk pamer, melainkan cahaya yang menuntun amal.",
      "Nabi ﷺ mengaitkan usaha ini secara langsung dengan tujuan seluruh perjalanan ini: 'Barang siapa menempuh suatu jalan untuk mencari ilmu, Allah akan memudahkan baginya jalan menuju Surga.' 'Jalan' ini bermakna harfiah sekaligus kiasan — Allah memudahkan jalan penuntut ilmu di dunia ini dan memudahkan jalannya menuju Jannah di akhirat. Beliau juga mengajarkan bahwa para malaikat merendahkan sayap-sayap mereka sebagai tanda rida bagi penuntut ilmu, dan bahwa segala sesuatu di langit dan bumi, bahkan ikan-ikan di laut, memohonkan ampun bagi orang yang mengajarkan kebaikan.",
      "Ilmu juga termasuk amal langka yang terus memberi pahala kepada seseorang setelah kematian. Nabi ﷺ menyebutkan ilmu yang bermanfaat di antara tiga hal yang pahalanya terus mengalir di dalam kubur, bersama sedekah jariah dan anak saleh. Maka mengajarkan satu perkara yang bermanfaat — membantu seseorang belajar salah dengan benar, menyampaikan sebuah hadis yang sahih, atau membimbing seseorang menuju kebenaran — dapat menjadi aliran pahala yang mengalir bertahun-tahun, bahkan berlintas generasi.",
      "Hikmahnya adalah bahwa amal tanpa ilmu itu buta, dan ilmu tanpa amal itu tidak berbuah. Ilmu yang benar melindungi seseorang dari bidah dan kesesatan, memperdalam keikhlasan, dan memberinya kemampuan untuk memberi manfaat bukan hanya bagi dirinya sendiri tetapi juga bagi orang lain. Para ulama Islam selalu memperingatkan dua bahaya: beramal tanpa ilmu, dan berilmu tanpa beramal.",
      "Secara praktis: bertekadlah untuk mempelajari sesuatu yang bermanfaat secara rutin — satu ayat, satu hadis, satu masalah yang engkau perlukan untuk ibadah harianmu. Mulailah dari dasar-dasar akidah, salah, bersuci, dan larangan-larangan besar, lalu perdalamlah secara bertahap. Bagikan apa yang kau pelajari dengan rendah hati, dan selalu amalkan lebih dahulu pada dirimu sendiri.",
    ],
    quran: [
      {
        excerpt:
          "Katakanlah: Apakah sama orang-orang yang mengetahui dengan orang-orang yang tidak mengetahui? Sesungguhnya orang yang berakallah yang dapat menerima pelajaran.",
      },
      { excerpt: "Dan katakanlah: Ya Tuhanku, tambahkanlah kepadaku ilmu pengetahuan." },
    ],
    hadith: [
      {
        excerpt:
          "Barang siapa menempuh suatu jalan untuk mencari ilmu, Allah akan memudahkan baginya jalan menuju Surga.",
      },
      {
        excerpt:
          "Apabila seorang manusia meninggal dunia, maka terputuslah amalnya kecuali tiga perkara: sedekah jariah, ilmu yang bermanfaat, atau anak saleh yang mendoakannya.",
      },
    ],
    actions: [
      "Pelajari sesuatu yang bermanfaat setiap minggu.",
      "Bagikan ilmu tanpa kesombongan.",
      "Amalkan apa yang kau pelajari sebelum mengumpulkan lebih banyak.",
    ],
    appLinks: [{ label: "Pustaka hadis" }, { label: "Panduan Salah" }, { label: "Hadis harian" }],
  },
  {
    // voluntary-worship
    title: "Ibadah sunah",
    summary: "Dekatilah Allah melalui amalan sunah melampaui yang wajib.",
    body: [
      "Ibadah sunah (nafl) merujuk pada amal ibadah tambahan yang dipersembahkan seorang mukmin melampaui apa yang Allah wajibkan — salah tambahan, puasa tambahan, sedekah dan zikir tambahan. Kewajiban selalu didahulukan dan tidak dapat ditawar, tetapi setelah semua itu ditunaikan, ibadah sunahlah tempat seorang hamba mengungkapkan cinta, kedekatan, dan kerinduan yang melampaui batas minimal yang diwajibkan.",
      "Ada janji menakjubkan yang menyertainya. Dalam sebuah hadis qudsi, Allah berfirman: 'Hamba-Ku tidak mendekat kepada-Ku dengan sesuatu yang lebih Aku cintai daripada apa yang telah Aku wajibkan atasnya. Dan ia terus mendekat kepada-Ku melalui amalan-amalan sunah hingga Aku mencintainya' — dan ketika Allah mencintai seorang hamba, doa-doanya dikabulkan dan urusannya diperbaiki. Ibadah sunah karenanya adalah tangga kedekatan, yang mendaki dari sekadar ketaatan menuju cinta ilahi.",
      "Sunah kaya dengan bentuk-bentuk yang mudah dijangkau: salah malam (tahajud) pada sepertiga malam terakhir, salah duha, salah sunah rawatib sebelum dan sesudah yang wajib, dan puasa sunah seperti hari Senin dan Kamis atau ayyamul bidh setiap bulan. Ibadah sunah juga diam-diam menambal kekurangan kita — Nabi ﷺ mengajarkan bahwa kekurangan dalam salah wajib akan dilengkapi dari salah sunah seseorang pada Hari Kiamat.",
      "Hikmahnya adalah bahwa amalan sunah menjaga iman tetap hidup dan bertumbuh. Kewajiban menjaga fondasi, tetapi amalan sukarela adalah tempat hati meluas, tempat ibadah pribadi yang tidak dilihat siapa pun membangun keikhlasan, dan tempat seseorang melatih dirinya untuk ujian-ujian hidup yang lebih berat. Ini juga suatu rahmat bahwa amal-amal ini bersifat opsional — Allah membuka banyak pintu agar setiap orang dapat melewati pintu-pintu yang sesuai dengannya.",
      "Secara praktis, kuncinya adalah keberlanjutan, bukan intensitas. Nabi ﷺ mengajarkan bahwa amal yang paling dicintai Allah adalah yang paling konsisten, walau sedikit. Pilihlah beberapa amalan sunah yang benar-benar bisa kau pertahankan — dua rakaat tahajud, satu hari puasa seminggu, satu bagian tetap Al-Qur'an — daripada lonjakan semangat ambisius yang padam dalam beberapa hari.",
    ],
    quran: [
      {
        excerpt:
          "Lambung mereka jauh dari tempat tidurnya, sedang mereka berdoa kepada Tuhannya dengan rasa takut dan penuh harap, dan mereka menafkahkan sebagian dari rezeki yang Kami berikan kepada mereka. Seorang pun tidak mengetahui berbagai nikmat yang menyenangkan hati yang disembunyikan (untuk mereka) sebagai balasan atas apa yang telah mereka kerjakan.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Hamba-Ku tidak mendekat kepada-Ku dengan sesuatu yang lebih Aku cintai daripada apa yang telah Aku wajibkan atasnya. Dan hamba-Ku terus mendekat kepada-Ku melalui amalan-amalan sunah hingga Aku mencintainya.",
      },
    ],
    actions: [
      "Salatlah tahajud walau hanya dua rakaat.",
      "Berpuasalah sunah bila mampu.",
      "Tambahkan salah sunah sebelum/sesudah yang wajib secara konsisten.",
    ],
    appLinks: [
      { label: "Pelacak tahajud" },
      { label: "Ramadan & puasa" },
      { label: "Daftar periksa Salah" },
    ],
  },
  {
    // patience-gratitude
    title: "Sabar & syukur",
    summary: "Allah mencintai orang-orang yang sabar dan bersyukur.",
    body: [
      "Sabar dan syukur adalah dua sayap yang membuat seorang mukmin terbang menjalani hidup. Sabar adalah keteguhan dalam tiga arena: tetap tegar dalam ketaatan kepada Allah, menahan diri dari kemaksiatan, dan menanggung ujian hidup tanpa mengeluh terhadap ketetapan-Nya. Syukur adalah mengakui setiap nikmat berasal dari Allah dan meresponsnya dengan terima kasih di hati, di lidah, dan melalui amal ketaatan. Bersama-sama, keduanya melengkapi respons orang beriman terhadap kesulitan maupun kemudahan.",
      "Kepentingannya adalah bahwa keduanya menentukan bagaimana orang beriman menghadapi segala sesuatu yang menimpanya. Nabi ﷺ takjub bahwa seluruh perkara orang beriman adalah baik: ketika kebaikan sampai kepadanya, ia bersyukur dan itu baik baginya; dan ketika kesulitan menimpa, ia bersabar dan itu pun baik baginya — sebuah anugerah yang tidak diberikan kepada siapa pun kecuali orang beriman. Maka apa pun yang datang, orang beriman memiliki jalan menuju pahala.",
      "Pahala kesabaran secara unik tidak terbatas. Sementara sebagian besar amal diganjar dengan kelipatan tertentu, Allah berfirman: 'Sesungguhnya hanya orang-orang yang bersabarlah yang dicukupkan pahala mereka tanpa batas' (Qur'an 39:10). Dan syukur membawa janji tersendiri berupa tambahan: 'Jika kamu bersyukur, pasti akan Kutambah (nikmat) kepadamu' (Qur'an 14:7). Maka rasa syukur bukan hanya respons yang benar terhadap nikmat — ia adalah sesuatu yang menyebabkannya bertambah.",
      "Hikmah di sini mengubah seluruh makna penderitaan. Ujian bukanlah hukuman secara otomatis; bagi orang beriman yang meresponsnya dengan baik, ujian bisa menjadi penyucian yang menghapus dosa dan pengangkatan yang menaikkan derajat. Nabi ﷺ mengajarkan bahwa tidak ada kelelahan, penyakit, kekhawatiran, bahkan tusukan duri yang menimpa seorang muslim melainkan Allah menghapus sebagian dosanya melaluinya. Ini mengubah momen-momen tersulit dalam hidup menjadi peluang, bukan semata kerugian.",
      "Secara praktis: ketika musibah menimpa, ucapkanlah kata-kata yang Allah ajarkan — 'inna lillahi wa inna ilaihi raji'un' (sesungguhnya kami milik Allah dan kepada-Nya kami kembali) — dan tahanlah lidahmu dari keluhan yang menolak ketetapan-Nya. Di saat lapang, hitunglah nikmatmu dengan suara keras dan syukurilah Allah untuk setidaknya beberapa nikmat setiap hari; menyebutnya menjaga hati tetap lembut dan bersyukur.",
    ],
    quran: [
      {
        excerpt:
          "Dan sampaikanlah kabar gembira kepada orang-orang yang sabar, (yaitu) orang-orang yang apabila ditimpa musibah, mereka mengucapkan: Sesungguhnya kami milik Allah dan kepada-Nya kami kembali. Mereka itulah yang mendapat keberkatan yang sempurna dan rahmat dari Tuhan mereka, dan mereka itulah orang-orang yang mendapat petunjuk.",
      },
      {
        excerpt:
          "Jika kamu bersyukur, pasti akan Kutambah (nikmat) kepadamu, dan jika kamu mengingkari (nikmat-Ku), maka sesungguhnya azab-Ku sangat pedih.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sungguh menakjubkan perkara orang beriman, seluruh perkaranya adalah baik. Jika kemudahan menimpanya, ia bersyukur dan itu baik baginya; dan jika kesulitan menimpanya, ia bersabar dan itu pun baik baginya. Ini tidak berlaku bagi siapa pun kecuali orang beriman.",
      },
    ],
    actions: [
      "Ucapkanlah 'inna lillahi wa inna ilaihi raji'un' ketika diuji.",
      "Syukurilah Allah dengan suara keras untuk tiga nikmat setiap hari.",
      "Jangan mengeluh dengan cara yang menolak ketetapan Allah.",
    ],
  },
  {
    // dawah
    title: "Menyeru kepada Allah",
    summary: "Siapa yang membimbing orang lain mendapat pahala seperti yang mengamalkannya.",
    body: [
      "Dakwah berarti mengajak orang lain menuju Allah — menyampaikan pesan Islam, mengajarkan seseorang salah, mendorong kebaikan, mencegah kemungkaran dengan lembut, atau membantu seorang muslim yang berjuang untuk kembali kepada ketaatan. Ini adalah misi setiap nabi dan merupakan tanggung jawab bersama umat, masing-masing sesuai kemampuan dan pengetahuannya. Ini bukan hanya milik para ulama; siapa pun yang menyampaikan satu hal bermanfaat sedang menyeru kepada Allah.",
      "Pahalanya termasuk yang paling murah hati dalam seluruh ajaran Islam. Nabi ﷺ bersabda bahwa siapa yang membimbing seseorang kepada kebaikan akan mendapat pahala seperti orang yang mengamalkannya — dan dalam riwayat lain, siapa yang menyeru kepada petunjuk akan mendapat pahala semua orang yang mengikutinya, tanpa mengurangi sedikit pun pahala mereka sendiri. Ini berarti kebaikan yang engkau mulai dapat terus melipatgandakan pahalamu melalui setiap orang yang tersentuh olehnya, bahkan lama setelah engkau tiada.",
      "Namun dakwah memiliki adab — sebuah cara — yang harus dijaga agar berhasil. Allah memerintahkan: 'Serulah (manusia) kepada jalan Tuhanmu dengan hikmah dan pelajaran yang baik, dan bantahlah mereka dengan cara yang baik' (Qur'an 16:125). Hikmah berarti mengatakan hal yang tepat, kepada orang yang tepat, dengan cara dan waktu yang tepat; kekerasan, kesombongan, dan mencari-cari kesalahan menjauhkan orang dan mengkhianati tujuannya. Tugas penyeru adalah menyampaikan dan menanam benih, bukan memaksa hati, yang hanya menjadi milik Allah.",
      "Hikmah mengaitkan pahala yang begitu luas dengan membimbing orang lain adalah bahwa ini menjadikan setiap mukmin sumber kebaikan yang berkelanjutan. Ini juga melindungi iman si penyeru sendiri: mengajak orang lain kepada salah, kejujuran, dan ibadah adalah pengingat untuk berpegang teguh padanya sendiri. Dan ini mengikat umat dalam kepedulian bersama, bukan kelalaian bersama.",
      "Secara praktis, mulailah dari rumahmu sendiri. Perbaiki dan ajarkan keluargamu — pasangan, anak, saudara — karena mereka adalah tanggung jawabmu yang pertama dan paling bertahan lama. Bagikan ilmu yang bermanfaat dengan kebaikan, bantulah seseorang belajar salah atau membaca Al-Qur'an, dan ingatlah bahwa kehidupan berakhlak baik dan beribadah secara konsisten seringkali merupakan dakwah paling efektif.",
    ],
    quran: [
      {
        excerpt:
          "Serulah (manusia) kepada jalan Tuhanmu dengan hikmah dan pelajaran yang baik, dan bantahlah mereka dengan cara yang lebih baik.",
      },
      {
        excerpt:
          "Siapakah yang lebih baik perkataannya daripada orang yang menyeru kepada Allah, mengerjakan amal saleh, dan berkata: Sesungguhnya aku termasuk orang-orang yang berserah diri?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Siapa yang membimbing seseorang kepada kebaikan akan mendapat pahala seperti orang yang mengamalkannya.",
      },
    ],
    actions: [
      "Bagikan ilmu yang bermanfaat dengan kebaikan.",
      "Bantulah seseorang belajar salah atau membaca Al-Qur'an.",
      "Jadilah teladan akhlak yang baik di tengah masyarakat.",
    ],
  },
  {
    // major-deeds
    title: "Amal besar seumur hidup",
    summary: "Haji, keluarga, dan sedekah yang bertahan lama.",
    body: [
      "Selain amal ibadah harian dan mingguan, Islam mengarahkan orang beriman kepada beberapa amal besar seumur hidup — investasi besar yang pahalanya luar biasa dan, dalam beberapa hal, tidak pernah berakhir. Inilah proyek-proyek yang layak dijadikan poros hidup: ibadah haji, membesarkan keluarga yang saleh, dan membangun amal kebaikan yang bertahan lama.",
      "Yang paling utama di antaranya adalah Haji, rukun kelima Islam, wajib sekali seumur hidup bagi setiap muslim yang mampu secara fisik dan finansial — 'Mengerjakan haji adalah kewajiban manusia terhadap Allah, yaitu (bagi) orang yang sanggup mengadakan perjalanan ke Baitullah' (Qur'an 3:97). Pahalanya adalah penyucian total: Nabi ﷺ bersabda bahwa siapa yang berhaji karena Allah dan menghindari perbuatan keji serta dosa akan kembali bersih dari dosa, seperti hari ketika ibunya melahirkannya. Beliau bersabda bahwa haji yang mabrur tidak ada balasannya kecuali Surga. Umrah, haji kecil, juga membawa pahala besar dan menghapus dosa-dosa di antara satu umrah dengan umrah berikutnya.",
      "Investasi besar kedua adalah sedekah jariah — sedekah yang terus mengalir yang tetap memberi pahala kepada seseorang setelah kematian. Nabi ﷺ menyebutkannya di antara tiga hal yang terus bermanfaat bagi seseorang di dalam kubur, bersama ilmu yang bermanfaat dan anak saleh yang mendoakannya. Membesarkan anak-anak dalam keimanan dan akhlak yang baik barangkali adalah yang terbesar di antaranya, tetapi begitu pula membangun atau merawat masjid, menggali sumur, membiayai anak yatim, menanam pohon, atau mendanai pendidikan — masing-masing adalah aliran pahala yang bertahan lebih lama daripada pemberinya.",
      "Hikmah dari amal-amal ini adalah bahwa ia memperluas catatan seseorang melampaui masa hidupnya. Tahun-tahun aktif seorang mukmin singkat, tetapi sumur yang ia gali atau anak yang ia besarkan dengan baik dapat terus mendatangkan pahala baginya selama berabad-abad. Islam dengan demikian mendorong visi jangka panjang: bukan hanya memikirkan salah hari ini, tetapi juga memikirkan kebaikan apa yang akan terus mengalir darimu setelah engkau tiada.",
      "Secara praktis: jika engkau mampu, rencanakanlah haji atau umrah dengan sungguh-sungguh, bukan terus-menerus menundanya. Curahkan usaha nyata untuk iman dan akhlak keluargamu, karena mereka adalah warisanmu yang paling bertahan lama. Dan pilihlah setidaknya satu proyek amal yang bertahan lama untuk didukung — ilmu, air, tempat tinggal, atau anak yatim — agar amal kebaikanmu terus berlanjut setelah kematian.",
    ],
    quran: [
      {
        excerpt:
          "Mengerjakan haji adalah kewajiban manusia terhadap Allah, yaitu (bagi) orang yang sanggup mengadakan perjalanan ke Baitullah.",
      },
      {
        excerpt:
          "Dan berserulah kepada manusia untuk mengerjakan haji, niscaya mereka akan datang kepadamu dengan berjalan kaki, dan mengendarai unta yang kurus yang datang dari segenap penjuru yang jauh, supaya mereka menyaksikan berbagai manfaat bagi mereka.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Siapa yang berhaji karena Allah dan tidak berbuat keji atau maksiat, akan kembali bersih dari dosa, seperti hari ketika ibunya melahirkannya.",
      },
      {
        excerpt:
          "Apabila seorang manusia meninggal dunia, maka terputuslah amalnya kecuali tiga perkara: sedekah jariah, ilmu yang bermanfaat, atau anak saleh yang mendoakannya.",
      },
    ],
    actions: [
      "Rencanakan haji atau umrah jika engkau mampu.",
      "Investasikan pada iman dan akhlak keluargamu.",
      "Dukunglah sebuah proyek amal yang bertahan lama.",
    ],
    appLinks: [{ label: "Panduan Haji & Umrah" }, { label: "Zakat & sedekah" }],
  },
  {
    // mercy
    title: "Rahmat Allah — kata terakhir",
    summary: "Amal adalah sarana; masuk Surga adalah karena rahmat-Nya.",
    body: [
      "Setelah segala amal, segala usaha, dan segala jalan, orang beriman tiba pada sebuah kebenaran yang merendahkan hati, yang menjadi kata terakhir dari perjalanan ini: tidak seorang pun masuk Surga hanya karena amalnya semata. Nabi ﷺ menyatakan hal ini tentang dirinya sendiri — makhluk yang paling dicintai Allah di antara seluruh ciptaan — dengan mengatakan bahwa bahkan beliau pun tidak akan masuk Surga karena amalnya sendiri, kecuali bahwa Allah menyelimutinya dengan rahmat-Nya. Jika demikian bagi beliau, tentu demikian pula bagi kita.",
      "Ini tidak boleh disalahpahami sebagai izin untuk mengabaikan ibadah. Amal tetap merupakan sarana yang Allah pilih dan perintahkan; Dia telah mengaitkan rahmat-Nya dengan iman dan amal saleh, dan meninggalkannya bukanlah kerendahan hati melainkan kelalaian. Makna yang benar adalah soal proporsi: amal kita, sebanyak apa pun, tidak akan pernah dapat membalas bahkan sebagian kecil dari nikmat Allah atas kita, apalagi membeli keabadian Surga. Maka kita mempersembahkan amal kita sebagai tanda cinta dan ketaatan, lalu bersandar sepenuhnya pada karunia-Nya untuk menerimanya dan memasukkan kita ke dalam Surga.",
      "Luasnya rahmat itu sungguh menakjubkan. Nabi ﷺ bersabda bahwa Allah membagi rahmat menjadi seratus bagian; Dia hanya menurunkan satu bagian kepada seluruh makhluk-Nya — dan dengan satu bagian itulah seorang ibu penuh kasih terhadap anaknya dan hewan-hewan bersikap lembut kepada anak-anak mereka — sementara sembilan puluh sembilan bagian sisanya Dia simpan untuk diri-Nya sendiri guna dicurahkan kepada hamba-hamba-Nya pada Hari Kiamat. Rahmat apa pun yang pernah kita saksikan di dunia ini hanyalah sebagian kecil dari satu bagian dari seratus.",
      "Inilah sebabnya orang beriman yang seimbang hidup di antara harapan dan rasa takut, seperti burung yang terbang dengan dua sayap. Ia cukup takut akan keadilan Allah sehingga tidak pernah lengah atau berani nekat berbuat dosa, dan ia cukup berharap pada rahmat Allah sehingga tidak pernah berputus asa, betapapun jauh ia tersesat. Condong sepenuhnya pada rasa takut menumbuhkan keputusasaan; condong sepenuhnya pada harapan menumbuhkan kesombongan. Nama-nama Allah — Ar-Rahman (Yang Maha Pengasih), Ar-Rahim (Yang Maha Penyayang), Al-Ghafur (Yang Maha Pengampun) — menjadi penopang sayap harapan.",
      "Maka jadikanlah ini semangat yang menutup setiap harimu: mintalah Al-Firdaus kepada Allah, berusahalah sebaik-baiknya dengan tulus, bertobatlah atas kekuranganmu, lalu serahkan derajat akhirmu kepada Yang Mahaadil dan Maha Penyayang — dengan keyakinan bahwa Dia yang menyimpan sembilan puluh sembilan bagian rahmat untuk hari itu tidak akan menolak hamba yang datang kepada-Nya dengan berusaha dan berharap.",
    ],
    quran: [
      {
        excerpt:
          "Dan rahmat-Ku meliputi segala sesuatu. Maka akan Kutetapkan rahmat-Ku untuk orang-orang yang bertakwa, yang menunaikan zakat dan orang-orang yang beriman kepada ayat-ayat Kami.",
      },
      {
        excerpt:
          "Katakanlah: Wahai hamba-hamba-Ku yang melampaui batas terhadap diri mereka sendiri, janganlah kamu berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni dosa-dosa semuanya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Tidak seorang pun di antara kalian yang masuk Surga semata-mata karena amalnya. Para sahabat bertanya: Tidak juga engkau, wahai Rasulullah? Beliau bersabda: Tidak juga aku, kecuali bahwa Allah menyelimutiku dengan rahmat-Nya.",
      },
      {
        excerpt:
          "Allah memiliki seratus bagian rahmat. Dia menurunkan satu bagian di antara jin, manusia, hewan, dan serangga, yang dengannya mereka saling mengasihi satu sama lain; dan Dia menyimpan sembilan puluh sembilan bagian pada diri-Nya, yang dengannya Dia akan menunjukkan rahmat kepada hamba-hamba-Nya pada Hari Kiamat.",
      },
    ],
    actions: [
      "Seimbangkan rasa takut kepada Allah dengan harapan pada rahmat-Nya.",
      "Jangan pernah berputus asa setelah berbuat dosa — bertobatlah dan teruslah berusaha.",
      "Mintalah Al-Firdaus dan husnul khatimah (akhir yang baik) kepada Allah.",
    ],
    appLinks: [{ label: "Doa-doa Surga" }, { label: "Dasbor Perjalananku" }],
  },
];

export const JANNAH_GATES_ID: DeepPartial<JannahGate>[] = [
  {
    name: "Pintu Salah",
    deedSummary: "Bagi mereka yang menjaga dan menegakkan lima waktu salah.",
    hadith: [
      {
        excerpt:
          "Siapa yang berinfak sepasang sesuatu di jalan Allah, ia akan dipanggil dari pintu-pintu Surga. Siapa yang termasuk ahli salah akan dipanggil dari Pintu Salah.",
      },
    ],
  },
  {
    name: "Pintu Sedekah",
    deedSummary: "Bagi mereka yang bersedekah dengan tulus karena Allah.",
    hadith: [
      {
        excerpt: "Siapa yang termasuk ahli sedekah akan dipanggil dari Pintu Sedekah.",
      },
    ],
  },
  {
    name: "Pintu Ar-Rayyan",
    deedSummary:
      "Dikhususkan bagi orang-orang yang berpuasa — pintu yang hanya mereka yang masuk melaluinya.",
    hadith: [
      {
        excerpt:
          "Di Surga ada sebuah pintu bernama Ar-Rayyan, yang hanya dimasuki oleh orang-orang yang berpuasa pada Hari Kiamat. Apabila yang terakhir dari mereka telah masuk, pintu itu akan ditutup.",
      },
    ],
  },
  {
    name: "Pintu Jihad",
    deedSummary: "Bagi mereka yang berjihad di jalan Allah dengan tulus.",
    hadith: [
      {
        excerpt: "Siapa yang termasuk ahli jihad akan dipanggil dari Pintu Jihad.",
      },
    ],
  },
  {
    name: "Pahala Haji",
    deedSummary: "Bagi mereka yang berhaji dengan murni dan kembali bersih dari dosa.",
    hadith: [
      {
        excerpt:
          "Siapa yang berhaji karena Allah dan tidak berbuat keji atau maksiat, akan kembali bersih dari dosa, seperti hari ketika ibunya melahirkannya.",
      },
    ],
  },
  {
    name: "Dipanggil dari setiap pintu",
    deedSummary: "Sebagian orang, seperti Abu Bakar, akan dipanggil untuk masuk dari semua pintu.",
    hadith: [
      {
        excerpt:
          "Abu Bakar bertanya: Apakah ada yang akan dipanggil dari semua pintu ini? Beliau bersabda: Ya, dan aku berharap engkau termasuk salah satu di antara mereka.",
      },
    ],
  },
];

export const JANNAH_VERSES_ID: DeepPartial<JannahVerseEntry>[] = [
  {
    excerpt:
      "Berlomba-lombalah kamu kepada ampunan dari Tuhanmu dan surga yang luasnya seluas langit dan bumi, yang disediakan bagi orang-orang yang bertakwa.",
  },
  {
    excerpt:
      "Surga yang di bawahnya mengalir sungai-sungai, dan tempat-tempat tinggal yang bagus di surga 'Adn. Dan keridaan Allah adalah lebih besar.",
  },
  {
    excerpt:
      "Bagi orang-orang yang beriman dan beramal saleh adalah surga Firdaus menjadi tempat tinggal.",
  },
  {
    excerpt:
      "Seorang pun tidak mengetahui berbagai nikmat yang menyenangkan hati yang disembunyikan (untuk mereka) sebagai balasan atas apa yang telah mereka kerjakan.",
  },
  {
    excerpt:
      "Mereka memperoleh di dalamnya apa yang mereka kehendaki, dan pada sisi Kami ada tambahannya.",
  },
  {
    excerpt:
      "Dan masing-masing orang memperoleh derajat-derajat (seimbang) dengan apa yang dikerjakannya.",
  },
  {
    excerpt:
      "Mereka memperoleh derajat-derajat di sisi Allah, dan Allah Maha Melihat apa yang mereka kerjakan.",
  },
  {
    excerpt:
      "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan peliharalah kami dari siksa neraka.",
  },
  {
    excerpt:
      "Janganlah kamu berputus asa dari rahmat Allah — sesungguhnya Allah mengampuni dosa-dosa semuanya.",
  },
  {
    excerpt:
      "Wahai hamba-hamba-Ku, tidak ada rasa takut atasmu pada hari ini, dan tidak pula kamu bersedih hati.",
  },
  {
    excerpt:
      "Dan orang-orang yang paling dahulu (beriman), merekalah yang paling dahulu (masuk Surga). Mereka itulah orang-orang yang didekatkan (kepada Allah).",
  },
  {
    excerpt:
      "Maka Allah memelihara mereka dari kesusahan hari itu, dan memberikan kepada mereka kejernihan (wajah) dan kegembiraan hati.",
  },
];

export const JANNAH_DUAS_ID: DeepPartial<JannahDuaEntry>[] = [
  {
    context: "Doa yang komprehensif untuk kebaikan di kedua alam dan perlindungan dari api neraka.",
  },
  {
    context: "Doa singkat setelah tasyahud: memohon Surga dan berlindung dari api neraka.",
  },
  {
    context: "Setelah tasyahud, mohonlah Surga dengan wasilah nama-nama indah Allah.",
  },
  {
    context: "Mohonlah manisnya memandang Allah dan kerinduan untuk bertemu dengan-Nya.",
  },
];

export const JANNAH_PROMISED_ID: DeepPartial<JannahPromisedEntry>[] = [
  {
    name: "Sepuluh yang Dijanjikan Surga",
    summary:
      "Abu Bakar, Umar, Utsman, Ali, Thalhah, Zubair, Abdurrahman bin Auf, Sa'ad, Sa'id bin Zaid, dan Abu Ubaidah (semoga Allah meridai mereka).",
    note: "Disebutkan bersama dalam sebuah hadis di Sunan at-Tirmidzi (3747, sahih).",
  },
  {
    name: "Orang-orang yang jujur dan sabar",
    summary: "Allah memuji mereka yang jujur dalam iman dan sabar dalam ketaatan serta ujian.",
    note: "Lihat Qur'an 4:69 dan banyak ayat tentang as-sadiqin dan as-sabirin.",
  },
  {
    name: "Syuhada di jalan Allah",
    summary: "Mereka yang gugur membela Islam sesuai syariat Islam diberi kabar gembira Surga.",
    note: "Para ulama mendefinisikan syahadah secara cermat; tidak setiap kematian dalam pertempuran secara otomatis memenuhi kriteria ini.",
  },
  {
    name: "Mereka yang kata terakhirnya adalah tauhid",
    summary:
      "Barang siapa yang kata-kata terakhirnya adalah 'Tiada tuhan selain Allah' akan masuk Surga.",
    note: "Sunan Abu Dawud 3116 (sahih). Akhir yang baik adalah pencarian seumur hidup.",
  },
  {
    name: "Para nabi",
    summary: "Setiap nabi berada di tingkatan tertinggi Surga atas ketetapan Allah.",
    note: "Kedudukan mereka tidak dicapai melalui amal biasa — mereka dipilih dan dijaga.",
  },
];

export const JANNAH_FIRDAWS_DUA_ID: DeepPartial<{
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
}> = {
  translation:
    "Ya Allah, aku memohon kepada-Mu Al-Firdaus yang tertinggi — bagian Surga yang paling tinggi.",
  reference: "Berdasarkan Sahih al-Bukhari 7423 — mohonlah Al-Firdaus secara khusus.",
};
