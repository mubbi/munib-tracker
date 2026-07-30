import type {
  JannahDuaEntry,
  JannahGate,
  JannahPromisedEntry,
  JannahTopic,
  JannahVerseEntry,
} from "../../types/jannah";
import type { DeepPartial } from "./localize";

// Malay translation overlay for the Learn Jannah content. Mirrors the order of
// JANNAH_TOPICS in ../jannah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated.

export const JANNAH_TOPICS_MS: DeepPartial<JannahTopic>[] = [
  {
    title: "Apa itu Jannah?",
    summary: "Taman abadi yang Allah siapkan bagi orang-orang yang saleh.",
    body: [
      "Jannah (Syurga) adalah tempat tinggal kekal penuh ganjaran yang Allah siapkan bagi mereka yang beriman kepada-Nya dan beramal saleh. Secara bahasa, kata ini berarti taman yang rimbun dan teduh — tetapi Al-Quran menggunakannya untuk sebuah kenyataan yang jauh lebih agung daripada taman mana pun di bumi: sebuah alam berisi sungai-sungai, buah-buahan, istana, dan kebersamaan, tempat orang beriman hidup selamanya dalam keridaan Tuhannya. Inilah tujuan yang diserukan oleh setiap nabi, dan inilah destinasi yang menjadi inti seluruh perjalanan ini.",
      "Kehidupan di Jannah berbeda dari segala sesuatu di dunia ini kerana ia bebas dari setiap cacat yang merusak kebahagiaan duniawi. Tidak ada kematian, tidak ada penyakit, tidak ada penuaan, tidak ada rasa takut, tidak ada kesedihan, dan tidak ada keletihan. Penghuninya tidak pernah bertengkar, tidak pernah lelah, dan tidak pernah kehilangan yang mereka cintai. Apa pun yang diinginkan hati akan dikabulkan, dan Allah bahkan menambahkan lebih banyak lagi dari kemurahan-Nya — 'Mereka memperoleh di dalamnya apa yang mereka kehendaki, dan pada sisi Kami ada tambahannya' (Quran 50:35).",
      "Kenikmatan Syurga berada di luar jangkauan imajinasi manusia. Dalam sebuah hadis qudsi, Allah berfirman bahawa Dia telah menyiapkan bagi hamba-hamba-Nya yang saleh apa yang belum pernah dilihat mata, belum pernah didengar telinga, dan belum pernah terlintas di hati manusia. Oleh itulah sebabnya Al-Quran menggambarkan Syurga dengan citra yang familiar — taman-taman, sungai-sungai, dan naungan — sembari mengingatkan bahawa kenyataannya jauh melampaui setiap penggambaran. Ganjaran terbesar dari semuanya bukanlah taman-taman itu sendiri, melainkan keridaan Allah, dan bagi yang berderajat tertinggi, kehormatan memandang wajah-Nya yang mulia.",
      "Seorang mukmin harus memegang dua kebenaran sekaligus. Pertama, Syurga itu nyata, dekat, dan layak diperjuangkan dengan segenap usaha — Al-Quran memerintahkan kita untuk 'berlomba-lomba' menujunya (Quran 3:133). Kedua, tidak ada seorang pun yang meraih Syurga semata-mata dengan amalnya; masuknya pada akhirnya adalah kerana rahmat Allah, dengan iman yang tulus dan amal saleh sebagai sarana yang Dia pilih untuk diterima. Keseimbangan ini menjaga harapan tetap hidup tanpa menumbuhkan kesombongan: kita berusaha sekuat tenaga, lalu menyerahkan diri sepenuhnya pada rahmat-Nya.",
      "Secara praktis, biarkan kenyataan tentang Jannah membentuk pilihan harianmu. Ketika ibadat terasa berat atau godaan terasa kuat, ingatlah apa yang menanti dan apa yang dipertaruhkan. Mintalah Syurga kepada Allah dengan sering, berusahalah untuknya secara konsisten dengan cara-cara kecil yang berkelanjutan, dan biarkan kerinduan padanya melembutkan hatimu dalam kehidupan yang fana ini.",
    ],
    quran: [
      {
        excerpt:
          "Bukanlah menghadapkan wajahmu ke arah timur dan barat itu suatu kebajikan, akan tetapi sesungguhnya kebajikan itu ialah beriman kepada Allah, hari kemudian, malaikat-malaikat, kitab-kitab, nabi-nabi…",
      },
      {
        excerpt:
          "Allah menjanjikan kepada laki-laki dan perempuan yang mukmin, (akan mendapat) syurga yang di bawahnya mengalir sungai-sungai, kekal mereka di dalamnya, dan (mendapat) tempat-tempat yang bagus di syurga 'Adn. Dan keridaan Allah adalah lebih besar.",
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
          "Sesungguhnya orang-orang yang beriman dan beramal saleh, bagi mereka adalah syurga Firdaus menjadi tempat tinggal.",
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
    appLinks: [{}, {}],
  },
  {
    title: "Tingkatan di Syurga",
    summary: "Syurga memiliki banyak derajat — bukan tangga tetap berjumlah tujuh.",
    body: [
      "Syurga bukanlah satu tempat datar yang seragam; ia memiliki banyak derajat, disebut darajat, dan orang-orang beriman diangkat di dalamnya sesuai dengan iman dan amal mereka. Salah satu kesalahpahaman yang sangat umum adalah bahawa Jannah memiliki tepat tujuh tingkatan. Ini mencampuradukkan dua hal yang berbeda: Al-Quran berbicara tentang tujuh langit (samawat) — lapisan langit yang diciptakan di atas kita — bukan tujuh tingkatan tetap Syurga. Nas-nas tidak pernah membatasi Jannah pada tujuh derajat.",
      "Apa yang diberitahukan sumber-sumber sahih kepada kita adalah bahawa derajat-derajat itu sangat banyak dan luas. Nabi ﷺ bersabda bahawa Syurga memiliki seratus tingkat yang Allah siapkan bagi orang-orang yang berjuang di jalan-Nya, dan jarak antara satu tingkat dengan tingkat berikutnya bagaikan jarak antara langit dan bumi. Bahkan angka ini menunjuk pada keluasan, bukan pada tangga kaku yang boleh kita daki dengan mencentang daftar.",
      "Allah mengangkat setiap mukmin sesuai dengan kekuatan imannya, ketulusan niatnya, dan bobot amalnya — 'Dan masing-masing orang memperoleh derajat-derajat (seimbang) dengan apa yang dikerjakannya' (Quran 6:132). Derajat pasti yang dicapai setiap orang hanya diketahui oleh Allah. Wahyu dengan sengaja tidak memberi kita daftar mekanis 'lakukan amal X untuk mencapai tingkat N', kerana ibadat dimaksudkan untuk didorong oleh cinta dan keikhlasan, bukan dengan menghitung derajat.",
      "Hikmah di balik ini sungguh indah. Jika kita mengetahui posisi kita secara pasti, sebahagian akan menjadi lengah dan sebahagian lagi akan berputus asa. Sebaliknya, kita diajarkan untuk terus memandang kepada Allah, terus berusaha, dan terus berharap. Orang beriman berlomba dalam kebaikan — 'maka hendaklah orang yang berlomba-lomba berlomba dalam hal ini' — sambil menyerahkan penilaian akhir kepada Yang Mahaadil.",
      "Maka daripada membidik tingkatan bernomor, bidiklah yang tertinggi dan biarkan Allah menempatkanmu di mana Dia kehendaki. Nabi ﷺ mengajarkan para sahabat untuk tidak puas dengan permintaan yang biasa-biasa sahaja, tetapi meminta secara khusus Al-Firdaus, puncak tertinggi Syurga.",
    ],
    quran: [
      {
        excerpt:
          "Dan masing-masing orang memperoleh derajat-derajat (seimbang) dengan apa yang dikerjakannya.",
      },
      {
        excerpt:
          "Perhatikanlah bagaimana Kami lebihkan sebahagian dari mereka atas sebahagian (yang lain). Dan sesungguhnya kehidupan akhirat lebih tinggi tingkatnya dan lebih besar keutamaannya.",
      },
      {
        excerpt:
          "Dan barang siapa yang menaati Allah dan Rasul-Nya, mereka itu akan bersama-sama dengan orang-orang yang dianugerahi nikmat oleh Allah, iaitu para nabi, para siddiqin, orang-orang yang mati syahid, dan orang-orang saleh. Dan mereka itulah teman yang sebaik-baiknya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Syurga memiliki seratus tingkat yang Allah siapkan bagi orang-orang yang berjuang di jalan-Nya. Jarak antara setiap dua tingkat bagaikan jarak antara langit dan bumi. Maka apabila kamu meminta kepada Allah, mintalah Al-Firdaus, kerana ia adalah bahagian Syurga yang terbaik dan tertinggi.",
      },
      {
        excerpt:
          "Apabila kamu meminta kepada Allah, mintalah Al-Firdaus, kerana ia adalah bahagian Syurga yang tertinggi dan pertengahan Syurga, dan darinyalah mengalir sungai-sungai Syurga, dan di atasnya adalah Arsy Yang Maha Pengasih.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Al-Firdaus — yang tertinggi",
    summary: "Puncak Syurga, paling dekat dengan Arsy.",
    body: [
      "Al-Firdaus adalah tingkatan Syurga yang tertinggi dan paling utama yang disebutkan dalam Sunnah yang sahih. Nabi ﷺ menggambarkannya sebagai yang terbaik dari Syurga dan pertengahannya — jantungnya yang sejati — tempat mengalirnya sungai-sungai Syurga, dan di atasnya adalah Arsy Yang Maha Pengasih. Mencapai Al-Firdaus berarti berada sedekat mungkin dengan Allah seperti makhluk ciptaan boleh capai.",
      "Yang membuat topik ini begitu praktis adalah sebuah tuntunan kenabian: ketika kita berdoa memohon Syurga, kita tidak boleh membidik rendah. Nabi ﷺ mengajarkan para sahabat bahawa ketika mereka meminta Syurga kepada Allah, mereka hendaknya meminta secara khusus Al-Firdaus, bukannya puas dengan permintaan yang lebih rendah. Kemurahan Allah tidak terbatas, sehingga merupakan suatu kekurangan jika kita hanya meminta yang minimal dari-Nya. Ini mengajarkan kita keberanian bercita-cita tinggi dalam ibadat: bidiklah puncaknya, dan biarkan Allah, dengan rahmat-Nya, memutuskan di mana menempatkanmu.",
      "Bagaimana seorang hamba menjadi layak untuk derajat seperti itu? Sarana-sarananya sama dengan sarana yang mengantar menuju Syurga itu sendiri, ditempuh dengan keunggulan: akidah yang benar (tauhid) yang dipegang dengan tulus, pemenuhan yang cermat atas kewajiban-kewajiban yang Allah perintahkan, kemudian kehidupan ibadat sunah yang terus bertambah di atasnya — solat malam, puasa tambahan, zikir, sedekah, dan akhlak yang baik. Dalam sebuah hadis qudsi yang terkenal, Allah menggambarkan bagaimana hamba terus mendekat kepada-Nya melalui amalan-amalan sunah hingga Allah mencintainya.",
      "Namun anugerah terakhir dan penentu selalu adalah rahmat Allah. Dalam napas yang sama saat kita membidik yang tertinggi, kita mengingat sabda Nabi ﷺ sendiri: tidak seorang pun masuk Syurga semata-mata kerana amalnya — bahkan Nabi ﷺ sendiri pun tidak — kecuali bahawa Allah menyelimutinya dengan rahmat-Nya. Inilah keseimbangan sempurna yang dipegang orang beriman: harapan dan cita-cita yang tinggi di satu sisi, kerendahan hati yang tulus di sisi lain.",
      "Maka jadikanlah Al-Firdaus bahagian tetap dari doamu — dalam sujud, di sepertiga malam terakhir, dan sebelum tidur — sementara engkau diam-diam berusaha sebaik mungkin setiap hari dan bersandar sepenuhnya pada rahmat Tuhanmu untuk selebihnya.",
    ],
    hadith: [
      {
        excerpt:
          "Apabila kamu meminta kepada Allah, mintalah Al-Firdaus, kerana ia adalah bahagian Syurga yang tertinggi dan pertengahan Syurga, dan darinyalah mengalir sungai-sungai Syurga, dan di atasnya adalah Arsy Yang Maha Pengasih.",
      },
      {
        excerpt:
          "Tidak seorang pun di antara kamu yang masuk Syurga semata-mata kerana amalnya. Para sahabat bertanya: Tidak juga engkau, wahai Rasulullah? Baginda bersabda: Tidak juga aku, kecuali bahawa Allah menyelimutiku dengan rahmat-Nya.",
      },
    ],
    actions: [
      "Mintalah Al-Firdaus kepada Allah dalam doamu, terutamanya saat sujud dan sebelum tidur.",
      "Sempurnakan apa yang wajib atasmu, lalu perbanyak ibadat sunah.",
      "Perbarui tobat dengan sering, dan bersandarlah pada rahmat Allah, bukan semata pada amalmu.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Apa yang membahayakan akhirat",
    summary: "Dosa besar memerlukan tobat yang tulus; ampunan Allah sangat luas.",
    body: [
      "Bahagian ini tidak dimaksudkan untuk menakutimu hingga putus asa — justru sebaliknya. Allah mengampuni semua dosa bagi orang yang kembali kepada-Nya dengan tulus, dan Dia menyatakannya dengan kata-kata paling tegas: 'Katakanlah: Wahai hamba-hamba-Ku yang melampaui batas terhadap diri mereka sendiri, janganlah kamu berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni dosa-dosa semuanya' (Quran 39:53). Tujuan di sini hanyalah untuk mengetahui apa yang diperingatkan oleh nas-nas, supaya kita mengenali bahaya dan segera kembali kepada-Nya sebelum terlambat.",
      "Ada satu dosa yang berdiri terpisah dari semua yang lain: syirik — menyekutukan sesuatu dengan Allah dalam ibadat. Ini adalah satu-satunya dosa yang tidak akan Allah ampuni jika seseorang meninggal dunia dalam keadaan itu tanpa bertobat, seperti Dia nyatakan dengan jelas dalam Quran 4:48. Segala sesuatu yang lain termasuk dalam 'Dia mengampuni apa (dosa) yang selain dari (syirik) itu, bagi siapa yang dikehendaki-Nya'. Inilah sebabnya tauhid yang benar adalah fondasi di bawah setiap amal yang diterima: rumah yang dibangun di atas fondasi retak tidak boleh berdiri.",
      "Selepas syirik, nas-nas memberikan bobot khusus pada meninggal duniakan solat. Mengabaikan lima waktu solat secara terus-menerus dan tanpa uzur yang sah termasuk di antara peringatan-peringatan paling berat dalam Sunnah — Nabi ﷺ menyebut solat sebagai perjanjian yang membedakan orang beriman, sedemikian rupa sehingga meninggal duniakannya mendekati kekufuran. Dosa-dosa besar lainnya — pembunuhan yang tidak sah, hubungan yang tidak halal, memakan riba, memakan harta anak yatim, dan kezaliman yang berat — adalah perkara serius yang memerlukan tobat yang tulus dan boleh mendatangkan hukuman jika Allah tidak mengampuni.",
      "Dosa-dosa yang disebut 'kecil' pun penting dan tidak boleh pernah dianggap remeh. Gibah, dusta, kesombongan, memutus silaturahmi, dan kelalaian perlahan-lahan mengikis hati dan akhlak. Nabi ﷺ memperingatkan bahawa dosa-dosa kecil yang menumpuk boleh membinasakan seseorang seperti ranting-ranting kecil yang dikumpulkan boleh memasak satu hidangan penuh. Masing-masing memerlukan kembali kepada Allah tersendiri.",
      "Intinya adalah harapan dalam tindakan: jangan pernah biarkan besarnya suatu dosa meyakinkanmu bahawa tobat itu sia-sia. Kembalilah kepada Allah begitu engkau tergelincir, ikuti perbuatan buruk dengan perbuatan baik untuk menghapusnya, dan jagalah pintu istigfar terbuka setiap hari. Rahmat-Nya selalu lebih besar daripada kesalahanmu.",
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
          "Perjanjian antara kami dan mereka adalah solat; barang siapa meninggal duniakannya, ia telah kafir.",
      },
    ],
    appLinks: [{}, {}],
    disclaimer:
      "Daftar dosa besar dalam fikih berbeda-beda antar ulama, dan penilaian atas individu adalah wewenang orang yang berilmu. Ini adalah pengingat umum untuk bertobat — bukan vonis pribadi. Konsultasikan situasimu dengan ulama yang tepercaya.",
  },
  {
    title: "Mereka yang dimuliakan dalam nas",
    summary: "Orang-orang dan kelompok yang disebutkan Nabi ﷺ berkaitan dengan Syurga.",
    body: [
      "Al-Quran dan Sunnah menonjolkan individu-individu tertentu, kategori-kategori orang beriman, dan amal-amal tertentu yang dikaitkan dengan kabar gembira Syurga. Penting bagi memahami ini dengan benar: ini adalah kabar yang jujur tentang orang-orang atau sifat-sifat tertentu tersebut — bukan jaminan yang boleh dipindahkan kepada siapa pun yang sekadar mendengar nama mereka atau mengaguminya. Kabar gembira itu bergantung pada iman dan amal mereka, dan pintu yang sama terbuka bagi kita melalui sarana yang sama.",
      "Kelompok paling terkenal adalah Sepuluh yang Dijanjikan Syurga (al-'Asyrah al-Mubasysyarah), disebutkan bersama oleh Nabi ﷺ dalam satu riwayat: Abu Bakar, Umar, Utsman, Ali, Thalhah, Zubair, Abdurrahman bin Auf, Sa'ad bin Abi Waqqash, Sa'id bin Zaid, dan Abu Ubaidah bin Al-Jarrah (semoga Allah meridai mereka semua). Mereka adalah sahabat Nabi ﷺ yang paling dekat dan paling banyak berkorban, dan Ahlus Sunnah mencintai serta memuliakan mereka semua tanpa berlebihan atau merendahkan siapa pun di antara mereka.",
      "Di luar individu-individu yang disebutkan namanya, nas-nas menggambarkan kategori-kategori yang diberi kabar gembira: orang-orang yang jujur dan sabar, mereka yang mati sebagai syahid sejati di jalan Allah sesuai syariat Islam, dan mereka yang kata-kata terakhirnya dalam hidup ini adalah kalimat tauhid, la ilaha illallah. Setiap sifat menunjuk pada suatu kenyataan batin — keikhlasan, pengorbanan, atau hati yang terpaut kepada Allah pada napas terakhir — bukan sekadar label lahiriah.",
      "Pengajaran bagi kita bukanlah merasa aman kerana keterkaitan, ataupun mengklaim derajat-derajat ini untuk diri kita sendiri, melainkan supaya terinspirasi. Biarkan teladan mereka menarik kita ke atas: cintailah apa yang mereka cintai, berjuanglah seperti mereka berjuang, dan ubahlah kekaguman itu menjadi doa dan amal, memohon di atas segalanya kepada Allah husnul khatimah — akhir yang baik.",
    ],
    hadith: [
      {
        excerpt:
          "Abu Bakar di Syurga, Umar di Syurga, Utsman di Syurga, Ali di Syurga, Thalhah di Syurga, Zubair di Syurga, Abdurrahman bin Auf di Syurga, Sa'ad di Syurga, Sa'id bin Zaid di Syurga, dan Abu Ubaidah bin Al-Jarrah di Syurga.",
      },
      {
        excerpt:
          "Barang siapa yang kata-kata terakhirnya adalah 'Tiada tuhan selain Allah' akan masuk Syurga.",
      },
    ],
    disclaimer:
      "Kabar gembira dalam hadis merujuk pada mereka yang disebutkan namanya atau kategori yang digambarkan. Ini tidak menggantikan kebutuhan akan iman, amal, dan akhir yang baik bagi diri seseorang. Allah yang paling mengetahui.",
  },
  {
    title: "Tauhid — akidah yang benar",
    summary: "Tidak ada amal yang diterima tanpa tauhid yang tulus.",
    body: [
      "Tauhid berarti mengesakan Allah semata dalam ibadat — meyakini bahawa hanya Dia Tuhan dan Pencipta, hanya Dia yang berhak disembah, dan bahawa Dia Maha Esa dalam nama-nama dan sifat-sifat-Nya. Inilah pesan yang dibawa oleh setiap nabi dan hal pertama yang menjadi pintu masuk seseorang ke dalam Islam. Kerana ini menyangkut Zat yang kita sembah, inilah fondasi tempat seluruh bangunan agama berdiri.",
      "Kepentingannya tidak boleh dilebih-lebihkan: Allah tidak menerima amal apa pun dari orang yang menyekutukan-Nya. 'Jika kamu mempersekutukan (Allah), pasti akan hapuslah amalmu' (Quran 39:65). Gunungan amal saleh yang dibangun di atas syirik tidak memiliki bobot sama sekali pada Hari Kiamat, sementara amal terkecil yang dibangun di atas tauhid yang murni boleh menjadi sangat berat. Inilah sebabnya menjaga akidah bahkan lebih mendesak daripada memperbanyak amal.",
      "Tauhid juga menuntut keikhlasan, disebut ikhlas — bahawa kita menyembah Allah 'dengan memurnikan ketaatan kepada-Nya dalam (menjalankan) agama' (Quran 98:5). Bahaya tersembunyi di sini adalah riya, iaitu beribadat untuk dilihat dan dipuji orang. Nabi ﷺ memperingatkan bahawa riya yang tersembunyi pun boleh diam-diam merusak sebuah amal. Obatnya adalah terus-menerus memperbarui niat: sebenarnya untuk siapa aku melakukan ini? Keikhlasan adalah yang mengubah amal biasa menjadi ibadat yang berharga.",
      "Hikmah menjadikan tauhid sebagai fondasi adalah bahawa ia membebaskan hati. Orang yang menyembah Allah semata dibebaskan dari rasa takut kepada makhluk, dari mengejar restu semua orang, dan dari keletihan melayani banyak tuan. Hidupnya memperoleh satu arah yang jelas: meridakan Yang menciptakannya.",
      "Secara praktis, pelajarilah akidah yang benar dari ulama yang tepercaya, murnikan ibadatmu dari syirik dan kemunafikan, dan periksalah niatmu sebelum bertindak. Langkah pertama ini bukan opsional atau lanjutan — di sinilah setiap jalan menuju Syurga dimulai.",
    ],
    quran: [
      {
        excerpt:
          "Dan sesungguhnya telah diwahyukan kepadamu dan kepada (nabi-nabi) yang sebelummu: Jika kamu mempersekutukan (Allah), pasti akan hapuslah amalmu dan tentulah kamu termasuk orang-orang yang merugi.",
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
      "Perbarui niatmu sebelum beribadat.",
      "Mohonlah ampunan atas riya yang tersembunyi.",
    ],
  },
  {
    title: "Salah — sang tiang",
    summary: "Menjaga lima waktu salah termasuk di antara amal yang paling agung.",
    body: [
      "Salah — lima waktu salah wajib — adalah rukun kedua Islam dan amal ibadat harian yang paling utama. Nabi ﷺ menggambarkan salah sebagai tiang agama: siapa yang menegakkannya telah menegakkan agama, dan siapa yang meninggal duniakannya telah merobohkan banyak hal yang menopangnya. Salah adalah lima pertemuan harian orang beriman dengan Tuhannya, berdiri, rukuk, dan sujud dalam hubungan langsung dengan Allah.",
      "Kedudukannya tak tertandingi di antara amal-amal praktis kerana apa yang Nabi ﷺ sabdakan tentang Hari Kiamat: perkara pertama yang akan dihisab dari seorang hamba adalah salahnya. Jika ia baik, maka baiklah seluruh amalnya; jika ia rusak, maka amal yang lain pun dalam bahaya. Di dunia ini pun, salah adalah sarana penyucian — Nabi ﷺ mengumpamakan lima waktu salah dengan sungai yang mengalir di depan pintu seseorang: siapa yang mandi di dalamnya lima kali sehari, tidak akan tersisa kotoran padanya, dan begitulah salah menghapus dosa-dosa kecil.",
      "Namun salah dimaksudkan untuk lebih dari sekadar gerakan fisik. Al-Quran memuji 'orang-orang yang khusyuk dalam solatnya' (Quran 23:1–2) dan memuliakan 'orang-orang yang tetap setia melaksanakan solatnya' (Quran 70:22–23). Dua hal yang paling penting: khusyuk — hati yang hadir dan rendah hati yang menyadari bahawa ia sedang berdiri di hadapan Allah — dan konsistensi, menjaga setiap salah pada waktunya. Salah berjamaah, bagi yang mampu, melipatgandakan pahala berkali-kali lipat.",
      "Hikmah mendalam dari salah adalah transformasi. Salah yang dilaksanakan dengan benar mencegah seseorang dari perbuatan keji dan mungkar; ia adalah pengatur ulang berulang yang menarik kembali hati kepada Allah di tengah hari yang sibuk. Oleh sebab itu, meninggal duniakan salah tanpa uzur yang sah adalah perkara serius yang memerlukan tobat yang tulus dan mengqada-nya. Salah sunah dan rawatib — salah sunah sebelum dan sesudah yang wajib — menambahkan cahaya lebih dan mengangkat derajat.",
      "Secara praktis: jagalah lima waktu salah pada waktunya sebagai prioritas utamamu, gantilah (qaza) salah yang terlewat, dan tambahkan salah sunah yang boleh kau lakukan secara konsisten. Jika salahmu membaik, seluruh ibadatmu yang lain cenderung membaik bersamanya.",
    ],
    quran: [
      {
        excerpt:
          "Sesungguhnya beruntunglah orang-orang yang beriman, (iaitu) orang-orang yang khusyuk dalam solatnya.",
      },
      {
        excerpt:
          "Kecuali orang-orang yang mengerjakan solat, yang mereka tetap setia melaksanakan solatnya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Perkara pertama yang akan dihisab dari seorang hamba pada Hari Kiamat adalah salahnya. Jika ia baik, maka ia beruntung dan berhasil; dan jika ia rusak, maka ia gagal dan merugi.",
      },
      {
        excerpt:
          "Seandainya ada sungai di depan pintu salah seorang dari kamu, lalu ia mandi di dalamnya lima kali sehari, apakah masih tersisa kotoran padanya? Para sahabat menjawab: Tidak. Baginda bersabda: Itulah perumpamaan lima waktu salah — dengannya Allah menghapus dosa-dosa.",
      },
    ],
    actions: [
      "Jagalah lima waktu salah pada waktunya.",
      "Qadalah salah yang terlewat dengan tulus.",
      "Tambahkan salah sunah sebelum dan sesudah yang wajib jika memungkinkan.",
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Tobat yang tulus",
    summary: "Allah mencintai mereka yang terus-menerus kembali kepada-Nya.",
    body: [
      "Tobat adalah kembali kepada Allah selepas berbuat dosa. Tobat yang tulus (tobat nasuha) memiliki rukun yang jelas: penyesalan yang tulus dalam hati atas apa yang telah dilakukan, segera menghentikan dosa itu, dan tekad yang kukuh untuk tidak pernah mengulanginya — dan jika dosa itu melibatkan kezaliman terhadap orang lain, mengembalikan haknya atau meminta maaf kepadanya. Ini bukan peristiwa sekali sahaja, melainkan kembali seumur hidup, sebuah pintu yang Allah jaga tetap terbuka bagi setiap orang beriman.",
      "Kepentingannya adalah bahawa tidak ada manusia yang bebas dari dosa, sehingga tobat bukan untuk segelintir pendosa, melainkan untuk semua orang. Nabi ﷺ bersabda bahawa setiap anak Adam berbuat dosa, dan sebaik-baik orang yang berbuat dosa adalah mereka yang bertobat. Allah menerima tobat seorang hamba hingga saat ruh mencapai kerongkongan menjelang kematian, dan bahkan terbitnya matahari dari barat adalah batas waktu bagi dunia ini — hingga saat itu, undangan tetap terbuka.",
      "Yang mengagumkan, Allah tidak sekadar menerima hamba yang kembali — Dia bergembira. Nabi ﷺ menggambarkan Allah lebih bergembira atas tobat hamba-Nya daripada seseorang yang, tersesat di padang gurun yang tandus, berputus asa dari kehidupan selepas untanya hilang membawa seluruh perbekalan makanan dan minumannya, lalu tiba-tiba menemukannya kembali. Gambaran kegembiraan yang meluap itu memberi tahu kita betapa dicintainya hamba yang bertobat di sisi Tuhannya.",
      "Hikmahnya sangat dalam: dosa tidak harus menjadi akhir dari kisah seseorang. 'Allah akan mengganti kejahatan mereka dengan kebajikan' (Quran 25:70) — tobat yang tulus boleh mengubah catatan kegagalan menjadi keberhasilan, dan boleh mengubah keterjatuhan menjadi awal baru yang membawa seseorang lebih dekat kepada Allah daripada sebelumnya. Putus asa selepas berbuat dosa itu sendiri adalah jebakan setan; harapan pada rahmat Allah adalah jawaban orang beriman.",
      "Secara praktis: jangan menunda tobat walau sehari — kembalilah begitu engkau tergelincir. Ikuti setiap perbuatan buruk dengan perbuatan baik untuk menghapusnya, dan jagalah istigfar terus mengalir di lidahmu sepanjang hari, seperti Nabi ﷺ memohon ampunan berkali-kali setiap hari walaupun baginda telah diampuni.",
    ],
    quran: [
      {
        excerpt:
          "Wahai orang-orang yang beriman, bertobatlah kepada Allah dengan tobat yang semurni-murninya, mudah-mudahan Tuhanmu akan menghapus kesalahan-kesalahanmu dan memasukkanmu ke dalam syurga yang mengalir di bawahnya sungai-sungai.",
      },
      {
        excerpt:
          "Kecuali orang-orang yang bertobat, beriman, dan mengerjakan amal saleh; maka Allah akan mengganti kejahatan mereka dengan kebajikan. Dan Allah Maha Pengampun lagi Maha Penyayang.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah lebih bergembira dengan tobat hamba-Nya daripada seseorang di antara kamu yang, selepas kehilangan untanya di padang tandus, tiba-tiba menemukannya kembali.",
      },
    ],
    actions: [
      "Bertobatlah segera saat engkau berbuat dosa — jangan menunda.",
      "Ikuti dosa dengan perbuatan baik untuk menghapusnya.",
      "Ucapkanlah istigfar sepanjang hari.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Al-Quran",
    summary: "Bacalah, hafalkanlah, dan amalkanlah Kitab Allah.",
    body: [
      "Al-Quran adalah firman Allah yang sebenarnya, diturunkan sebagai petunjuk, rahmat, dan penyembuh bagi hati. Membangun hubungan dengannya — membacanya, merenungkan maknanya, mengamalkan perintah-perintahnya, dan mengajarkannya kepada orang lain — termasuk di antara ibadat yang paling agung dan paling berpahala yang boleh ditekuni seorang mukmin sepanjang hidupnya. Ia adalah tali Allah yang terulur kepada kita; siapa yang berpegang teguh padanya akan dituntun ke jalan yang lurus.",
      "Pahala yang menyertainya luar biasa. Nabi ﷺ mengajarkan bahawa Allah memberikan kepada mereka yang membaca Kitab-Nya dan menegakkan salah, ganjaran besar yang tidak akan pernah musnah (Quran 35:29–30), dan bahawa setiap satu huruf yang dibaca menboleh pahala yang dilipatgandakan sepuluh kali. Bahkan orang yang tertatih-tatih dan bersusah payah dengan kata-katanya, selama ia terus berusaha, menboleh pahala ganda — satu untuk bacaannya dan satu untuk usahanya.",
      "Al-Quran juga mengangkat derajat seseorang di kehidupan berikutnya dengan cara yang jelas dan nyata. Nabi ﷺ bersabda bahawa sahabat Al-Quran akan dikatakan kepadanya pada Hari Kiamat: 'Bacalah dan naiklah, dan bacalah seperti engkau dulu membaca di dunia, kerana kedudukanmu berada pada ayat terakhir yang engkau baca.' Dengan kata lain, kedudukan seseorang di Syurga meningkat sejalan dengan bahagiannya dari Kitab tersebut — dorongan yang kuat untuk terus menghafal dan mengulang.",
      "Namun tujuan yang lebih dalam bukanlah bacaan demi bacaan itu sendiri, melainkan transformasi. Allah memerintahkan kita untuk 'membaca Al-Quran dengan tartil' (Quran 73:4) justru supaya maknanya meresap dan membentuk ulang cara kita berpikir, merasa, dan berperilaku. Al-Quran diturunkan untuk dijalani, bukan sekadar dibaca; para sahabat mempelajari sepuluh ayat dan tidak melangkah maju sampai mereka memahaminya dan mengamalkannya.",
      "Secara praktis: bacalah sebahagian setiap hari, walau hanya beberapa ayat, tetapi bacalah dengan perenungan. Hafalkan surah-surah baru atau jagalah yang sudah kau hafal, dan — yang terpenting — amalkan apa yang kau pelajari sebelum bergegas mempelajari lebih banyak lagi.",
    ],
    quran: [
      {
        excerpt:
          "Sesungguhnya orang-orang yang selalu membaca kitab Allah dan mendirikan solat dan menafkahkan sebahagian dari rezeki yang Kami anugerahkan kepada mereka dengan diam-diam dan terang-terangan, mereka itu mengharapkan perniagaan yang tidak akan merugi, supaya Allah menyempurnakan kepada mereka pahalanya dan menambah kepada mereka dari karunia-Nya.",
      },
      {
        excerpt: "Dan bacalah Al-Quran itu dengan perlahan-lahan (tartil).",
      },
    ],
    hadith: [
      {
        excerpt:
          "Akan dikatakan kepada sahabat Al-Quran: Bacalah dan naiklah, dan bacalah seperti engkau dulu membaca di dunia, kerana kedudukanmu berada pada ayat terakhir yang engkau baca.",
      },
    ],
    actions: [
      "Bacalah setiap hari — walau beberapa ayat dengan perenungan.",
      "Hafalkan surah-surah baru atau jagalah yang sudah kau hafal.",
      "Amalkan apa yang kau pelajari sebelum mencari lebih banyak.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Zikir — mengingat Allah",
    summary: "Ringan di lidah, berat di timbangan.",
    body: [
      "Zikir berarti mengingat Allah — menghadirkan-Nya di hati dan lidah melalui kata-kata pengagungan (subhanallah), pujian (alhamdulillah), pembesaran (Allahu akbar), penegasan keesaan-Nya (la ilaha illallah), dan permohonan ampun (istigfar). Dari semua jalan menuju Syurga, zikir termasuk yang paling mudah dilakukan namun paling besar pahalanya, kerana boleh dilakukan di mana sahaja, dalam keadaan apa pun, kapan pun.",
      "Allah sendiri memerintahkannya dengan penuh kemurahan — 'Wahai orang-orang yang beriman, berzikirlah (dengan menyebut nama) Allah, zikir yang sebanyak-banyaknya' (Quran 33:41–42) — dan menjanjikan buah yang unik baginya: ketenteraman hati. 'Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram' (Quran 13:28). Dalam dunia yang gelisah dan cemas, ini adalah salah satu anugerah terbesar zikir. Nabi ﷺ juga menimbang pahalanya, bersabda bahawa ada dua kalimat yang ringan di lidah namun berat di timbangan dan dicintai oleh Yang Maha Pengasih: 'subhanallahi wa bihamdihi, subhanallahil-'azhim'.",
      "Sebuah kategori khusus adalah zikir pagi dan petang — doa-doa sahih yang Nabi ﷺ ajarkan untuk dua ujung hari. Ini bekerja seperti benteng spiritual, menjaga orang beriman dari bahaya dan menarik perlindungan dan keridaan Allah. Hanya beberapa menit di awal dan akhir setiap hari, diucapkan dengan kehadiran hati, diam-diam membentuk ulang hati seiring waktu.",
      "Hikmah zikir adalah bahawa ia menjaga hubungan dengan Allah tetap hidup di sela-sela amal ibadat formal. Lidah yang basah dengan zikir dan — yang lebih penting — hati yang mengingat Allah dalam pilihan-pilihan hariannya, berhenti sejenak sebelum marah, sebelum berbelanja, sebelum mengambil keputusan — itulah tujuan sesungguhnya. Zikir tidak dimaksudkan untuk tinggal di bibir sahaja; ia dimaksudkan untuk mengarahkan kehidupan.",
      "Secara praktis: jadikan zikir pagi dan petang sebagai kebiasaan harian, jagalah sebahagian sederhana tasbih, istigfar, atau selawat tetap mengalir di waktu-waktu luang, dan ingatlah Allah terutamanya sebelum tidur dan selepas bangun. Konsistensi dalam sedikit lebih baik daripada semangat sesaat dalam jumlah banyak.",
    ],
    quran: [
      {
        excerpt:
          "(Iaitu) orang-orang yang beriman dan hati mereka menjadi tenteram dengan mengingat Allah. Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.",
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
      "Ingatlah Allah sebelum tidur dan selepas bangun.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Sedekah & zakat",
    summary: "Berinfaklah dari apa yang Allah berikan — secara tersembunyi maupun terang-terangan.",
    body: [
      "Islam memerintahkan orang beriman untuk berinfak dari harta yang Allah percayakan kepadanya, baik secara wajib maupun sukarela. Zakat adalah kewajiban tahunan atas harta yang telah mencapai nisab — salah satu dari lima rukun Islam — dan ia wajib, bukan opsional, bagi mereka yang memenuhi syarat-syaratnya. Di luar itu ada sedekah: pemberian sukarela dalam jumlah berapa pun, kapan pun, kerana Allah.",
      "Pahala berinfak di jalan Allah dilipatgandakan melampaui hitungan biasa. Allah mengumpamakan orang yang berinfak di jalan-Nya seperti sebutir benih yang menumbuhkan tujuh bulir, setiap bulir berisi seratus biji — 'Allah melipatgandakan (ganjaran) bagi siapa yang Dia kehendaki' (Quran 2:261). Alih-alih mengurangi harta, sedekah menyucikannya dan menambah keberkahannya, serta memadamkan dosa seperti air memadamkan api.",
      "Dua bentuk sedekah patut menboleh perhatian khusus. Yang pertama adalah sedekah tersembunyi, diberikan dengan begitu diam-diam sehingga, seperti digambarkan Nabi ﷺ, tangan kiri tidak mengetahui apa yang diberikan tangan kanan — keikhlasan ini sangat dicintai Allah dan akan menaungi seseorang pada Hari Kiamat. Yang kedua adalah sedekah jariah, sedekah yang terus mengalir yang manfaatnya berlanjut selepas kematian. Nabi ﷺ bersabda bahawa ketika seseorang meninggal dunia, amalnya terputus kecuali tiga: sedekah jariah, ilmu yang bermanfaat bagi orang lain, dan anak saleh yang mendoakannya.",
      "Hikmah sedekah adalah bahawa ia bekerja pada pemberi sama besarnya seperti pada penerima. Ia melonggarkan cengkeraman keserakahan dari hati, membangun rasa iba, memperkuat ikatan masyarakat, dan mengingatkan orang kaya bahawa ia adalah pemegang amanah, bukan pemilik sejati. Dan Islam meluaskan definisi sedekah sehingga tidak seorang pun terkecualikan: Nabi ﷺ mengajarkan bahawa senyum kepada saudaramu, perkataan yang bermanfaat, dan bahkan menyingkirkan benda berbahaya dari jalan adalah bentuk-bentuk sedekah.",
      "Secara praktis: jika engkau wajib berzakat, hitunglah dan bayarlah dengan akurat; berilah sedekah secara rutin, sekecil apa pun, supaya memberi menjadi kebiasaan bukan sekadar peristiwa; dan carilah sedekah jariah yang bertahan lama — membiayai seorang penuntut ilmu, membangun sumur, atau mendukung sebuah masjid — yang terus memberimu pahala jauh selepas engkau tiada.",
    ],
    quran: [
      {
        excerpt:
          "Perumpamaan (nafkah yang dikeluarkan oleh) orang-orang yang menafkahkan hartanya di jalan Allah adalah serupa dengan sebutir benih yang menumbuhkan tujuh bulir, pada tiap-tiap bulir seratus biji. Allah melipatgandakan (ganjaran) bagi siapa yang Dia kehendaki.",
      },
      {
        excerpt:
          "Dan infakkanlah sebahagian dari apa yang telah Kami berikan kepadamu sebelum datang kematian kepada salah seorang di antara kamu, lalu ia berkata: Ya Tuhanku, mengapa Engkau tidak menangguhkan (kematian)ku sampai waktu yang dekat, yang menyebabkan aku boleh bersedekah dan aku termasuk orang-orang yang saleh.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Apabila seorang manusia meninggal dunia dunia, maka terputuslah amalnya kecuali tiga perkara: sedekah jariah, ilmu yang bermanfaat, atau anak saleh yang mendoakannya.",
      },
    ],
    actions: [
      "Hitung dan bayarlah zakat jika engkau wajib atasnya.",
      "Berilah sedekah rutin, walau sedikit.",
      "Carilah peluang sedekah jariah.",
    ],
    appLinks: [{}],
  },
  {
    title: "Akhlak yang baik",
    summary: "Hal yang paling berat di timbangan boleh jadi adalah akhlak yang mulia.",
    body: [
      "Akhlak yang baik (husn al-khuluq) adalah kumpulan sifat mulia yang ditampilkan seorang mukmin dalam berinteraksi dengan makhluk Allah: kejujuran, kesabaran, kerendahan hati, kasih sayang, kedermawanan, kelembutan, dan menepati janji. Jauh dari sekadar kesopanan sosial, Islam menjadikan akhlak sebagai ukuran mendasar keimanan dan salah satu amal terberat yang boleh dibawa seseorang pada Hari Kiamat.",
      "Kedudukannya dinyatakan dengan kata-kata yang paling terang. Nabi ﷺ bersabda bahawa tidak ada sesuatu pun yang diletakkan di timbangan yang lebih berat daripada akhlak yang baik, dan bahawa orang beriman yang paling sempurna imannya adalah mereka yang paling baik akhlaknya. Baginda bahkan meringkas misinya sendiri dengan mengatakan bahawa baginda diutus untuk menyempurnakan akhlak yang mulia. Ini berarti cara engkau memperlakukan orang tuamu, pasanganmu, anak-anakmu, tetanggamu, bahkan orang asing, tidaklah terpisah dari ibadatmu — melainkan bahagian utamanya.",
      "Akhlak yang indah begitu kuat kerana apa yang Nabi ﷺ janjikan boleh dicapainya: dengan akhlaknya yang baik, seorang mukmin boleh mencapai derajat orang yang berpuasa sepanjang hari dan solat sepanjang malam. Dengan kata lain, akhlak yang unggul boleh mengangkat orang biasa ke tingkat para ahli ibadat yang paling tekun, kerana ia sulit, konstan, dan menguji ego di setiap kesempatan — menahan amarah, memaafkan penghinaan, dan memilih kelembutan ketika kekerasan lebih mudah.",
      "Hikmahnya adalah bahawa Islam bukan hanya hubungan pribadi antara seseorang dengan Allah; ia dimaksudkan untuk meluap ke dalam cara seseorang memperlakukan semua orang di sekitarnya. Seorang ahli ibadat yang solatnya tidak melembutkan sikapnya telah kehilangan intinya, sedangkan akhlak yang baik adalah dakwah itu sendiri, menarik orang menuju keimanan melalui teladan hidup. Inilah sebabnya nas-nas berulang kali memasangkan ibadat kepada Allah dengan keunggulan terhadap makhluk-Nya.",
      "Secara praktis: kerjakan satu sifat pada satu waktu — tahanlah lidahmu saat tersulut amarah, maafkanlah mereka yang menzalimimu, perbaikilah hubungan yang telah putus, dan tepatilah janjimu walaupun harus membayar mahal. Perenungan singkat setiap hari selepas salah tentang bagaimana engkau memperlakukan orang hari itu adalah cara sederhana untuk terus berkembang.",
    ],
    quran: [
      {
        excerpt: "Dan sesungguhnya engkau benar-benar berbudi pekerti yang agung.",
      },
      {
        excerpt:
          "(Iaitu) orang-orang yang menafkahkan (hartanya), baik di waktu lapang maupun sempit, dan orang-orang yang menahan amarahnya dan memaafkan (kesalahan) orang. Allah menyukai orang-orang yang berbuat kebajikan.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Tidak ada sesuatu pun yang lebih berat di timbangan seorang mukmin pada Hari Kiamat daripada akhlak yang baik. Dan sesungguhnya Allah membenci orang yang berkata keji dan kasar.",
      },
      {
        excerpt:
          "Orang beriman yang paling sempurna imannya adalah mereka yang paling baik akhlaknya, dan sebaik-baik kamu adalah yang paling baik terhadap istri-istrinya.",
      },
    ],
    actions: [
      "Berlatihlah bersabar ketika tersulut.",
      "Maafkanlah orang lain dan perbaikilah hubungan yang putus.",
      "Renungkan akhlakmu selepas salah dalam jurnal harian.",
    ],
    appLinks: [
      {},
      {
        label: "Sins against others",
      },
    ],
    characterTraits: [
      {
        title: "Kebenaran",
        summary: "Berpegang pada al-Quran dan Sunnah, lalu bertaubatlah hari ini.",
        quran: {
          excerpt: "Allah akan menegakkan neraca keadilan pada Hari Kiamat.",
        },
      },
      {
        title: "Kesabaran",
        summary: "Berpegang pada al-Quran dan Sunnah, lalu bertaubatlah hari ini.",
        quran: {
          excerpt: "Allah akan menegakkan neraca keadilan pada Hari Kiamat.",
        },
      },
      {
        title: "Menahan marah",
        summary: "Berpegang pada al-Quran dan Sunnah, lalu bertaubatlah hari ini.",
        quran: {
          excerpt: "Allah akan menegakkan neraca keadilan pada Hari Kiamat.",
        },
      },
      {
        title: "Memaafkan",
        summary: "Berpegang pada al-Quran dan Sunnah, lalu bertaubatlah hari ini.",
        quran: {
          excerpt: "Allah akan menegakkan neraca keadilan pada Hari Kiamat.",
        },
      },
      {
        title: "Rendah hati",
        summary: "Berpegang pada al-Quran dan Sunnah, lalu bertaubatlah hari ini.",
        quran: {
          excerpt: "Allah akan menegakkan neraca keadilan pada Hari Kiamat.",
        },
      },
      {
        title: "Amanah",
        summary: "Berpegang pada al-Quran dan Sunnah, lalu bertaubatlah hari ini.",
        quran: {
          excerpt: "Allah akan menegakkan neraca keadilan pada Hari Kiamat.",
        },
      },
      {
        title: "Berbakti kepada ibu bapa",
        summary: "Berpegang pada al-Quran dan Sunnah, lalu bertaubatlah hari ini.",
        quran: {
          excerpt: "Allah akan menegakkan neraca keadilan pada Hari Kiamat.",
        },
      },
      {
        title: "Kata-kata baik",
        summary: "Berpegang pada al-Quran dan Sunnah, lalu bertaubatlah hari ini.",
        hadith: {
          excerpt: "Dua kalimah ringan pada lidah, berat pada neraca.",
        },
      },
      {
        title: "Senyuman",
        summary: "Berpegang pada al-Quran dan Sunnah, lalu bertaubatlah hari ini.",
        hadith: {
          excerpt: "Dua kalimah ringan pada lidah, berat pada neraca.",
        },
      },
      {
        title: "Keadilan",
        summary: "Berpegang pada al-Quran dan Sunnah, lalu bertaubatlah hari ini.",
        quran: {
          excerpt: "Allah akan menegakkan neraca keadilan pada Hari Kiamat.",
        },
      },
    ],
    characterDestroyers: [
      {
        title: "Dusta",
      },
      {
        title: "Ghibah",
      },
      {
        title: "Fitnah",
      },
      {
        title: "Sombong",
      },
      {
        title: "Kezaliman",
      },
      {
        title: "Memungkiri janji",
      },
      {
        title: "Mengejek",
      },
      {
        title: "Kekasaran",
      },
    ],
  },
  {
    title: "Menuntut ilmu",
    summary: "Allah memudahkan jalan menuju Syurga bagi penuntut ilmu.",
    body: [
      "Menuntut ilmu yang bermanfaat — mempelajari apa yang Allah dan Rasul-Nya ﷺ ajarkan, lalu mengamalkannya dan meneruskannya — adalah sebuah ibadat dan, dalam hal-hal pokoknya, kewajiban bagi setiap muslim. Inilah ilmu suci yang menjernihkan akidah, memurnikan ibadat, dan membedakan yang benar dari yang salah; ia bukan ilmu untuk pamer, melainkan cahaya yang menuntun amal.",
      "Nabi ﷺ mengaitkan usaha ini secara langsung dengan tujuan seluruh perjalanan ini: 'Barang siapa menempuh suatu jalan untuk mencari ilmu, Allah akan memudahkan baginya jalan menuju Syurga.' 'Jalan' ini bermakna harfiah sekaligus kiasan — Allah memudahkan jalan penuntut ilmu di dunia ini dan memudahkan jalannya menuju Jannah di akhirat. Baginda juga mengajarkan bahawa para malaikat merendahkan sayap-sayap mereka sebagai tanda rida bagi penuntut ilmu, dan bahawa segala sesuatu di langit dan bumi, bahkan ikan-ikan di laut, memohonkan ampun bagi orang yang mengajarkan kebaikan.",
      "Ilmu juga termasuk amal langka yang terus memberi pahala kepada seseorang selepas kematian. Nabi ﷺ menyebutkan ilmu yang bermanfaat di antara tiga hal yang pahalanya terus mengalir di dalam kubur, bersama sedekah jariah dan anak saleh. Maka mengajarkan satu perkara yang bermanfaat — membantu seseorang belajar salah dengan benar, menyampaikan sebuah hadis yang sahih, atau membimbing seseorang menuju kebenaran — boleh menjadi aliran pahala yang mengalir bertahun-tahun, bahkan berlintas generasi.",
      "Hikmahnya adalah bahawa amal tanpa ilmu itu buta, dan ilmu tanpa amal itu tidak berbuah. Ilmu yang benar melindungi seseorang dari bidah dan kesesatan, memperdalam keikhlasan, dan memberinya kemampuan untuk memberi manfaat bukan hanya bagi dirinya sendiri tetapi juga bagi orang lain. Para ulama Islam selalu memperingatkan dua bahaya: beramal tanpa ilmu, dan berilmu tanpa beramal.",
      "Secara praktis: bertekadlah untuk mempelajari sesuatu yang bermanfaat secara rutin — satu ayat, satu hadis, satu masalah yang engkau perlukan untuk ibadat harianmu. Mulailah dari dasar-dasar akidah, salah, bersuci, dan larangan-larangan besar, lalu perdalamlah secara bertahap. Bagikan apa yang kau pelajari dengan rendah hati, dan selalu amalkan terlebih dulu pada dirimu sendiri.",
    ],
    quran: [
      {
        excerpt:
          "Katakanlah: Apakah sama orang-orang yang mengetahui dengan orang-orang yang tidak mengetahui? Sesungguhnya orang yang berakallah yang boleh menerima pengajaran.",
      },
      {
        excerpt: "Dan katakanlah: Ya Tuhanku, tambahkanlah kepadaku ilmu pengetahuan.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Barang siapa menempuh suatu jalan untuk mencari ilmu, Allah akan memudahkan baginya jalan menuju Syurga.",
      },
      {
        excerpt:
          "Apabila seorang manusia meninggal dunia dunia, maka terputuslah amalnya kecuali tiga perkara: sedekah jariah, ilmu yang bermanfaat, atau anak saleh yang mendoakannya.",
      },
    ],
    actions: [
      "Pelajari sesuatu yang bermanfaat setiap minggu.",
      "Bagikan ilmu tanpa kesombongan.",
      "Amalkan apa yang kau pelajari sebelum mengumpulkan lebih banyak.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Ibadat sunah",
    summary: "Dekatilah Allah melalui amalan sunah melampaui yang wajib.",
    body: [
      "Ibadat sunah (nafl) merujuk pada amal ibadat tambahan yang dipersembahkan seorang mukmin melampaui apa yang Allah wajibkan — salah tambahan, puasa tambahan, sedekah dan zikir tambahan. Kewajiban selalu didulukan dan tidak boleh ditawar, tetapi selepas semua itu ditunaikan, ibadat sunahlah tempat seorang hamba mengungkapkan cinta, kedekatan, dan kerinduan yang melampaui batas minimal yang diwajibkan.",
      "Ada janji menakjubkan yang menyertainya. Dalam sebuah hadis qudsi, Allah berfirman: 'Hamba-Ku tidak mendekat kepada-Ku dengan sesuatu yang lebih Aku cintai daripada apa yang telah Aku wajibkan atasnya. Dan ia terus mendekat kepada-Ku melalui amalan-amalan sunah hingga Aku mencintainya' — dan ketika Allah mencintai seorang hamba, doa-doanya dikabulkan dan urusannya diperbaiki. Ibadat sunah kerananya adalah tangga kedekatan, yang mendaki dari sekadar ketaatan menuju cinta ilahi.",
      "Sunah kaya dengan bentuk-bentuk yang mudah dijangkau: salah malam (tahajud) pada sepertiga malam terakhir, salah duha, salah sunah rawatib sebelum dan sesudah yang wajib, dan puasa sunah seperti hari Senin dan Kamis atau ayyamul bidh setiap bulan. Ibadat sunah juga diam-diam menambal kekurangan kita — Nabi ﷺ mengajarkan bahawa kekurangan dalam salah wajib akan dilengkapi dari salah sunah seseorang pada Hari Kiamat.",
      "Hikmahnya adalah bahawa amalan sunah menjaga iman tetap hidup dan bertumbuh. Kewajiban menjaga fondasi, tetapi amalan sukarela adalah tempat hati meluas, tempat ibadat pribadi yang tidak dilihat siapa pun membangun keikhlasan, dan tempat seseorang melatih dirinya untuk ujian-ujian hidup yang lebih berat. Ini juga suatu rahmat bahawa amal-amal ini bersifat opsional — Allah membuka banyak pintu supaya setiap orang boleh melewati pintu-pintu yang sesuai dengannya.",
      "Secara praktis, kuncinya adalah keberlanjutan, bukan intensitas. Nabi ﷺ mengajarkan bahawa amal yang paling dicintai Allah adalah yang paling konsisten, walau sedikit. Pilihlah beberapa amalan sunah yang benar-benar boleh kau pertahankan — dua rakaat tahajud, satu hari puasa seminggu, satu bahagian tetap Al-Quran — daripada lonjakan semangat ambisius yang padam dalam beberapa hari.",
    ],
    quran: [
      {
        excerpt:
          "Lambung mereka jauh dari tempat tidurnya, sedang mereka berdoa kepada Tuhannya dengan rasa takut dan penuh harap, dan mereka menafkahkan sebahagian dari rezeki yang Kami berikan kepada mereka. Seorang pun tidak mengetahui berbagai nikmat yang menyenangkan hati yang disembunyikan (untuk mereka) sebagai balasan atas apa yang telah mereka kerjakan.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Hamba-Ku tidak mendekat kepada-Ku dengan sesuatu yang lebih Aku cintai daripada apa yang telah Aku wajibkan atasnya. Dan hamba-Ku terus mendekat kepada-Ku melalui amalan-amalan sunah hingga Aku mencintainya.",
      },
    ],
    actions: [
      "Solatlah tahajud walau hanya dua rakaat.",
      "Berpuasalah sunah bila mampu.",
      "Tambahkan salah sunah sebelum/sesudah yang wajib secara konsisten.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Sabar & syukur",
    summary: "Allah mencintai orang-orang yang sabar dan bersyukur.",
    body: [
      "Sabar dan syukur adalah dua sayap yang membuat seorang mukmin terbang menjalani hidup. Sabar adalah keteguhan dalam tiga arena: tetap tegar dalam ketaatan kepada Allah, menahan diri dari kemaksiatan, dan menanggung ujian hidup tanpa mengeluh terhadap ketetapan-Nya. Syukur adalah mengakui setiap nikmat berasal dari Allah dan meresponsnya dengan terima kasih di hati, di lidah, dan melalui amal ketaatan. Bersama-sama, keduanya melengkapi respons orang beriman terhadap kesulitan maupun kemudahan.",
      "Kepentingannya adalah bahawa keduanya menentukan bagaimana orang beriman menghadapi segala sesuatu yang menimpanya. Nabi ﷺ takjub bahawa seluruh perkara orang beriman adalah baik: ketika kebaikan sampai kepadanya, ia bersyukur dan itu baik baginya; dan ketika kesulitan menimpa, ia bersabar dan itu pun baik baginya — sebuah anugerah yang tidak diberikan kepada siapa pun kecuali orang beriman. Maka apa pun yang datang, orang beriman memiliki jalan menuju pahala.",
      "Pahala kesabaran secara unik tidak terbatas. Sementara sebahagian besar amal diganjar dengan kelipatan tertentu, Allah berfirman: 'Sesungguhnya hanya orang-orang yang bersabarlah yang dicukupkan pahala mereka tanpa batas' (Quran 39:10). Dan syukur membawa janji tersendiri berupa tambahan: 'Jika kamu bersyukur, pasti akan Kutambah (nikmat) kepadamu' (Quran 14:7). Maka rasa syukur bukan hanya respons yang benar terhadap nikmat — ia adalah sesuatu yang menyebabkannya bertambah.",
      "Hikmah di sini mengubah seluruh makna penderitaan. Ujian bukanlah hukuman secara otomatis; bagi orang beriman yang meresponsnya dengan baik, ujian boleh menjadi penyucian yang menghapus dosa dan pengangkatan yang menaikkan derajat. Nabi ﷺ mengajarkan bahawa tidak ada kelelahan, penyakit, kekhawatiran, bahkan tusukan duri yang menimpa seorang muslim melainkan Allah menghapus sebahagian dosanya melaluinya. Ini mengubah momen-momen tersulit dalam hidup menjadi peluang, bukan semata kerugian.",
      "Secara praktis: ketika musibah menimpa, ucapkanlah kata-kata yang Allah ajarkan — 'inna lillahi wa inna ilaihi raji'un' (sesungguhnya kami milik Allah dan kepada-Nya kami kembali) — dan tahanlah lidahmu dari keluhan yang menolak ketetapan-Nya. Di saat lapang, hitunglah nikmatmu dengan suara keras dan syukurilah Allah untuk setidaknya beberapa nikmat setiap hari; menyebutnya menjaga hati tetap lembut dan bersyukur.",
    ],
    quran: [
      {
        excerpt:
          "Dan sampaikanlah kabar gembira kepada orang-orang yang sabar, (iaitu) orang-orang yang apabila ditimpa musibah, mereka mengucapkan: Sesungguhnya kami milik Allah dan kepada-Nya kami kembali. Mereka itulah yang menboleh keberkatan yang sempurna dan rahmat dari Tuhan mereka, dan mereka itulah orang-orang yang menboleh petunjuk.",
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
    title: "Menyeru kepada Allah",
    summary: "Siapa yang membimbing orang lain menboleh pahala seperti yang mengamalkannya.",
    body: [
      "Dakwah berarti mengajak orang lain menuju Allah — menyampaikan pesan Islam, mengajarkan seseorang salah, mendorong kebaikan, mencegah kemungkaran dengan lembut, atau membantu seorang muslim yang berjuang untuk kembali kepada ketaatan. Ini adalah misi setiap nabi dan merupakan tanggung jawab bersama umat, masing-masing sesuai kemampuan dan pengetahuannya. Ini bukan hanya milik para ulama; siapa pun yang menyampaikan satu hal bermanfaat sedang menyeru kepada Allah.",
      "Pahalanya termasuk yang paling murah hati dalam seluruh ajaran Islam. Nabi ﷺ bersabda bahawa siapa yang membimbing seseorang kepada kebaikan akan menboleh pahala seperti orang yang mengamalkannya — dan dalam riwayat lain, siapa yang menyeru kepada petunjuk akan menboleh pahala semua orang yang mengikutinya, tanpa mengurangi sedikit pun pahala mereka sendiri. Ini berarti kebaikan yang engkau mulai boleh terus melipatgandakan pahalamu melalui setiap orang yang tersentuh olehnya, bahkan lama selepas engkau tiada.",
      "Namun dakwah memiliki adab — sebuah cara — yang harus dijaga supaya berhasil. Allah memerintahkan: 'Serulah (manusia) kepada jalan Tuhanmu dengan hikmah dan pengajaran yang baik, dan bantahlah mereka dengan cara yang baik' (Quran 16:125). Hikmah berarti mengatakan hal yang tepat, kepada orang yang tepat, dengan cara dan waktu yang tepat; kekerasan, kesombongan, dan mencari-cari kesalahan menjauhkan orang dan mengkhianati tujuannya. Tugas penyeru adalah menyampaikan dan menanam benih, bukan memaksa hati, yang hanya menjadi milik Allah.",
      "Hikmah mengaitkan pahala yang begitu luas dengan membimbing orang lain adalah bahawa ini menjadikan setiap mukmin sumber kebaikan yang berkelanjutan. Ini juga melindungi iman si penyeru sendiri: mengajak orang lain kepada salah, kejujuran, dan ibadat adalah pengingat untuk berpegang teguh padanya sendiri. Dan ini mengikat umat dalam kepedulian bersama, bukan kelalaian bersama.",
      "Secara praktis, mulailah dari rumahmu sendiri. Perbaiki dan ajarkan keluargamu — pasangan, anak, saudara — kerana mereka adalah tanggung jawabmu yang pertama dan paling bertahan lama. Bagikan ilmu yang bermanfaat dengan kebaikan, bantulah seseorang belajar salah atau membaca Al-Quran, dan ingatlah bahawa kehidupan berakhlak baik dan beribadat secara konsisten seringkali merupakan dakwah paling efektif.",
    ],
    quran: [
      {
        excerpt:
          "Serulah (manusia) kepada jalan Tuhanmu dengan hikmah dan pengajaran yang baik, dan bantahlah mereka dengan cara yang lebih baik.",
      },
      {
        excerpt:
          "Siapakah yang lebih baik perkataannya daripada orang yang menyeru kepada Allah, mengerjakan amal saleh, dan berkata: Sesungguhnya aku termasuk orang-orang yang berserah diri?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Siapa yang membimbing seseorang kepada kebaikan akan menboleh pahala seperti orang yang mengamalkannya.",
      },
    ],
    actions: [
      "Bagikan ilmu yang bermanfaat dengan kebaikan.",
      "Bantulah seseorang belajar salah atau membaca Al-Quran.",
      "Jadilah teladan akhlak yang baik di tengah masyarakat.",
    ],
  },
  {
    title: "Amal besar seumur hidup",
    summary: "Haji, keluarga, dan sedekah yang bertahan lama.",
    body: [
      "Selain amal ibadat harian dan mingguan, Islam mengarahkan orang beriman kepada beberapa amal besar seumur hidup — investasi besar yang pahalanya luar biasa dan, dalam beberapa hal, tidak pernah berakhir. Inilah proyek-proyek yang layak dijadikan poros hidup: ibadat haji, membesarkan keluarga yang saleh, dan membangun amal kebaikan yang bertahan lama.",
      "Yang paling utama di antaranya adalah Haji, rukun kelima Islam, wajib sekali seumur hidup bagi setiap muslim yang mampu secara fisik dan finansial — 'Mengerjakan haji adalah kewajiban manusia terhadap Allah, iaitu (bagi) orang yang sanggup mengadakan perjalanan ke Baitullah' (Quran 3:97). Pahalanya adalah penyucian total: Nabi ﷺ bersabda bahawa siapa yang berhaji kerana Allah dan menghindari perbuatan keji serta dosa akan kembali bersih dari dosa, seperti hari ketika ibunya melahirkannya. Baginda bersabda bahawa haji yang mabrur tidak ada balasannya kecuali Syurga. Umrah, haji kecil, juga membawa pahala besar dan menghapus dosa-dosa di antara satu umrah dengan umrah berikutnya.",
      "Investasi besar kedua adalah sedekah jariah — sedekah yang terus mengalir yang tetap memberi pahala kepada seseorang selepas kematian. Nabi ﷺ menyebutkannya di antara tiga hal yang terus bermanfaat bagi seseorang di dalam kubur, bersama ilmu yang bermanfaat dan anak saleh yang mendoakannya. Membesarkan anak-anak dalam keimanan dan akhlak yang baik barangkali adalah yang terbesar di antaranya, tetapi demikian juga membangun atau merawat masjid, menggali sumur, membiayai anak yatim, menanam pohon, atau mendanai pendidikan — masing-masing adalah aliran pahala yang bertahan lebih lama daripada pemberinya.",
      "Hikmah dari amal-amal ini adalah bahawa ia memperluas catatan seseorang melampaui masa hidupnya. Tahun-tahun aktif seorang mukmin singkat, tetapi sumur yang ia gali atau anak yang ia besarkan dengan baik boleh terus mendatangkan pahala baginya selama berabad-abad. Islam dengan demikian mendorong visi jangka panjang: bukan hanya memikirkan salah hari ini, tetapi juga memikirkan kebaikan apa yang akan terus mengalir darimu selepas engkau tiada.",
      "Secara praktis: jika engkau mampu, rencanakanlah haji atau umrah dengan sungguh-sungguh, bukan terus-menerus menundanya. Curahkan usaha nyata untuk iman dan akhlak keluargamu, kerana mereka adalah warisanmu yang paling bertahan lama. Dan pilihlah setidaknya satu proyek amal yang bertahan lama untuk didukung — ilmu, air, tempat tinggal, atau anak yatim — supaya amal kebaikanmu terus berlanjut selepas kematian.",
    ],
    quran: [
      {
        excerpt:
          "Mengerjakan haji adalah kewajiban manusia terhadap Allah, iaitu (bagi) orang yang sanggup mengadakan perjalanan ke Baitullah.",
      },
      {
        excerpt:
          "Dan berserulah kepada manusia untuk mengerjakan haji, pasti mereka akan datang kepadamu dengan berjalan kaki, dan mengendarai unta yang kurus yang datang dari segenap penjuru yang jauh, supaya mereka menyaksikan berbagai manfaat bagi mereka.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Siapa yang berhaji kerana Allah dan tidak berbuat keji atau maksiat, akan kembali bersih dari dosa, seperti hari ketika ibunya melahirkannya.",
      },
      {
        excerpt:
          "Apabila seorang manusia meninggal dunia dunia, maka terputuslah amalnya kecuali tiga perkara: sedekah jariah, ilmu yang bermanfaat, atau anak saleh yang mendoakannya.",
      },
    ],
    actions: [
      "Rencanakan haji atau umrah jika engkau mampu.",
      "Investasikan pada iman dan akhlak keluargamu.",
      "Dukunglah sebuah proyek amal yang bertahan lama.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Rahmat Allah — kata terakhir",
    summary: "Amal adalah sarana; masuk Syurga adalah kerana rahmat-Nya.",
    body: [
      "Selepas segala amal, segala usaha, dan segala jalan, orang beriman tiba pada sebuah kebenaran yang merendahkan hati, yang menjadi kata terakhir dari perjalanan ini: tidak seorang pun masuk Syurga hanya kerana amalnya semata. Nabi ﷺ menyatakan hal ini tentang dirinya sendiri — makhluk yang paling dicintai Allah di antara seluruh ciptaan — dengan mengatakan bahawa bahkan baginda pun tidak akan masuk Syurga kerana amalnya sendiri, kecuali bahawa Allah menyelimutinya dengan rahmat-Nya. Jika demikian bagi baginda, tentu demikian pula bagi kita.",
      "Ini tidak boleh disalahpahami sebagai izin untuk mengabaikan ibadat. Amal tetap merupakan sarana yang Allah pilih dan perintahkan; Dia telah mengaitkan rahmat-Nya dengan iman dan amal saleh, dan meninggal duniakannya bukanlah kerendahan hati melainkan kelalaian. Makna yang benar adalah soal proporsi: amal kita, sebanyak apa pun, tidak akan pernah boleh membalas bahkan sebahagian kecil dari nikmat Allah atas kita, apalagi membeli keabadian Syurga. Maka kita mempersembahkan amal kita sebagai tanda cinta dan ketaatan, lalu bersandar sepenuhnya pada karunia-Nya untuk menerimanya dan memasukkan kita ke dalam Syurga.",
      "Luasnya rahmat itu sungguh menakjubkan. Nabi ﷺ bersabda bahawa Allah membagi rahmat menjadi seratus bahagian; Dia hanya menurunkan satu bahagian kepada seluruh makhluk-Nya — dan dengan satu bahagian itulah seorang ibu penuh kasih terhadap anaknya dan hewan-hewan bersikap lembut kepada anak-anak mereka — sementara sembilan puluh sembilan bahagian sisanya Dia simpan untuk diri-Nya sendiri guna dicurahkan kepada hamba-hamba-Nya pada Hari Kiamat. Rahmat apa pun yang pernah kita saksikan di dunia ini hanyalah sebahagian kecil dari satu bahagian dari seratus.",
      "Inilah sebabnya orang beriman yang seimbang hidup di antara harapan dan rasa takut, seperti burung yang terbang dengan dua sayap. Ia cukup takut akan keadilan Allah sehingga tidak pernah lengah atau berani nekat berbuat dosa, dan ia cukup berharap pada rahmat Allah sehingga tidak pernah berputus asa, betapapun jauh ia tersesat. Condong sepenuhnya pada rasa takut menumbuhkan keputusasaan; condong sepenuhnya pada harapan menumbuhkan kesombongan. Nama-nama Allah — Ar-Rahman (Yang Maha Pengasih), Ar-Rahim (Yang Maha Penyayang), Al-Ghafur (Yang Maha Pengampun) — menjadi penopang sayap harapan.",
      "Maka jadikanlah ini semangat yang menutup setiap harimu: mintalah Al-Firdaus kepada Allah, berusahalah sebaik-baiknya dengan tulus, bertobatlah atas kekuranganmu, lalu serahkan derajat akhirmu kepada Yang Mahaadil dan Maha Penyayang — dengan keyakinan bahawa Dia yang menyimpan sembilan puluh sembilan bahagian rahmat untuk hari itu tidak akan menolak hamba yang datang kepada-Nya dengan berusaha dan berharap.",
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
          "Tidak seorang pun di antara kamu yang masuk Syurga semata-mata kerana amalnya. Para sahabat bertanya: Tidak juga engkau, wahai Rasulullah? Baginda bersabda: Tidak juga aku, kecuali bahawa Allah menyelimutiku dengan rahmat-Nya.",
      },
      {
        excerpt:
          "Allah memiliki seratus bahagian rahmat. Dia menurunkan satu bahagian di antara jin, manusia, hewan, dan serangga, yang dengannya mereka saling mengasihi satu sama lain; dan Dia menyimpan sembilan puluh sembilan bahagian pada diri-Nya, yang dengannya Dia akan menunjukkan rahmat kepada hamba-hamba-Nya pada Hari Kiamat.",
      },
    ],
    actions: [
      "Seimbangkan rasa takut kepada Allah dengan harapan pada rahmat-Nya.",
      "Jangan pernah berputus asa selepas berbuat dosa — bertobatlah dan teruslah berusaha.",
      "Mintalah Al-Firdaus dan husnul khatimah (akhir yang baik) kepada Allah.",
    ],
    appLinks: [{}, {}],
  },
];

export const JANNAH_GATES_MS: DeepPartial<JannahGate>[] = [
  {
    name: "Pintu Salah",
    deedSummary: "Bagi mereka yang menjaga dan menegakkan lima waktu salah.",
    hadith: [
      {
        excerpt:
          "Siapa yang berinfak sepasang sesuatu di jalan Allah, ia akan dipanggil dari pintu-pintu Syurga. Siapa yang termasuk ahli salah akan dipanggil dari Pintu Salah.",
      },
    ],
  },
  {
    name: "Pintu Sedekah",
    deedSummary: "Bagi mereka yang bersedekah dengan tulus kerana Allah.",
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
          "Di Syurga ada sebuah pintu bernama Ar-Rayyan, yang hanya dimasuki oleh orang-orang yang berpuasa pada Hari Kiamat. Apabila yang terakhir dari mereka telah masuk, pintu itu akan ditutup.",
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
          "Siapa yang berhaji kerana Allah dan tidak berbuat keji atau maksiat, akan kembali bersih dari dosa, seperti hari ketika ibunya melahirkannya.",
      },
    ],
  },
  {
    name: "Dipanggil dari setiap pintu",
    deedSummary:
      "Sebahagian orang, seperti Abu Bakar, akan dipanggil untuk masuk dari semua pintu.",
    hadith: [
      {
        excerpt:
          "Abu Bakar bertanya: Apakah ada yang akan dipanggil dari semua pintu ini? Baginda bersabda: Ya, dan aku berharap engkau termasuk salah satu di antara mereka.",
      },
    ],
  },
];

export const JANNAH_VERSES_MS: DeepPartial<JannahVerseEntry>[] = [
  {
    excerpt:
      "Berlomba-lombalah kamu kepada ampunan dari Tuhanmu dan syurga yang luasnya seluas langit dan bumi, yang disediakan bagi orang-orang yang bertakwa.",
  },
  {
    excerpt:
      "Syurga yang di bawahnya mengalir sungai-sungai, dan tempat-tempat tinggal yang bagus di syurga 'Adn. Dan keridaan Allah adalah lebih besar.",
  },
  {
    excerpt:
      "Bagi orang-orang yang beriman dan beramal saleh adalah syurga Firdaus menjadi tempat tinggal.",
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
      "Dan orang-orang yang paling dulu (beriman), merekalah yang paling dulu (masuk Syurga). Mereka itulah orang-orang yang didekatkan (kepada Allah).",
  },
  {
    excerpt:
      "Maka Allah memelihara mereka dari kesusahan hari itu, dan memberikan kepada mereka kejernihan (wajah) dan kegembiraan hati.",
  },
];

export const JANNAH_DUAS_MS: DeepPartial<JannahDuaEntry>[] = [
  {
    context: "Doa yang komprehensif untuk kebaikan di kedua alam dan perlindungan dari api neraka.",
  },
  {
    context: "Doa singkat selepas tasyahud: memohon Syurga dan berlindung dari api neraka.",
  },
  {
    context: "Selepas tasyahud, mohonlah Syurga dengan wasilah nama-nama indah Allah.",
  },
  {
    context: "Mohonlah manisnya memandang Allah dan kerinduan untuk bertemu dengan-Nya.",
  },
];

export const JANNAH_PROMISED_MS: DeepPartial<JannahPromisedEntry>[] = [
  {
    name: "Sepuluh yang Dijanjikan Syurga",
    summary:
      "Abu Bakar, Umar, Utsman, Ali, Thalhah, Zubair, Abdurrahman bin Auf, Sa'ad, Sa'id bin Zaid, dan Abu Ubaidah (semoga Allah meridai mereka).",
    note: "Disebutkan bersama dalam sebuah hadis di Sunan at-Tirmidzi (3747, sahih).",
  },
  {
    name: "Orang-orang yang jujur dan sabar",
    summary: "Allah memuji mereka yang jujur dalam iman dan sabar dalam ketaatan serta ujian.",
    note: "Lihat Quran 4:69 dan banyak ayat tentang as-sadiqin dan as-sabirin.",
  },
  {
    name: "Syuhada di jalan Allah",
    summary: "Mereka yang gugur membela Islam sesuai syariat Islam diberi kabar gembira Syurga.",
    note: "Para ulama mendefinisikan syahadah secara cermat; tidak setiap kematian dalam pertempuran secara otomatis memenuhi kriteria ini.",
  },
  {
    name: "Mereka yang kata terakhirnya adalah tauhid",
    summary:
      "Barang siapa yang kata-kata terakhirnya adalah 'Tiada tuhan selain Allah' akan masuk Syurga.",
    note: "Sunan Abu Dawud 3116 (sahih). Akhir yang baik adalah pencarian seumur hidup.",
  },
  {
    name: "Para nabi",
    summary: "Setiap nabi berada di tingkatan tertinggi Syurga atas ketetapan Allah.",
    note: "Kedudukan mereka tidak dicapai melalui amal biasa — mereka dipilih dan dijaga.",
  },
];

export const JANNAH_FIRDAWS_DUA_MS: DeepPartial<{
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
}> = {
  translation:
    "Ya Allah, aku memohon kepada-Mu Al-Firdaus yang tertinggi — bahagian Syurga yang paling tinggi.",
};
