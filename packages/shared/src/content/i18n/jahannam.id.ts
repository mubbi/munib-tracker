import type {
  JahannamDuaEntry,
  JahannamGateEntry,
  JahannamHadithEntry,
  JahannamNameEntry,
  JahannamReferenceEntry,
  JahannamReflectionEntry,
  JahannamTopic,
  JahannamVerseEntry,
} from "../../types/jahannam";
import type { DeepPartial } from "./localize";

// Overlay terjemahan Bahasa Indonesia untuk materi Learn Jahannam. Setiap overlay
// mengikuti urutan array sumber bahasa Inggris di ../jahannam*.ts (selaras
// berdasarkan indeks); entri yang belum diterjemahkan otomatis memakai versi
// Inggris. Hanya teks yang dapat dibaca manusia yang diterjemahkan — id, route,
// nomor surah/ayat, koleksi, kutipan (citation), dan label rujukan ayat tetap
// memakai sumber bahasa Inggris.

export const JAHANNAM_CORE_TOPICS_ID: DeepPartial<JahannamTopic>[] = [
  {
    title: "Pendahuluan",
    summary:
      "Allah memberitahu kita tentang Jahannam sebagai petunjuk — bukan untuk membuat putus asa.",
    body: [
      "Jahannam — sering diterjemahkan sebagai neraka atau Api — adalah tempat siksaan di akhirat yang Allah gambarkan dalam Al-Qur'an dan melalui Rasul-Nya ﷺ. Dia mengabarkannya bukan untuk menghancurkan hati dengan ketakutan, melainkan agar hati tersadar, kembali, dan memilih jalan rahmat selama pintunya masih terbuka.",
      "Ada baiknya kita memahami mengapa Rabb Yang Maha Penyayang sampai berbicara tentang Api. Sebuah peringatan itu sendiri adalah rahmat: seseorang yang diberitahu ada jurang di depan dalam gelap telah diberi hadiah, bukan ancaman. Setiap ayat tentang Jahannam adalah Allah, dengan kasih sayang-Nya, memanggil hamba-hamba-Nya untuk kembali sebelum waktu untuk itu berlalu.",
      "Inilah sebabnya peringatan-peringatan itu selalu diiringi seruan untuk bertobat, memohon ampunan, dan berharap pada rahmat Allah yang luas. Al-Qur'an jarang menyebut Api tanpa, di dekatnya, menyebut Surga, pintu tobat yang terbuka, dan kecintaan Allah kepada mereka yang kembali. Tujuannya adalah pertanggungjawaban yang membawa pada kebaikan — bukan keputusasaan.",
      "Beriman kepada Jahannam adalah bagian dari beriman kepada yang gaib (al-ghayb), kepada keadilan ilahi, dan kepada kenyataan Hari Akhir. Ini memberi bobot pada pilihan-pilihan kita dan menyeimbangkan harapan akan Surga dengan kesungguhan terhadap dosa, sehingga seorang mukmin berjalan di antara harap dan takut — berharap pada rahmat Allah, sekaligus waspada terhadap kekurangan dirinya sendiri.",
      "Satu titik penenang yang menjadi inti akidah Ahlus Sunnah mengalir di seluruh modul ini: mereka yang wafat dalam keadaan beriman hanya kepada Allah, sekalipun terbebani dosa, tidak akan kekal selamanya di dalam Api. Dengan rahmat Allah dan syafaat yang Dia izinkan, orang-orang mukmin yang berdosa pada akhirnya akan dikeluarkan; hanya mereka yang wafat menolak keimanan yang tetap tinggal. Maka mempelajari Jahannam, bagi seorang mukmin, pada akhirnya adalah mempelajari bagaimana mencapai rahmat.",
      "Modul ini menyajikan apa yang dinyatakan secara jelas oleh nas, mencatat secara jujur di mana para ulama berbeda pendapat, hanya mengutip dalil yang sahih, dan senantiasa mengarahkanmu pada tobat, amal saleh, dan tawakal kepada Allah.",
    ],
    quran: [
      {
        excerpt:
          "Takutlah kepada Api yang disediakan bagi orang-orang kafir — dan taatlah kepada Allah dan Rasul-Nya agar kamu diberi rahmat.",
      },
      {
        excerpt:
          "Katakanlah: Wahai hamba-hamba-Ku yang telah melampaui batas terhadap diri mereka sendiri, janganlah berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni semua dosa.",
      },
      {
        excerpt:
          "Wahai orang-orang yang beriman, bertobatlah kepada Allah dengan tobat yang tulus — semoga Rabb kalian menghapus keburukan-keburukan kalian dan memasukkan kalian ke dalam taman-taman surga.",
      },
    ],
    appLinks: [{ label: "Harapan pada Rahmat Allah" }, { label: "Perjalanan Menuju Jannah" }],
  },
  {
    title: "Mengapa Allah Menciptakan Jahannam",
    summary: "Keadilan ilahi, pertanggungjawaban, dan konsekuensi dari kebebasan memilih.",
    body: [
      "Jahannam ada sebagai perwujudan keadilan Allah yang sempurna ('adl). Sebuah alam semesta di mana orang zalim dan yang dizalimi, yang ikhlas dan yang berkhianat, semuanya berakhir sama, tidaklah adil. Karena Allah Maha Adil secara sempurna, maka mesti ada perhitungan akhir di mana setiap keburukan dijawab dan setiap kebaikan dihargai.",
      "Inti dari semua ini adalah bahwa Allah tidak menzalimi siapa pun. Setiap jiwa yang masuk ke dalam Api masuk karena pilihan-pilihannya sendiri yang sudah mantap dan tidak ditobati — bukan karena keputusan sewenang-wenang. Al-Qur'an sangat tegas: 'Allah sama sekali tidak menzalimi manusia, tetapi manusialah yang menzalimi diri mereka sendiri' (4:40). Tidak ada yang dihukum atas apa yang tidak dilakukannya, atau melebihi apa yang pantas.",
      "Manusia tidak dibiarkan dalam kegelapan. Allah memberi mereka akal, mengutus para rasul, dan menurunkan petunjuk yang jelas, lalu memuliakan mereka dengan kebebasan sejati untuk menerima atau menolaknya: 'Siapa yang ingin, berimanlah; dan siapa yang ingin, ingkarlah' (18:29). Bersikeras dalam menolak kebenaran, dalam kezaliman, atau dalam dosa besar tanpa tobat membawa konsekuensi di akhirat, justru karena pilihan itu benar-benar milik diri sendiri.",
      "Namun bahkan di sini rahmat mengelilingi keadilan. Allah memperingatkan sebelum menghukum, menunda perhitungan untuk memberi ruang kembali, mengampuni dengan cepat ketika dimohon, dan membalas satu kebaikan berkali-kali lipat sementara mencatat satu keburukan hanya sebagai satu. Keadilan-Nya tidak pernah terpisah dari rahmat-Nya.",
      "Karena itu, merenungkan mengapa Jahannam ada seharusnya meningkatkan takwa (kesadaran akan Allah) dan memperdalam rasa syukur atas setiap hari kehidupan yang masih menjadi kesempatan untuk bertobat. Tujuannya adalah membuat hati serius sekaligus penuh harap — bukan melumpuhkannya dengan keputusasaan.",
    ],
    quran: [
      {
        excerpt:
          "Sesungguhnya Allah sama sekali tidak menzalimi manusia, tetapi manusialah yang menzalimi diri mereka sendiri.",
      },
      {
        excerpt:
          "Dia tidak ditanya tentang apa yang Dia lakukan, tetapi merekalah yang akan ditanya.",
      },
      {
        excerpt:
          "Siapa yang ingin, berimanlah; dan siapa yang ingin, ingkarlah. Sesungguhnya Kami telah menyediakan Api bagi orang-orang zalim.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Tidak seorang pun di antara kalian yang masuk surga semata-mata karena amalnya. Para sahabat bertanya: Tidak juga engkau, wahai Rasulullah? Beliau bersabda: Tidak juga aku, kecuali jika Allah menyelimutiku dengan rahmat-Nya.",
      },
    ],
    appLinks: [{ label: "Pelajari Akidah — keadilan ilahi" }],
  },
  {
    title: "Kenyataan Akhirat",
    summary:
      "Dari kematian hingga penghakiman — setiap tahap adalah nyata dan terkait dengan akidah.",
    body: [
      "Untuk memahami Jahannam dengan benar, ada baiknya melihat di mana letaknya dalam perjalanan yang lebih besar ini. Islam mengajarkan urutan yang jelas setelah kematian: ruh meninggalkan jasad, kemudian barzakh (kehidupan sela di alam kubur) dimulai, lalu Kebangkitan ketika jasad dibangkitkan, Pengumpulan seluruh makhluk, Pengadilan di mana amal diperiksa, penimbangan amal di Mizan, penyeberangan Sirat, dan akhirnya penempatan setiap jiwa di Surga atau Api — semuanya atas ketetapan, keadilan, dan rahmat Allah.",
      "Setiap tahap ini ditetapkan dalam akidah Ahlus Sunnah arus utama berdasarkan Al-Qur'an dan Sunnah yang sahih. Urutan ini bukanlah simbol atau cerita; ini adalah kenyataan yang harus diyakini sebagai bagian dari beriman kepada Hari Akhir, dan mengingkarinya dengan sengaja adalah persoalan akidah, bukan sekadar amal.",
      "Melihat seluruh jalan ini juga membingkai ulang pemahaman kita tentang Api. Ia adalah salah satu tujuan yang mungkin di akhir perjalanan yang sedang ditempuh setiap jiwa — yang berarti pilihan-pilihan hari ini bukanlah sesuatu yang abstrak. Semuanya adalah langkah-langkah di jalan itu, dan masih menjadi milik kita untuk diarahkan.",
      "Mengetahui urutan ini membantu seorang mukmin bersiap, bukan sekadar takut: hidup dengan mengingat kematian (dzikrul maut) secara sehat, memperbaiki kesalahan sebelum dibawa ke Pengumpulan, dan mengisi catatan amal saleh selagi pintu untuk beramal masih terbuka. Kematian menutup pintu itu; tidak ada lagi yang bisa ditambahkan setelahnya.",
    ],
    quran: [
      {
        excerpt:
          "Kemudian sesungguhnya kamu pasti mati setelah itu. Kemudian sesungguhnya kamu akan dibangkitkan pada Hari Kiamat.",
      },
      {
        excerpt:
          "Adapun orang yang berat timbangannya, dia akan berada dalam kehidupan yang menyenangkan. Adapun orang yang ringan timbangannya, tempat kembalinya adalah jurang yang dalam.",
      },
    ],
    actions: [
      "Pelajari setiap tahap di Pelajari Akidah dan hubungkan keimanan dengan pilihan sehari-hari.",
      "Perbanyak mengingat kematian (dzikrul maut) tanpa mengabaikan harapan pada rahmat.",
    ],
    appLinks: [
      { label: "Akidah — Hari Akhir" },
      { label: "Kebangkitan" },
      { label: "Hari Pengadilan" },
      { label: "Mizan & Sirat" },
      { label: "Neraka dalam Akidah" },
      { label: "Surga dalam Akidah" },
    ],
  },
  {
    title: "Nama-Nama Jahannam",
    summary:
      "Nama-nama dalam Al-Qur'an beserta maknanya — ulama berbeda pendapat apakah setiap nama adalah tingkatan tersendiri.",
    body: [
      "Al-Qur'an menyebut neraka dengan beberapa nama, dan ini bukan sekadar pengulangan. Dalam bahasa Arab, sebuah nama sering membawa gambaran hidup di dalamnya, sehingga setiap nama mengajarkan sesuatu tentang kenyataan yang ditunjuknya. Di antaranya adalah Jahannam, Jahim, Saqar, Sa'ir, al-Hutamah, al-Hawiyah, dan Laza.",
      "Setiap nama membuka jendela pada aspek keparahan yang berbeda. Jahim dan Sa'ir menggambarkan api yang berkobar dan menyala hebat; Saqar, yang menghanguskan dan tidak menyisakan apa pun; al-Hutamah, yang meremukkan segala yang dilemparkan ke dalamnya; al-Hawiyah, jurang dalam tempat seseorang terjatuh; dan Laza, nyala api murni yang mengelupas. Membaca nama-nama ini bersama-sama membangun gambaran serius yang tidak mudah diabaikan hati.",
      "Ulama tafsir klasik — seperti Ibnu Katsir dan al-Thabari — menjelaskan nama-nama ini dari akar katanya dalam bahasa Arab dan membahas masing-masing dalam konteks ayat tempatnya muncul, bukan memperlakukannya sebagai daftar teknis yang baku.",
      "Perlu ada catatan kehati-hatian di sini. Sebagian penulis belakangan menyajikan setiap nama sebagai 'tingkatan' neraka yang terpisah dan berjenjang, kadang dengan diagram rinci. Itu adalah tafsiran keilmuan, bukan daftar eksplisit yang dinyatakan dalam Al-Qur'an atau hadis yang disepakati. Sikap yang seimbang adalah mempelajari makna yang benar-benar diberikan oleh nas, dan menghindari menyajikan peta spekulatif sebagai kepastian.",
      "Tujuan mempelajari nama-nama ini bukan untuk memuaskan rasa penasaran, melainkan untuk melembutkan hati dan menggerakkannya menuju rahmat yang terus-menerus ditunjukkan oleh modul ini. Jelajahi kumpulan lengkap nama-nama untuk kemunculan dalam Al-Qur'an, konteks, dan ringkasan tafsir setiap nama.",
    ],
    quran: [
      { excerpt: "Cukuplah Jahannam sebagai tempat kembali." },
      { excerpt: "Dia pasti akan dilemparkan ke dalam al-Hutamah — Api yang meremukkan." },
    ],
    appLinks: [{ label: "Jelajahi semua nama" }],
  },
  {
    title: "Tingkatan Jahannam",
    summary:
      "Berbagai derajat siksaan — struktur pastinya tidak dijelaskan secara lengkap dalam nas.",
    body: [
      "Prinsip yang dinyatakan secara jelas oleh Al-Qur'an adalah bahwa siksaan itu sepadan: tidak semua orang di dalam Api mengalaminya dengan takaran yang sama. 'Bagi semuanya ada derajat sesuai dengan apa yang mereka kerjakan' (6:132). Ini sendiri adalah ungkapan keadilan — orang yang berbuat zalim sedikit tidak diperlakukan sama seperti yang berbuat zalim banyak.",
      "Sunnah yang sahih menggambarkan prinsip yang sama. Nabi ﷺ menggambarkan orang dengan siksaan paling ringan di dalam Api sebagai seseorang yang di bawah kedua telapak kakinya diletakkan dua bara api yang membuat otaknya mendidih — namun dialah yang paling ringan siksaannya di antara seluruh penghuni Api (Sahih al-Bukhari 6562). Jika inilah yang paling ringan, akal dapat memahami betapa beratnya tingkatan yang lebih tinggi, dan betapa banyak alasan untuk kembali hari ini.",
      "Pada saat yang sama, wahyu tidak memberikan kepada orang-orang mukmin sebuah peta lengkap dan bernomor tentang struktur neraka yang wajib dihafalkan. Para ulama telah membahas tingkatan, kedalaman, dan kategori yang diambil dari berbagai ayat dan riwayat, tetapi sebagian besar dari ini tetap merupakan tafsiran, bukan nas yang disepakati dan eksplisit.",
      "Namun, ada dua hal yang pasti. Pertama, bahwa kezaliman (dzulm), syirik, dan dosa besar yang terus-menerus tanpa tobat membawa peringatan yang berat. Kedua — dan ini tidak boleh pernah dilupakan — bahwa rahmat dan ampunan Allah tetap terbuka hingga saat kematian bagi siapa pun yang kembali kepada-Nya dengan tulus. Inti mempelajari tingkatan-tingkatan ini adalah untuk memilih jalan yang lebih ringan selagi pilihan itu masih ada.",
      "Secara praktis, ini berarti memperlakukan daftar rinci 'tujuh tingkatan' atau skema serupa sebagai pendapat keilmuan, bukan ajaran yang mutlak, dan tetap memusatkan perhatian pada apa yang benar-benar melindungi: keimanan, tobat, dan amal saleh.",
    ],
    quran: [
      { excerpt: "Bagi semuanya ada derajat sesuai dengan apa yang mereka kerjakan." },
      {
        excerpt:
          "Sesungguhnya orang-orang munafik berada di dasar Api yang paling bawah, dan kamu tidak akan mendapati penolong bagi mereka.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Orang yang paling ringan siksaannya di antara penghuni Api adalah seseorang yang di bawah kedua telapak kakinya diletakkan dua bara api yang membuat otaknya mendidih.",
      },
    ],
    disclaimer:
      "Diagram tingkatan neraka yang ditemukan di sebagian buku mencerminkan tafsiran keilmuan, bukan kesepakatan bulat.",
  },
  {
    title: "Pintu-Pintu Jahannam",
    summary: "Tujuh pintu — apa yang dinyatakan Al-Qur'an dan di mana tafsiran berbeda.",
    body: [
      "Satu perincian tentang Jahannam dinyatakan secara jelas dan tegas dalam Al-Qur'an: 'Sesungguhnya Jahannam memiliki tujuh pintu; setiap pintu mempunyai bagian tertentu dari mereka' (15:44). Keyakinan akan tujuh pintu karenanya berlandaskan wahyu yang jelas, bukan spekulasi.",
      "Ayat ini menegaskan dua hal: bahwa ada tujuh pintu, dan bahwa mereka yang masuk akan dibagi ke dalamnya. Ulama tafsir klasik membahas apa yang ditunjukkan oleh pembagian ini — apakah menunjuk pada kategori manusia, pada derajat siksaan yang sesuai amal, atau pada keduanya. Hikmah di balik pembagian ini milik Allah, yang keadilan-Nya menempatkan setiap jiwa persis di tempat yang selayaknya.",
      "Penting untuk mencatat di mana kepastian berakhir. Sebagian karya belakangan mengaitkan setiap pintu tertentu dengan dosa atau kelompok tertentu. Kaitan-kaitan khusus ini tidak ditetapkan secara seragam dalam sumber-sumber paling awal, sehingga lebih baik disajikan sebagai pandangan ulama perorangan, bukan sebagai penjelasan kenabian.",
      "Sama seperti tingkatan, pelajaran dari pintu-pintu ini bukanlah soal arsitektur melainkan moral: ada banyak pintu yang menuju ke Api, dan jalan untuk selamat dari semuanya sama — keimanan yang tulus, menjauhi dosa besar, dan segera bertobat ketika tergelincir.",
    ],
    quran: [
      {
        excerpt:
          "Dan sesungguhnya Jahannam adalah tempat yang dijanjikan bagi mereka semua. Ia memiliki tujuh pintu; setiap pintu mempunyai bagian yang ditentukan.",
      },
    ],
    appLinks: [{ label: "Pintu-pintu secara rinci" }],
  },
  {
    title: "Sifat-Sifat Jahannam",
    summary: "Api, panas, rantai, penyesalan — disajikan dengan penghormatan, bukan sensasi.",
    body: [
      "Al-Qur'an dan Sunnah yang sahih menggambarkan Jahannam dengan bahasa yang hidup dan konkret, dan ini bukan tanpa alasan: hati manusia lebih tergerak oleh gambaran yang bisa dibayangkan daripada oleh gagasan abstrak. Gambaran-gambaran ini — api yang membakar hebat, panas yang tak tertahankan, makanan dan minuman yang terbatas, rantai, kegelapan, dan penyesalan yang mendalam — dimaksudkan agar bahaya itu terasa cukup nyata untuk mengarahkan kita menjauhinya.",
      "Di antara gambaran itu adalah air mendidih untuk diminum, pohon zaqqum yang pahit sebagai makanan, pakaian yang dipotong dari api, dan terputusnya dari setiap kenyamanan yang pernah diandalkan seseorang. Nabi ﷺ menyampaikan sejauh mana panas ini melampaui segala yang kita kenal, bersabda bahwa api yang kita nyalakan di dunia ini hanyalah satu dari tujuh puluh bagian Api akhirat (Sahih al-Bukhari 3265).",
      "Gambaran-gambaran ini adalah peringatan yang nyata, bukan sekadar kiasan yang mengosongkan akhirat dari konsekuensi. Ulama Ahlus Sunnah menetapkan kenyataannya sambil menyerahkan cara pasti dari perkara gaib ini kepada ilmu Allah; tugas seorang mukmin adalah meresapi peringatannya, bukan membedahnya.",
      "Ada adab dalam membaca bagian-bagian seperti ini. Ia didekati dengan kerendahan hati, rasa takut kepada Allah, dan dorongan segera untuk bertobat serta memohon perlindungan — bukan dengan ketertarikan yang tidak sehat, dan tidak pernah dengan keputusasaan, karena seluruh tujuan peringatan ini adalah bahwa kita masih memiliki waktu untuk menghindarinya.",
      "Mungkin tema paling berat dalam gambaran-gambaran ini adalah penyesalan. 'Seandainya dahulu aku…' akan diucapkan ketika waktu untuk beramal telah berlalu. Rahmat dari mendengar tentang penyesalan itu sekarang adalah bahwa kita bisa bertindak atas 'seandainya' itu hari ini, selagi masih bisa mengubah akhir kita.",
    ],
    quran: [
      {
        excerpt:
          "Di hadapannya ada Jahannam, dan dia akan diberi minum air yang kotor. Dia akan menenggaknya namun hampir tidak bisa menelannya.",
      },
      {
        excerpt:
          "Pakaian dari api akan dipotongkan untuk mereka, dan air mendidih akan disiramkan ke atas kepala mereka.",
      },
      {
        excerpt:
          "Pada hari itu Jahannam akan didatangkan — pada hari itu manusia akan ingat, namun apa gunanya ingatan itu baginya?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Apimu ini adalah satu dari tujuh puluh bagian Api Jahannam. Dikatakan: Wahai Rasulullah, api ini saja sudah cukup. Beliau bersabda: Ia dilebihkan enam puluh sembilan bagian di atasnya, setiap bagian sepanas apimu ini.",
      },
    ],
    appLinks: [{ label: "Perlindungan dari Jahannam" }],
  },
  {
    title: "Siapa yang Diperingatkan?",
    summary: "Kategori dalam Al-Qur'an dan Sunnah — bukan penghakiman terhadap individu tertentu.",
    body: [
      "Pembaca Al-Qur'an yang cermat akan menyadari bahwa peringatan-peringatannya ditujukan pada perilaku dan sikap, bukan pada individu yang disebut namanya. Ia memperingatkan mereka yang terus mengingkari kebenaran setelah jelas bagi mereka, orang-orang munafik yang secara lahir mengaku beriman sementara batinnya mengingkarinya, para penindas yang menginjak-injak hak orang lain, orang-orang sombong yang terlalu angkuh untuk tunduk, dan mereka yang wafat dalam dosa besar tanpa pernah bertobat.",
      "Fokus pada kategori, bukan pada perorangan, ini disengaja dan penuh rahmat. Pintu untuk kembali tetap terbuka bagi setiap orang yang masih hidup, apa pun masa lalunya, karena berkas seseorang tidak ditutup hingga kematian. Peringatan ini menggambarkan jalannya, agar siapa pun yang masih menempuhnya dapat melangkah turun.",
      "Karena itu, Islam tidak mengizinkan kita menyatakan nasib akhir seseorang tertentu — mengatakan 'orang ini di dalam Api' — kecuali dalam kasus-kasus langka di mana Allah atau Rasul-Nya ﷺ secara eksplisit menyatakannya dalam wahyu yang sahih. Menghakimi hati dan akhir seseorang hanyalah milik Allah semata; tugas kita adalah perhitungan diri kita sendiri.",
      "Maka cara yang benar membaca setiap peringatan adalah mengarahkannya ke dalam diri: bukan 'siapa yang digambarkan ini?' melainkan 'apakah ada dari ini yang menggambarkan diriku, dan apa yang akan kuubah hari ini?' Siapa pun dirimu, undangan untuk kembali kepada Allah terbuka sekarang juga — dan besok tidak dijanjikan bagi siapa pun.",
    ],
    quran: [
      { excerpt: "Orang-orang munafik akan berada di dasar Api yang paling bawah." },
      {
        excerpt:
          "Siapa yang berbuat dosa lalu dosanya melingkupinya — mereka itulah penghuni Api, kekal di dalamnya.",
      },
      {
        excerpt:
          "Janganlah kamu mengira Allah lengah dari apa yang diperbuat orang-orang zalim. Dia hanya menunda mereka hingga suatu hari ketika mata terbelalak.",
      },
    ],
    appLinks: [{ label: "Dosa-dosa besar" }],
  },
  {
    title: "Dosa-Dosa Besar",
    summary: "Kaba'ir — dosa berat yang menuntut tobat yang tulus.",
    body: [
      "Para ulama membagi dosa ke dalam dua kategori, dan memahami perbedaannya membawa kesungguhan sekaligus kelegaan. Dosa besar (al-kaba'ir) adalah dosa yang Allah atau Rasul-Nya ﷺ kaitkan dengan konsekuensi berat tertentu — ancaman Api, laknat, kemurkaan Allah, atau hukuman yang ditetapkan — seperti syirik, pembunuhan, dan memakan riba. Dosa kecil (al-sagha'ir) adalah kesalahan-kesalahan ringan yang berada di bawah ambang itu.",
      "Kelegaannya terletak pada bagaimana keduanya saling berkaitan. Allah berjanji bahwa jika seorang mukmin menjauhi dosa-dosa besar, dosa-dosa kecil akan dihapuskan oleh amal ibadah biasa: 'Jika kamu menjauhi dosa-dosa besar yang dilarang bagimu, Kami akan menghapus dosa-dosa kecilmu' (4:31). Salat ke salat, Jumat ke Jumat, dan Ramadan ke Ramadan menjadi penebus apa yang ada di antaranya, selama dosa-dosa besar dijauhi.",
      "Inilah sebabnya dosa-dosa besar layak mendapat perhatian khusus: dosa-dosa ini tidak begitu saja terhapus dalam aliran ibadah sehari-hari, melainkan menuntut tobat yang disengaja dan tulus. Jika terus dilakukan tanpa berbalik, dosa-dosa ini membahayakan jiwa; jika ditinggalkan dan ditobati, dosa-dosa ini diampuni.",
      "Dan inilah cakrawala yang menaungi semuanya: dengan satu-satunya pengecualian wafat dalam keadaan syirik, setiap dosa — besar maupun kecil — berada di bawah ampunan Allah jika Dia berkehendak. 'Sesungguhnya Allah tidak mengampuni dosa mempersekutukan-Nya, tetapi Dia mengampuni apa yang di bawah itu bagi siapa yang Dia kehendaki' (4:48). Tidak seorang mukmin pun boleh menyimpulkan bahwa dosa-dosa besarnya menempatkannya di luar jangkauan rahmat.",
      "Setiap topik dosa besar dalam modul ini memberikan definisinya, dalilnya, mengapa itu berat, dan jalan konkret untuk tobat serta menjauhinya — selalu berakhir pada pintu terbuka yang sama.",
    ],
    quran: [
      {
        excerpt:
          "Jika kamu menjauhi dosa-dosa besar yang dilarang bagimu, Kami akan menghapus dosa-dosa kecilmu dan memasukkanmu ke tempat yang mulia.",
      },
      {
        excerpt:
          "Sesungguhnya Allah tidak mengampuni dosa mempersekutukan-Nya, tetapi Dia mengampuni apa yang di bawah itu bagi siapa yang Dia kehendaki.",
      },
      {
        excerpt:
          "Mereka yang menjauhi dosa-dosa besar dan perbuatan keji, kecuali kesalahan-kesalahan kecil — sesungguhnya Rabbmu Maha Luas ampunan-Nya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dosa-dosa besar yang paling besar adalah: mempersekutukan Allah, membunuh jiwa, durhaka kepada orang tua, dan memberikan kesaksian palsu.",
      },
    ],
    appLinks: [{ label: "Jelajahi dosa-dosa besar" }, { label: "Tobat" }],
  },
  {
    title: "Dosa-Dosa Lisan",
    summary: "Ghibah, dusta, ejekan — dosa yang mudah dilakukan dan sulit diperbaiki.",
    body: [
      "Lisan itu kecil, namun akibatnya sangat luas; dengan beberapa kata saja seseorang dapat membangun kepercayaan atau menghancurkan reputasi, menenangkan hati atau melukainya dalam-dalam. Inilah sebabnya Al-Qur'an dan Sunnah begitu sering kembali membahas dosa-dosa lisan: ghibah, fitnah (buhtan), adu domba (namimah), dusta, ejekan, dan sumpah palsu.",
      "Ghibah berarti menyebut tentang saudara atau saudarimu sesuatu yang tidak disukainya, sekalipun itu benar — sebab jika itu salah, itu menjadi dosa fitnah yang lebih berat. Al-Qur'an memberikan salah satu gambaran paling mengena: ia mengibaratkannya seperti memakan daging saudaranya yang telah mati (49:12). Dengan cara pandang ini, dosa tersebut kehilangan kesan remehnya.",
      "Yang membuat dosa-dosa ini begitu berbahaya justru karena betapa mudah dan menjadi kebiasaannya. Orang-orang tergelincir ke dalamnya dalam percakapan sehari-hari tanpa berpikir dua kali, itulah sebabnya Nabi ﷺ mengaitkan keimanan itu sendiri dengan menjaga lisan: 'Siapa yang beriman kepada Allah dan Hari Akhir, hendaklah dia berkata baik atau diam.' Jeda sederhana sebelum berbicara adalah ibadah yang sesungguhnya.",
      "Tobat dari dosa lisan mengikuti syarat-syarat umum — berhenti, menyesal, bertekad tidak mengulangi — dengan tambahan dimensi ketika hak orang lain terlibat. Ketika membersihkan nama baik mereka atau memohon maaf kepada mereka dapat dilakukan tanpa menimbulkan kerugian yang lebih besar, itu bagian dari tobat; ketika memberitahu mereka justru memperdalam luka, para ulama menyarankan untuk sebaliknya berbicara baik tentang mereka, membela mereka saat tidak hadir, dan mendoakan ampunan bagi mereka.",
    ],
    quran: [
      {
        excerpt:
          "Janganlah kalian saling menggunjing satu sama lain. Adakah salah seorang di antara kalian yang suka memakan daging saudaranya yang telah mati?",
      },
      { excerpt: "Celakalah bagi setiap pengumpat lagi pencela." },
    ],
    hadith: [
      {
        excerpt:
          "Siapa yang beriman kepada Allah dan Hari Akhir, hendaklah dia berkata baik atau diam.",
      },
    ],
    actions: [
      "Sebelum berbicara, tanyakan: apakah ini benar? apakah ini perlu? apakah ini baik?",
      "Jika kamu pernah menggunjing seseorang, doakan dia dan mintalah maaf bila memungkinkan.",
    ],
    appLinks: [
      { label: "Muhasabah harian" },
      { label: "Jannah — akhlak mulia" },
      { label: "Tobat" },
    ],
  },
  {
    title: "Mengabaikan Hak Orang Lain",
    summary: "Hak-hak sesama manusia menuntut penggantian — tobat kepada Allah saja tidak cukup.",
    body: [
      "Islam membagi kewajiban kita ke dalam dua kategori: hak-hak Allah (huquq Allah) dan hak-hak sesama manusia (huquq al-'ibad). Kezaliman (dzulm), ketidakadilan, pengkhianatan amanah, kecurangan dalam perdagangan, menahan upah pekerja, tidak melunasi utang, dan memutus tali silaturahmi — semua ini termasuk hak-hak sesama manusia — dan ini memiliki keseriusan khusus di akhirat.",
      "Alasannya digambarkan dalam sebuah hadis yang mengguncangkan. Nabi ﷺ menggambarkan orang yang benar-benar bangkrut sebagai seseorang yang datang pada Hari Kiamat dengan salat, puasa, dan sedekah — namun dia telah mencaci seseorang, memfitnah seseorang, memakan harta seseorang secara batil, dan menumpahkan darah. Orang-orang yang dizaliminya akan diberi bagian dari kebaikannya hingga habis, kemudian dosa-dosa mereka dibebankan kepadanya dan dia dilemparkan ke dalam Api (Sahih Muslim 2581). Seseorang bisa kaya dalam ibadah namun tetap binasa karena perilakunya.",
      "Ini mengajarkan pelajaran penting tentang tobat: kembali kepada Allah adalah wajib, tetapi ketika hak seseorang telah dilanggar, itu saja tidak cukup. Tuntutan orang yang dizalimi tetap ada sampai dilunasi atau dimaafkan. Maka di sini tobat memiliki syarat keempat selain berhenti, menyesal, dan bertekad — yaitu mengembalikan apa yang wajib dikembalikan.",
      "Secara praktis ini berarti mengembalikan apa yang diambil atau nilainya, melunasi utang bahkan dengan cicilan kecil sekalipun, memulihkan nama baik yang telah dirusak, dan melangkah menuju perdamaian dengan kerabat yang hubungannya telah diputus. Ada rahmat dalam hal ini juga: setiap langkah penggantian adalah kebaikan tersendiri, dan Allah memberi kemudahan bagi hati yang tulus yang berusaha memperbaiki apa yang telah dirusaknya.",
    ],
    quran: [
      {
        excerpt:
          "Jika kamu tidak berhenti dari riba, maka ketahuilah adanya perang dari Allah dan Rasul-Nya.",
      },
      {
        excerpt:
          "Mereka yang mengingkari perjanjian Allah dan memutuskan apa yang diperintahkan untuk disambung.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Tahukah kalian siapa orang yang bangkrut? Dia yang datang dengan salat, puasa, dan sedekah, namun telah mencaci, memfitnah, memakan harta secara batil, dan menumpahkan darah — maka kebaikannya diberikan kepada orang lain.",
      },
    ],
    actions: [
      "Buat daftar orang-orang yang pernah kamu zalimi dan ambil satu langkah perbaikan minggu ini.",
      "Lunasi utang yang tertunda sedikit demi sedikit jika itu yang bisa kamu lakukan.",
    ],
    appLinks: [{ label: "Perjalananku" }, { label: "Tobat" }],
  },
  {
    title: "Nifak",
    summary: "Kemunafikan besar dalam akidah — dan tanda-tanda kemunafikan dalam perilaku.",
    body: [
      "Para ulama menjelaskan dua jenis nifak, dan memisahkan keduanya melindungi dari rasa aman yang palsu maupun kepanikan yang tidak beralasan. Yang pertama adalah nifak besar dalam akidah (nifaq i'tiqadi): menampakkan Islam secara lahir sementara mengingkari keimanan secara batin. Inilah nifak yang mendapat peringatan paling keras dari Al-Qur'an, menempatkan orang-orang seperti itu 'di dasar Api yang paling bawah' (4:145), karena sesungguhnya mereka wafat sebagai orang kafir di balik topeng.",
      "Yang kedua lebih ringan, yaitu nifak dalam amal (nifaq 'amali): sifat-sifat yang menyerupai perilaku orang munafik, bahkan pada orang yang keimanannya sungguh nyata. Nabi ﷺ menyebutkan tanda-tanda yang terkenal — 'apabila berbicara dia berdusta, apabila berjanji dia mengingkari, dan apabila diberi amanah dia berkhianat' — dan dalam satu riwayat menambahkan berkata kasar saat bertengkar. Seorang mukmin bisa terjerumus ke dalamnya dan tetap menjadi mukmin, tetapi ini adalah peringatan serius yang harus dihindari.",
      "Perbedaan ini sangat penting untuk cara kita memperlakukan topik ini. Tanda-tanda amal diberikan sebagai cermin untuk diri sendiri, bukan sebagai label untuk ditempelkan pada orang lain. Nabi ﷺ dan para sahabatnya sendiri takut akan nifak dalam diri mereka sendiri, justru karena hati itu tersembunyi dan dapat berubah.",
      "Maka respons yang sehat adalah bersifat introspektif: memeriksa kejujuran, penepatan janji, dan amanah diri sendiri, serta memohon keikhlasan (ikhlas) kepada Allah. Apa yang ada di dalam diri seseorang hanya Allah yang mengetahui, dan menuduh individu tertentu bermunafik adalah kezaliman berat tersendiri terhadap mereka.",
    ],
    quran: [
      { excerpt: "Orang-orang munafik akan berada di dasar Api yang paling bawah." },
      {
        excerpt:
          "Apabila orang-orang munafik datang kepadamu, mereka berkata: Kami bersaksi bahwa engkau benar-benar Rasul Allah — dan Allah mengetahui bahwa mereka itu sungguh pendusta.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Tanda orang munafik ada tiga: apabila berbicara dia berdusta, apabila berjanji dia mengingkari, dan apabila diberi amanah dia berkhianat.",
      },
    ],
    disclaimer:
      "Jangan menuduh individu tertentu bermunafik. Nas-nas ini memperingatkan seluruh umat; penyucian diri dimulai dari diri sendiri.",
  },
  {
    title: "Hukuman yang Disebutkan",
    summary:
      "Nas-nas yang menjelaskan — bacalah dengan rasa takut kepada Allah dan harapan pada rahmat-Nya.",
    body: [
      "Al-Qur'an dan Sunnah memang menyebutkan konsekuensi tertentu untuk dosa-dosa tertentu — bagi mereka yang memakan riba, memfitnah wanita-wanita yang suci, menimbun harta dan menahan haknya, menyia-nyiakan salat, dan bersikeras dalam dosa besar. Kekhususan ini adalah bentuk kejelasan: ini tidak menyisakan ruang bagi siapa pun untuk mengatakan bahwa dia tidak diperingatkan tentang apa yang tengah dilakukannya.",
      "Sebagian konsekuensi ini disebutkan terjadi di alam kubur (azab kubur) dan sebagian di dalam Jahannam itu sendiri. Akidah Ahlus Sunnah menetapkan kenyataan keduanya, sambil menyerahkan 'bagaimana' pastinya dari perkara-perkara gaib ini kepada ilmu Allah, bukan pada imajinasi manusia.",
      "Bagaimana seorang mukmin menyikapi semua ini adalah hal yang sebenarnya penting. Tujuannya sama sekali bukan untuk terpaku pada gambaran rinci atau menenggelamkan hati; melainkan untuk menerima peringatan itu, bertobat dari apa yang berlaku, lalu mengalihkan tenaga pada amal-amal yang benar-benar melindungi. Inilah sebabnya modul ini memberi lebih banyak ruang pada perlindungan, tobat, dan rahmat daripada pada hukuman itu sendiri.",
      "Singkatnya, pelajaran yang benar dari setiap hukuman yang disebutkan adalah sebuah pertanyaan, bukan ketakutan: 'Apakah aku sedang melakukan ini — dan jika ya, bagaimana aku berhenti dan memperbaikinya?' Jika dijawab dengan jujur hari ini, peringatan itu sudah menunaikan tugas rahmatnya.",
    ],
    quran: [
      {
        excerpt:
          "Mereka yang menuduh wanita-wanita yang suci berzina dan tidak mendatangkan empat saksi — cambuklah mereka delapan puluh kali.",
      },
      {
        excerpt:
          "Mereka yang menimbun emas dan perak dan tidak menginfakkannya di jalan Allah — kabarkanlah kepada mereka siksaan yang pedih.",
      },
    ],
    appLinks: [{ label: "Perlindungan dari Jahannam" }, { label: "Harapan pada Rahmat" }],
  },
  {
    title: "Perlindungan dari Jahannam",
    summary: "Tauhid, salat, tobat, sedekah, Al-Qur'an, dan doa — inti dari modul ini.",
    body: [
      "Setelah semua peringatan, inilah intinya: Jahannam adalah sesuatu yang harus dilindungi diri seseorang darinya, dan Islam penuh dengan sarana perlindungan itu. Yang terbesar di antaranya adalah tauhid yang benar — hanya menyembah Allah, tidak menyekutukan-Nya dengan siapa pun. Setiap amal lainnya diterima dan ditimbang berdasarkan fondasi ini, itulah sebabnya menjaga akidah harus didahulukan dari segala sesuatu.",
      "Di atas fondasi ini, perisai-perisai praktis begitu banyak dan terjangkau: menegakkan lima salat wajib, tobat yang tulus, bersedekah — yang menurut sabda Nabi ﷺ memadamkan dosa sebagaimana air memadamkan api — puasa, membaca dan mengamalkan Al-Qur'an, akhlak yang baik, kasih sayang kepada sesama, dzikir yang terus-menerus, dan istighfar yang berkelanjutan. Tidak satu pun dari ini membutuhkan kekayaan besar atau ilmu tinggi; semuanya terbuka bagi siapa saja.",
      "Nabi ﷺ juga mengajarkan doa-doa langsung untuk berlindung dari Api, dan menganjurkan agar sering dipanjatkan. Beliau bersabda bahwa siapa yang memohon surga kepada Allah tiga kali, surga sendiri akan berdoa agar dia dimasukkan ke dalamnya, dan siapa yang memohon perlindungan dari Api tiga kali, Api sendiri akan berdoa agar dia diselamatkan darinya (Jami' at-Tirmidzi 2572). Doa-doa ini memiliki tempat khusus sebelum salam dalam salat dan dalam dzikir pagi serta petang.",
      "Perhatikan keseimbangan yang dibangun oleh syariat. Sarana-sarana perlindungan jauh lebih banyak, lebih ditekankan, dan lebih mudah diraih daripada sebab-sebab kebinasaan — dan ini sendiri adalah tanda rahmat Allah. Selamat jauh lebih mudah daripada binasa.",
      "Bagian ini sengaja dibuat paling besar dalam modul ini, karena Islam sendiri menimbang perkara ini demikian: peringatan selalu diiringi harapan, dan tidak pernah terlepas dari amal nyata yang bisa dimulai seseorang hari ini juga.",
    ],
    quran: [
      {
        excerpt:
          "Mereka yang berkata: Wahai Rabb kami, sesungguhnya kami telah beriman, maka ampunilah dosa-dosa kami dan lindungilah kami dari azab Api.",
      },
      {
        excerpt:
          "Wahai Rabb kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab Api.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Siapa yang memohon surga kepada Allah tiga kali, surga berkata: Ya Allah, masukkanlah dia ke dalam surga. Dan siapa yang memohon perlindungan dari Api tiga kali, Api berkata: Ya Allah, lindungilah dia dari Api.",
      },
    ],
    actions: [
      "Hafalkan doa perlindungan dari Jahannam sebelum salam dalam salat.",
      "Dirikan lima salat wajib tepat waktu — salah satu perisai yang paling kuat.",
      "Bersedekahlah secara rutin, sekalipun dalam jumlah kecil.",
    ],
    appLinks: [
      { label: "Doa-doa perlindungan" },
      { label: "Perjalanan Menuju Jannah" },
      { label: "Dzikir pagi dan petang" },
      { label: "Pelajari Doa" },
    ],
  },
  {
    title: "Tobat",
    summary:
      "Allah menerima tobat yang tulus — tidak ada dosa yang terlalu besar sebelum kematian.",
    body: [
      "Tobat — kembali (taubah) — adalah sistem yang Allah tetapkan dalam agama agar tidak ada dosa yang perlu bertahan selamanya. Pada intinya, ini adalah kembalinya hati kepada Allah, dan para ulama menyimpulkan syarat-syaratnya dari Al-Qur'an dan Sunnah: meninggalkan dosa dengan tulus, merasa penyesalan yang sungguh-sungguh atasnya, dan bertekad kuat untuk tidak mengulanginya. Ketika dosa itu berkaitan dengan hak orang lain, ada syarat keempat yang ditambahkan — mengembalikan hak itu atau memohon maaf atasnya.",
      "Yang membuat tobat begitu penuh harapan adalah bagaimana Allah menerimanya. Dia tidak sekadar menoleransi hamba yang kembali; Dia bergembira. Nabi ﷺ bersabda bahwa Allah lebih bergembira dengan tobat hamba-Nya daripada seseorang yang kehilangan tunggangan dan seluruh bekalnya di padang pasir yang sunyi, telah putus asa, lalu tiba-tiba mendapatinya berdiri di hadapannya (Sahih al-Bukhari 6309). Sambutan yang sama menanti siapa pun yang kembali.",
      "Lebih dari itu, pintunya tidak pernah tertutup sepanjang hidup. Nabi ﷺ bersabda bahwa Allah membentangkan tangan-Nya di malam hari untuk menerima tobat pelaku dosa di siang hari, dan membentangkan tangan-Nya di siang hari untuk menerima tobat pelaku dosa di malam hari (Sahih Muslim 2759). Tobat diterima bagi seseorang hingga ruh mencapai kerongkongannya saat kematian, dan bagi umat manusia hingga matahari terbit dari barat — maka tidak pernah ada alasan untuk menundanya.",
      "Ini juga berlaku bagi mereka yang telah berulang kali jatuh dan berulang kali bertobat. Selama setiap kali kembali itu tulus, Allah terus menerima; keputusasaan berasal dari setan, bukan dari agama. Satu-satunya hal yang harus dipastikan sebelum kematian adalah syirik, karena seseorang yang wafat dalam keadaan itu wafat tanpa keimanan yang diperlukan untuk tobat — justru karena itulah kembali sepenuhnya hanya kepada Allah adalah tobat yang paling mendesak.",
      "Pelajaran praktisnya sederhana: bertobatlah sekarang, bertobatlah berulang kali, dan jangan pernah biarkan besarnya suatu dosa, atau banyaknya keterpurukan di masa lalu, menjadi alasan untuk tidak kembali. Undangan itu selalu terbuka.",
    ],
    quran: [
      {
        excerpt:
          "Janganlah berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni semua dosa. Dialah Yang Maha Pengampun, Maha Penyayang.",
      },
      {
        excerpt:
          "Kecuali mereka yang bertobat, beriman, dan beramal saleh — Allah akan mengganti keburukan-keburukan mereka dengan kebaikan.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah lebih bergembira dengan tobat hamba-Nya daripada seseorang yang menemukan kembali tunggangannya yang hilang di tanah yang tandus.",
      },
      {
        excerpt:
          "Allah membentangkan tangan-Nya di malam hari untuk menerima tobat pelaku dosa di siang hari, dan membentangkan tangan-Nya di siang hari untuk menerima tobat pelaku dosa di malam hari, hingga matahari terbit dari barat.",
      },
    ],
    actions: [
      "Ucapkan 'Astaghfirullah' sepanjang hari — bukan hanya setelah kesalahan besar, jadikan itu kebiasaan tetap.",
      "Pelajari Sayyidul Istighfar dan bacalah pagi serta petang.",
    ],
    appLinks: [
      { label: "Dzikir dan istighfar harian" },
      { label: "Pelajari Doa — ampunan" },
      { label: "Harapan pada Rahmat Allah" },
      { label: "Perjalananku" },
    ],
  },
  {
    title: "Harapan pada Rahmat Allah",
    summary: "Jangan pernah putus asa — kebaikan menghapus keburukan; konsistensi adalah kuncinya.",
    body: [
      "Segala sesuatu dalam modul ini mengarah ke sini. Allah adalah Ar-Rahman Ar-Rahim — Yang Maha Pengasih lagi Maha Penyayang — dan Dia telah memberitahu kita bahwa rahmat-Nya mengalahkan murka-Nya dan 'meliputi segala sesuatu' (7:156). Seorang mukmin harus hidup di antara harap dan takut, seperti dua sayap seekor burung: cukup takut akan dosa untuk tetap waspada, cukup berharap pada ampunan untuk tidak pernah berputus asa.",
      "Inilah sebabnya keputusasaan itu sendiri tidak pada tempatnya. Betapapun tersesatnya seseorang merasa, pintu untuk kembali tetap terbuka, dan setanlah — bukan Allah — yang membisikkan bahwa sudah terlambat. Berputus asa dari rahmat adalah meremehkan Yang Maha Pengasih; tugas hati yang tulus hanyalah kembali.",
      "Di sinilah letak penghiburan besar dalam akidah Ahlus Sunnah tentang Api. Bagi mereka yang wafat dalam kekafiran, Jahannam adalah tempat kekal. Namun mukmin yang wafat hanya bersaksi kepada Allah, sekalipun terbebani dosa-dosa besar, tidak akan kekal di dalamnya. Nabi ﷺ mengajarkan bahwa orang-orang akan dikeluarkan dari Api melalui syafaat dan kemudian melalui rahmat Allah sendiri — dilemparkan ke dalam sungai kehidupan di tepi surga tempat mereka pulih lalu memasukinya (Sahih al-Bukhari 7439). Beliau bersabda bahwa tidak akan tetap tinggal di Api siapa pun yang di hatinya terdapat iman seberat biji sawi (Sahih Muslim 183). Maka bagi seorang yang bertauhid, Api — sekalipun dimasuki — tidak pernah menjadi akhir cerita.",
      "Sementara itu, rahmat tertanam dalam kehidupan sehari-hari: kebaikan-kebaikan menghapus keburukan-keburukan (11:114), dan ibadah kecil yang konsisten — satu salat yang ditegakkan tepat waktu, satu sedekah yang diam-diam, satu saat kesabaran yang ditahan karena Allah — terus-menerus menarik seseorang lebih dekat kepada-Nya dan menjauh dari kerugian. Konsistensi lebih penting daripada intensitas.",
      "Maka biarlah ini menjadi rangkuman studimu: ambillah peringatan dengan serius, tetapi biarkan harapan tetap lebih tinggi daripada rasa takut. Kenalilah bahayanya, pilihlah jalan rahmat, dan tempuhlah — selangkah demi selangkah — setiap hari hingga kamu berjumpa dengan Allah.",
    ],
    quran: [
      { excerpt: "Rahmat-Ku meliputi segala sesuatu." },
      {
        excerpt:
          "Katakanlah: Wahai hamba-hamba-Ku yang telah melampaui batas terhadap diri mereka sendiri, janganlah berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni semua dosa.",
      },
      {
        excerpt:
          "Sesungguhnya kebaikan-kebaikan menghapus keburukan-keburukan. Itu adalah peringatan bagi orang-orang yang mengingat.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah akan berfirman: Para malaikat telah memberi syafaat, para nabi telah memberi syafaat, dan orang-orang beriman telah memberi syafaat, dan kini tidak ada yang tersisa selain Yang Maha Penyayang di antara para penyayang. Lalu Dia akan mengambil segenggam dari Api dan mengeluarkan orang-orang yang belum pernah berbuat kebaikan sama sekali.",
      },
      {
        excerpt: "Siapa yang di hatinya terdapat iman seberat biji sawi akan dikeluarkan dari Api.",
      },
    ],
    actions: [
      "Akhiri setiap hari dengan istighfar dan rasa syukur atas setiap nikmat.",
      "Hubungkan modul ini dengan Perjalanan Menuju Jannah — peringatan dan harapan berjalan beriringan.",
    ],
    appLinks: [
      { label: "Perjalanan Menuju Jannah" },
      { label: "Akidah — harapan dan tobat" },
      { label: "Perjalananku" },
    ],
  },
  {
    title: "Dosa yang membinasakan",
    summary: "Jangan berputus asa dari rahmat Allah; pintu tobat terbuka hingga kematian.",
    body: [
      "Jangan berputus asa dari rahmat Allah; pintu tobat terbuka hingga kematian.",
      "Berpeganglah pada Al-Qur’an dan Sunnah, lalu bertobatlah hari ini.",
      "Lakukan amal dengan ikhlas karena Allah.",
      "Berpeganglah pada Al-Qur’an dan Sunnah, lalu bertobatlah hari ini.",
      "Jangan berputus asa dari rahmat Allah; pintu tobat terbuka hingga kematian.",
    ],
    destructiveItems: [
      {
        title: "Syirik",
        summary: "Jangan berputus asa dari rahmat Allah; pintu tobat terbuka hingga kematian.",
      },
      {
        title: "Sihir",
        summary: "Jangan berputus asa dari rahmat Allah; pintu tobat terbuka hingga kematian.",
      },
      {
        title: "Membunuh",
        summary: "Jangan berputus asa dari rahmat Allah; pintu tobat terbuka hingga kematian.",
      },
      {
        title: "Riba",
        summary: "Jangan berputus asa dari rahmat Allah; pintu tobat terbuka hingga kematian.",
      },
      {
        title: "Harta anak yatim",
        summary: "Jangan berputus asa dari rahmat Allah; pintu tobat terbuka hingga kematian.",
      },
      {
        title: "Lari dari pertempuran",
        summary: "Jangan berputus asa dari rahmat Allah; pintu tobat terbuka hingga kematian.",
      },
      {
        title: "Menuduh wanita suci",
        summary: "Jangan berputus asa dari rahmat Allah; pintu tobat terbuka hingga kematian.",
      },
      {
        title: "Orang bangkrut",
        summary: "Jangan berputus asa dari rahmat Allah; pintu tobat terbuka hingga kematian.",
      },
    ],
    quran: [
      {
        excerpt: "Allah akan menegakkan timbangan keadilan pada Hari Kiamat.",
      },
      {
        excerpt: "Allah akan menegakkan timbangan keadilan pada Hari Kiamat.",
      },
      {
        excerpt: "Allah akan menegakkan timbangan keadilan pada Hari Kiamat.",
      },
    ],
    hadith: [
      {
        excerpt: "Dua kalimat ringan di lisan, berat di timbangan.",
      },
      {
        excerpt: "Dua kalimat ringan di lisan, berat di timbangan.",
      },
      {
        excerpt: "Dua kalimat ringan di lisan, berat di timbangan.",
      },
      {
        excerpt: "Dua kalimat ringan di lisan, berat di timbangan.",
      },
      {
        excerpt: "Dua kalimat ringan di lisan, berat di timbangan.",
      },
    ],
    actions: [
      "Lakukan amal dengan ikhlas karena Allah.",
      "Berpeganglah pada Al-Qur’an dan Sunnah, lalu bertobatlah hari ini.",
      "Jangan berputus asa dari rahmat Allah; pintu tobat terbuka hingga kematian.",
    ],
    appLinks: [
      {
        label: "Dosa yang membinasakan",
      },
      {
        label: "Amal berat di timbangan",
      },
      {
        label: "Akhlak mulia",
      },
      {
        label: "Repentance",
      },
    ],
  },
];

export const JAHANNAM_MAJOR_SIN_TOPICS_ID: DeepPartial<JahannamTopic>[] = [
  {
    title: "Syirik",
    summary:
      "Menyekutukan Allah — satu-satunya dosa yang tidak diampuni jika seseorang wafat karenanya.",
    body: [
      "Definisi: Syirik adalah menyekutukan Allah dengan sesuatu yang lain — mengalihkan sebuah tindakan yang hanya menjadi hak-Nya semata (ibadah, kecintaan tertinggi, rasa takut, harapan, tawakal, atau hak menetapkan hukum) kepada selain diri-Nya. Ini adalah kebalikan mutlak dari tauhid, dan menyerang tujuan sejati keberadaan makhluk: hanya menyembah Allah.",
      "Mengapa ini dosa paling berat: Setiap dosa lain adalah pelanggaran yang dilakukan sambil tetap mengakui Rabb yang sejati, tetapi syirik adalah pelanggaran langsung terhadap-Nya sendiri — menganggap makhluk sebagai Sang Pencipta. Inilah sebabnya Al-Qur'an menyebutnya 'kezaliman yang besar' (31:13). Ini adalah satu-satunya dosa yang, jika seseorang wafat karenanya tanpa bertobat, tidak diampuni: 'Sesungguhnya Allah tidak mengampuni dosa mempersekutukan-Nya, tetapi Dia mengampuni apa yang di bawah itu bagi siapa yang Dia kehendaki' (4:48). Rahmat yang tersembunyi dalam ketegasan ini adalah bahwa segala sesuatu selain syirik tetap berada dalam jangkauan ampunan Allah.",
      "Bentuk-bentuknya: Para ulama membedakan syirik besar — menyembah berhala, orang mati, orang saleh, atau makhluk; memohon kepada selain Allah atas sesuatu yang hanya Dia yang dapat memberikannya; dan menujukan kurban atau nazar kepada selain-Nya — yang mengeluarkan seseorang dari Islam tanpa tobat. Selain itu ada syirik kecil dan tersembunyi, seperti riya dalam ibadah, bersumpah dengan selain Allah, atau bergantung pada ramalan dan jimat, yang merupakan dosa berat namun tidak dengan sendirinya mengeluarkan seseorang dari agama.",
      "Jalan untuk menjauhinya: Pelajarilah tauhid, sembahlah hanya Allah, dan jagalah serta perkuat keikhlasan niat agar amal ditujukan hanya untuk-Nya, bukan untuk dilihat orang. Siapa yang telah terjerumus dalam syirik bertobat dengan meninggalkannya secara tulus dan kembali hanya menyembah Allah — dan pintu kembali itu tetap terbuka sepanjang hidupnya.",
    ],
    quran: [
      {
        excerpt:
          "Sesungguhnya Allah tidak mengampuni dosa mempersekutukan-Nya, tetapi Dia mengampuni apa yang di bawah itu bagi siapa yang Dia kehendaki.",
      },
      {
        excerpt:
          "Wahai anakku, janganlah kamu mempersekutukan Allah. Sesungguhnya syirik adalah kezaliman yang besar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dosa-dosa besar yang paling besar adalah: mempersekutukan Allah, membunuh jiwa, durhaka kepada orang tua, dan memberikan kesaksian palsu.",
      },
    ],
    actions: [
      "Pelajari Akidah dan tauhid melalui 99 Nama Allah.",
      "Murnikan niat dalam ibadah — mohonlah keikhlasan kepada Allah setiap hari.",
    ],
    appLinks: [{ label: "Akidah — penjelasan syirik" }, { label: "Tobat" }],
  },
  {
    title: "Pembunuhan",
    summary: "Mengambil nyawa yang tidak bersalah tanpa hak — salah satu pelanggaran paling berat.",
    body: [
      "Definisi: Pembunuhan di sini merujuk pada pengambilan nyawa secara tidak sah dan disengaja terhadap jiwa yang telah Allah muliakan kehormatannya. Islam mengakui bentuk-bentuk yang sah — seperti qisas yang ditegakkan melalui otoritas yang tepat — tetapi membunuh jiwa yang tidak bersalah tanpa alasan yang sah adalah salah satu kejahatan paling berat.",
      "Mengapa ini begitu berat: Al-Qur'an menimbang satu pembunuhan tanpa hak setara dengan seluruh umat manusia: 'Siapa yang membunuh satu jiwa… seolah-olah dia telah membunuh seluruh manusia' (5:32), karena menghancurkan satu jiwa adalah melanggar kehormatan yang melindungi setiap jiwa. Pembunuhan adalah dosa pertama di antara keturunan Adam, dan wahyu berulang kali kembali membahasnya sebagai penghancur akhirat.",
      "Pelanggaran ganda: Pembunuhan sekaligus merupakan dosa terhadap Allah, yang haknya atas kehormatan jiwa telah dilanggar, dan dosa terhadap sesama manusia — korban dan keluarga yang ditinggalkannya. Inilah sebabnya tobatnya sering kali lebih berat daripada kebanyakan dosa lain: kembali kepada Allah adalah wajib, tetapi hak-hak orang yang dizalimi juga tetap ada, dan di mana hukum negara atau hukum Islam menetapkan diyat atau konsekuensi lain, itu harus dipenuhi melalui cara yang sesuai dan ulama yang berwenang.",
      "Jalan untuk menjauhinya: Anggaplah setiap jiwa mulia, redakan kemarahan dan permusuhan sebelum memuncak, dan selesaikan perselisihan dengan kesabaran dan keadilan, bukan dengan kekerasan. Bahkan kejahatan terbesar terhadap sesama manusia ini pun tidak berada di luar jangkauan rahmat Allah bagi siapa yang bertobat dengan tulus, memenuhi hak-hak terkait semampu mungkin, dan tidak pernah kembali ke jalan itu.",
    ],
    quran: [
      {
        excerpt:
          "Siapa yang membunuh satu jiwa bukan karena orang itu membunuh jiwa lain atau berbuat kerusakan di bumi — seolah-olah dia telah membunuh seluruh manusia.",
      },
      {
        excerpt:
          "Siapa yang membunuh seorang mukmin dengan sengaja — balasannya adalah Jahannam, kekal di dalamnya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dosa-dosa besar yang paling besar adalah: mempersekutukan Allah, membunuh jiwa, durhaka kepada orang tua, dan memberikan kesaksian palsu.",
      },
    ],
    actions: ["Hargailah setiap jiwa; selesaikan perselisihan dengan kesabaran dan keadilan."],
    appLinks: [{ label: "Mengabaikan hak orang lain" }],
  },
  {
    title: "Zina",
    summary: "Hubungan seksual yang tidak sah — dosa yang merusak jiwa dan masyarakat.",
    body: [
      "Definisi: Zina adalah setiap hubungan seksual tidak sah yang terjadi di luar pernikahan yang sah, mencakup baik yang dilakukan orang yang belum menikah maupun yang melibatkan orang yang sudah menikah. Islam tidak memandangnya sebagai urusan pribadi, melainkan pelanggaran dengan dampak yang luas.",
      "Mengapa ini berat: Zina meluluhlantakkan fondasi yang menopang masyarakat yang sehat — garis keturunan, kepercayaan antara suami istri, perlindungan anak-anak, dan kesucian diri yang memuliakan manusia. Kata-kata Al-Qur'an sendiri sarat pelajaran: ia tidak sekadar mengharamkan perbuatan itu tetapi berkata 'janganlah kalian mendekatinya' (17:32), memperingatkan pandangan, kesendirian, dan langkah-langkah yang menuju ke arah itu. Larangan mendekat ini adalah rahmat, karena melindungi seseorang sebelum hasrat lepas kendali.",
      "Hikmah di balik pembatasan: Alih-alih membiarkan orang bergulat dengan hasrat pada puncaknya, Islam mengelilingi mereka dengan perlindungan lebih awal — menundukkan pandangan, menjaga rasa malu dalam berpakaian dan berperilaku, menghindari berdua-duaan dengan yang bukan mahram, dan mendorong pernikahan sebagai jalan yang sah dan terhormat untuk memenuhi kebutuhan ini. Membangun batasan-batasan ini lebih dini jauh lebih mudah daripada berjuang di tepi jurang.",
      "Jalan kembali: Bagi siapa pun yang telah jatuh, jalannya adalah tobat yang tulus — meninggalkan dosa sepenuhnya, menyesalinya, bertekad tidak mengulanginya, dan menutupi masa lalu, bukan menyebarluaskannya. Zina adalah dosa besar, tetapi ia termasuk dosa-dosa yang Allah ampuni bagi siapa yang kembali kepada-Nya; tidak ada tempat untuk berputus asa, dan awal yang baru selalu tersedia.",
    ],
    quran: [
      {
        excerpt:
          "Janganlah kalian mendekati zina. Sesungguhnya ia adalah perbuatan keji dan jalan yang sangat buruk.",
      },
      {
        excerpt:
          "Dan mereka yang tidak berzina… kecuali mereka yang bertobat, beriman, dan beramal saleh — Allah akan mengganti keburukan-keburukan mereka dengan kebaikan.",
      },
    ],
    actions: [
      "Jagalah pandangan mata dan penggunaan media sosial.",
      "Jika belum menikah, berdoalah untuk mendapatkan pasangan yang saleh atau salehah.",
    ],
    appLinks: [{ label: "Tobat" }],
  },
  {
    title: "Riba",
    summary: "Bunga dan riba — Al-Qur'an menyatakan perang terhadap para pelakunya.",
    body: [
      "Definisi: Riba adalah tambahan yang tidak sah dalam transaksi keuangan tertentu — bentuk yang paling dikenal adalah bunga yang diambil atau diberikan atas pinjaman, tetapi juga mencakup pertukaran barang sejenis tertentu yang tidak setara atau ditangguhkan. Intinya adalah memperoleh keuntungan dari beban orang lain tanpa nilai atau risiko yang nyata.",
      "Mengapa ini sangat berat: Bahasa yang digunakan Al-Qur'an untuk melawan riba unik di antara dosa-dosa finansial. Allah menyatakan perang, atas nama diri-Nya dan Rasul-Nya ﷺ, terhadap mereka yang bersikeras melakukannya (2:279) — sebuah ungkapan yang tidak digunakan untuk dosa lain mana pun — karena riba mengeksploitasi kebutuhan, mengumpulkan kekayaan di tangan segelintir orang, dan mengikis kasih sayang yang seharusnya menopang sebuah perekonomian. Nabi ﷺ memperingatkan keras terhadap transaksi semacam ini dalam kapasitas apa pun.",
      "Hikmah dan rahmat: Larangan ini mengarahkan orang pada perdagangan yang nyata, risiko bersama, dan sedekah, serta melindungi yang lemah dari terlilit beban utang. Rahmat Allah hadir di sini juga: ketika perintah ini turun, Dia tidak menuntut agar riba yang telah diambil sebelumnya dikembalikan, melainkan hanya meminta orang-orang beriman meninggalkan sisanya — 'bagimu adalah pokok hartamu' (2:279) — kemudahan bagi mereka yang berbalik darinya.",
      "Jalan untuk menjauhinya: Tinjau kembali produk-produk berbasis riba dalam keuanganmu, carilah alternatif yang halal, dan konsultasikan dengan ulama yang kompeten untuk kasus-kasus sulit yang nyata seperti KPR di negara non-Muslim. Meninggalkan riba mungkin menuntut keputusan finansial yang sulit, tetapi keselamatan jiwa lebih besar daripada keuntungan sesaat mana pun — dan Allah menjanjikan rezeki dari arah yang tidak disangka-sangka bagi siapa yang bertakwa kepada-Nya.",
    ],
    quran: [
      {
        excerpt:
          "Wahai orang-orang yang beriman, bertakwalah kepada Allah dan tinggalkan sisa riba jika kamu benar-benar beriman. Jika kamu tidak melakukannya, maka ketahuilah adanya perang dari Allah dan Rasul-Nya. Dan jika kamu bertobat, maka bagimu adalah pokok hartamu — kamu tidak menzalimi dan tidak pula dizalimi.",
      },
      { excerpt: "Allah memusnahkan riba dan menyuburkan sedekah." },
    ],
    actions: [
      "Tinjau kembali produk-produk berbasis riba dalam keuanganmu.",
      "Konsultasikan KPR dan pinjaman dengan ulama yang kompeten.",
    ],
    appLinks: [{ label: "Panduan Zakat" }],
  },
  {
    title: "Kesaksian Palsu",
    summary: "Berdusta di bawah sumpah atau memberi kesaksian palsu — menghancurkan keadilan.",
    body: [
      "Definisi: Kesaksian palsu (shahadat az-zur) adalah bersaksi atas sesuatu yang tidak benar — dan dalam pengertian yang lebih luas, berdusta di bawah sumpah, membuat tuduhan yang direkayasa, atau menahan kesaksian yang benar ketika keadilan bergantung padanya.",
      "Mengapa ini berat: Ini merusak alat itu sendiri yang menjadi sandaran keadilan. Seorang saksi palsu dapat menjerumuskan orang yang tidak bersalah ke dalam kehancuran, merampas hak seseorang dari miliknya, atau membebaskan orang yang zalim — maka dusta tidak pernah hanya terbatas pada si pendusta; ia melukai orang-orang yang nyata dan seluruh sistem keadilan. Nabi ﷺ menghitungnya di antara dosa-dosa besar yang paling besar, dan dalam satu riwayat mengulangi peringatan terhadapnya begitu sering hingga para sahabat berharap beliau berhenti demi kebaikan beliau sendiri.",
      "Kaitannya dengan lisan: Kesaksian palsu adalah mata pisau paling tajam dari dosa-dosa lisan yang lebih luas. Karena mengucapkan kata-kata itu murah, dosa ini bisa dilakukan dengan sangat mudah dan berbahaya — sebuah tanda tangan, sebuah pembesar-besaran, sebuah diamnya yang mudah — namun bobotnya sangat berat pada Hari Kiamat, ketika anggota tubuh dan lisan manusia sendiri akan bersaksi atas kebenaran melawan mereka.",
      "Jalan untuk menjauhinya: Berpegang teguhlah pada kebenaran sekalipun mahal harganya atau bertentangan dengan kepentinganmu sendiri, jangan pernah memberikan kesaksianmu untuk sebuah dusta, dan bersuaralah dengan kesaksian yang adil ketika dibutuhkan. Siapa yang telah memberikan kesaksian palsu bertobat dengan menarik kembali dusta itu bila memungkinkan, berusaha memperbaiki kerugian dan memulihkan hak orang yang dizalimi, dan kembali kepada Allah dengan penyesalan yang tulus.",
    ],
    quran: [
      {
        excerpt:
          "Dan mereka yang tidak memberikan kesaksian palsu, dan apabila melewati perbuatan sia-sia, mereka berlalu dengan penuh kehormatan.",
      },
      { excerpt: "Maka jauhilah kotoran berhala-berhala dan jauhilah perkataan dusta." },
    ],
    hadith: [
      {
        excerpt:
          "Maukah kuberitahu kalian dosa-dosa besar yang paling besar? Mempersekutukan Allah, durhaka kepada orang tua — dan memberikan kesaksian palsu, dan memberikan kesaksian palsu.",
      },
    ],
    appLinks: [{ label: "Dosa-dosa lisan" }],
  },
  {
    title: "Sihir",
    summary:
      "Sihir, mendatangi tukang sihir, dan ritual gaib — kekafiran dalam bentuk-bentuk besarnya.",
    body: [
      "Definisi: Sihr (sihir) adalah penggunaan sarana yang dilarang — sering kali bergantung pada setan atau klaim menguasai hal gaib — untuk mempengaruhi orang atau peristiwa. Melakukannya, mempelajarinya, meminta orang lain melakukannya, dan membenarkan orang yang mengklaimnya, semuanya termasuk dalam dosa ini.",
      "Mengapa ini begitu berat: Sebagian besar sihir tidak terlaksana tanpa perbuatan kekafiran, seperti mendekatkan diri kepada setan atau menghina Al-Qur'an, itulah sebabnya Al-Qur'an mengaitkan ilmu ini dengan kekafiran. Menyebutkan sihir yang dipelajari pada masa Nabi Sulaiman 'alaihis salam, Allah berfirman bahwa para setan dan dua malaikat itu hanya mengajarkannya sebagai ujian, memperingatkan 'janganlah kamu kafir' (2:102). Selain bahaya bagi akidah, sihir merugikan orang-orang secara nyata — memisahkan suami istri, menyebarkan ketakutan, dan mengeksploitasi mereka yang tidak berdaya.",
      "Ritual-ritual terkait: Peringatan yang sama meluas hingga perdukunan (kahanah), menganggap astrologi sebagai pengetahuan pasti tentang yang gaib, serta jimat dan mantra yang mengandung syirik. Pengetahuan tentang masa depan yang tersembunyi hanya milik Allah, dan bersandar kepada mereka yang mengklaimnya melemahkan tauhid dari akarnya.",
      "Jalan untuk menjauhinya: Bagi siapa yang terjerumus dalam ritual-ritual ini, tobat berarti meninggalkannya sepenuhnya, memusnahkan benda-benda terlarang apa pun, memutus hubungan dengan mereka yang mempraktikkannya, dan memperbarui tauhid serta tawakal yang murni hanya kepada Allah. Perlindungan ada dalam keimanan, dzikir harian, dan memohon perlindungan kepada Allah — dan ampunan-Nya terbuka bagi siapa pun yang benar-benar kembali.",
    ],
    quran: [
      {
        excerpt:
          "Dan mereka mengikuti apa yang dibacakan setan-setan pada masa kerajaan Sulaiman… dan mereka mempelajari apa yang membahayakan mereka dan tidak memberi manfaat.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Siapa yang mendatangi seorang dukun dan membenarkan perkataannya, maka dia telah mengingkari apa yang diturunkan kepada Muhammad ﷺ.",
      },
    ],
    appLinks: [{ label: "Akidah — tauhid" }],
  },
  {
    title: "Memakan Harta Anak Yatim",
    summary: "Mengambil atau menyia-nyiakan harta anak yatim secara tidak sah.",
    body: [
      "Definisi: Dosa ini adalah mengambil, menyia-nyiakan, atau menyalahgunakan harta anak-anak yatim — anak-anak yang ayahnya telah meninggal dan yang tidak dapat melindungi kepentingan mereka sendiri. Wali menyimpan harta mereka sebagai amanah, bukan sebagai pemilik.",
      "Mengapa ini berat: Ini menggabungkan dua pelanggaran — pengkhianatan amanah yang suci dan kezaliman terhadap yang paling tidak berdaya. Gambaran Al-Qur'an sangat tegas: mereka yang memakan harta anak yatim secara tidak sah 'sesungguhnya hanya memenuhi perut mereka dengan api' (4:10), mengubah satu momen ketamakan menjadi hukuman yang mereka tanggung sendiri. Mengeksploitasi mereka yang tidak memiliki suara adalah salah satu bentuk ketidakadilan yang terburuk, itulah sebabnya peringatannya begitu tajam — dan karena tajamnya itu, penuh rahmat dalam mengalihkan para wali darinya.",
      "Apa yang termasuk di dalamnya: Bukan hanya pencurian terang-terangan, tetapi juga bentuk-bentuk yang lebih halus — mencampur harta anak yatim dengan harta sendiri hingga batasnya kabur, menunda pengembalian hartanya ketika dia telah dewasa, atau menginvestasikan atau membelanjakannya tanpa hak. Allah memerintahkan sebaliknya: 'Berikanlah kepada anak-anak yatim harta mereka, dan janganlah kamu menukar yang buruk dengan yang baik' (4:2).",
      "Jalan untuk menjauhinya: Jagalah harta anak yatim dengan cermat, pisahkan dan catat dengan teliti, serahkan sepenuhnya begitu mereka dewasa, dan — bagi yang pernah lalai — bertobatlah dengan mengembalikan apa yang wajib dikembalikan berikut tambahan yang sah, serta memohon maaf kepada mereka yang dizalimi. Pada hari ketika harta atau garis keturunan tidak berguna kecuali hati yang bersih, mengembalikan amanah semacam itu adalah kebaikan yang sangat berharga.",
    ],
    quran: [
      {
        excerpt:
          "Mereka yang memakan harta anak yatim secara tidak sah — sesungguhnya hanya memenuhi perut mereka dengan api.",
      },
      {
        excerpt:
          "Berikanlah kepada anak-anak yatim harta mereka, dan janganlah kamu menukar yang buruk dengan yang baik, dan janganlah kamu memakan harta mereka bersama harta kalian.",
      },
    ],
    appLinks: [{ label: "Mengabaikan hak orang lain" }],
  },
  {
    title: "Durhaka kepada Orang Tua",
    summary: "Uquq — salah satu dosa besar setelah syirik.",
    body: [
      "Definisi: 'Uquq al-Walidayn adalah durhaka dan berlaku buruk secara serius kepada orang tua — menyakiti mereka, memperlakukan mereka dengan hina, mengabaikan mereka ketika membutuhkan, atau melukai mereka dengan perkataan maupun perbuatan. Ini adalah kebalikan dari birrul walidain, kebaikan penuh ketaatan yang diperintahkan Islam.",
      "Mengapa ini begitu berat: Ayat demi ayat, Allah mengaitkan perintah untuk menyembah-Nya dengan perintah untuk berbuat baik kepada orang tua, seperti 'sembahlah Allah… dan berbuat baiklah kepada kedua orang tua' (4:36) — menempatkan hak mereka segera setelah hak-Nya sendiri. Orang tua, setelah Allah, adalah sumber terdekat keberadaan dan pengasuhan seseorang, sehingga ketidaktahuberterimakasihan terhadap mereka adalah ketidaktahuberterimakasihan yang menusuk dalam. Nabi ﷺ menghitung perlakuan buruk terhadap mereka di antara dosa-dosa besar yang paling besar, segera setelah syirik.",
      "Satu keseimbangan penting: Ketaatan tidak berarti menaati orang tua dalam kemaksiatan kepada Allah — tidak ada ketaatan kepada makhluk dalam kemaksiatan kepada Sang Pencipta. Namun ketika penolakan diperlukan, itu dilakukan dengan lemah lembut, hormat, dan tetap berbuat baik secara berkelanjutan. Al-Qur'an bahkan melarang kata sekecil 'ah' sekalipun karena kesal: 'janganlah kamu mengatakan kepada keduanya perkataan ah' (17:23).",
      "Jalan kembali: Rahmatnya di sini adalah bahwa orang tua sering kali masih dapat dijangkau. Bagi yang telah lalai, tobatnya sebagian besar bersifat praktis — mulai kembali berbuat baik, memohon maaf kepada mereka, melayani mereka, dan mendoakan mereka, terutama selagi mereka masih hidup. Dan jika ayah atau ibu telah wafat, ketaatan tetap berlanjut melalui doa untuk mereka, sedekah atas nama mereka, dan menghormati kerabat serta sahabat mereka.",
    ],
    quran: [
      {
        excerpt:
          "Rabbmu telah menetapkan agar kamu tidak menyembah selain Dia, dan berbuat baiklah kepada kedua orang tua. Janganlah kamu mengatakan kepada keduanya perkataan 'ah' dan janganlah kamu membentak mereka, tetapi ucapkanlah kepada mereka perkataan yang mulia.",
      },
      {
        excerpt:
          "Sembahlah Allah dan janganlah kamu mempersekutukan-Nya dengan sesuatu apa pun, dan berbuat baiklah kepada kedua orang tua.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Maukah kuberitahu kalian dosa-dosa besar yang paling besar? Mempersekutukan Allah, dan durhaka kepada orang tua.",
      },
    ],
    actions: ["Hubungi atau kunjungi orang tuamu minggu ini dengan perkataan yang penuh kebaikan."],
    appLinks: [{ label: "Mengabaikan hak orang lain" }],
  },
  {
    title: "Mencuri",
    summary:
      "Mengambil harta orang lain secara tidak sah — melanggar kepercayaan dan mengundang hukuman.",
    body: [
      "Definisi: Mencuri (sariqah) adalah mengambil harta atau milik orang lain tanpa hak — baik secara diam-diam, dengan pengkhianatan, dengan penipuan, atau dengan cara tersembunyi apa pun untuk menguasai sesuatu yang bukan haknya.",
      "Mengapa ini berat: Ini melanggar baik hak sesama manusia maupun kepercayaan yang menjadi sandaran kehidupan bersama. Keseriusannya ditandai oleh hukuman tertentu yang disebutkan Al-Qur'an untuk kasus-kasus yang memenuhi syarat (5:38) — sebuah hukuman yang dibatasi oleh syarat-syarat ketat dan standar pembuktian yang tinggi, sehingga ketegasannya terutama berfungsi sebagai peringatan yang kuat yang menjaga harta orang-orang tetap aman. Tujuan Islam adalah masyarakat di mana orang merasa aman dengan barang-barang mereka.",
      "Bentuk-bentuk modernnya: Mencuri tidak terbatas pada membobol sebuah rumah. Ini mencakup mengambil dari majikan, kecurangan dalam bisnis, menahan upah pekerja, pembajakan digital, plagiarisme, dan memanfaatkan sesuatu yang bukan haknya secara sah. Apa yang tersembunyi dari manusia tidak pernah tersembunyi dari Allah, yang melihat setiap pengambilan yang tersembunyi.",
      "Jalan kembali: Karena ini melibatkan hak seseorang, tobat menuntut lebih dari sekadar penyesalan di hadapan Allah. Barang yang dicuri itu sendiri, atau nilainya, harus dikembalikan kepada pemiliknya yang berhak, dan maaf harus dimohon bila memungkinkan; jika pemiliknya tidak ditemukan, para ulama menyarankan agar jumlah itu disedekahkan atas namanya. Dengan cara ini terpenuhi, pencurian pun sepenuhnya diampuni oleh Dzat yang mencintai hamba yang kembali.",
    ],
    quran: [
      {
        excerpt:
          "Adapun pencuri laki-laki dan perempuan, potonglah tangan keduanya sebagai balasan atas apa yang telah mereka perbuat — sebuah hukuman dari Allah.",
      },
    ],
    actions: ["Kembalikan barang curian atau nilainya; mohonlah maaf kepada orang yang dizalimi."],
    appLinks: [{ label: "Tobat" }],
  },
  {
    title: "Minuman Keras dan Zat yang Memabukkan",
    summary: "Khamr dan zat memabukkan — diharamkan secara bertahap namun mutlak dalam Al-Qur'an.",
    body: [
      "Definisi: Khamr adalah segala sesuatu yang memabukkan dan menutupi akal — minuman keras dan semua jenis anggur, dan menurut prinsip Nabi ﷺ sendiri, setiap zat yang memabukkan apa pun bentuk atau namanya. 'Setiap yang memabukkan adalah khamr, dan setiap khamr adalah haram.'",
      "Mengapa ini berat: Akal adalah kekuatan yang dengannya manusia mengenal Allah, membedakan benar dan salah, dan menjaga setiap tanggung jawab lainnya. Zat-zat yang memabukkan justru meruntuhkan hal ini, itulah sebabnya Al-Qur'an menyebutnya, bersama berhala dan judi, sebagai 'kekejian dari perbuatan setan' dan memerintahkan, 'jauhilah itu' (5:90). Melampaui individu, zat-zat ini menghancurkan kesehatan, keluarga, dan keselamatan, serta membuka pintu bagi dosa-dosa yang seharusnya tidak pernah didekati orang yang berakal sehat.",
      "Hikmah di balik pengharamannya: Allah tidak mengharamkan khamr dalam satu pukulan mendadak, melainkan mengharamkannya secara bertahap, dengan lembut membebaskan masyarakat awal dari kebiasaan yang sudah mengakar dalam. Sifat bertahap ini sendiri adalah pelajaran rahmat — dan teladan harapan bagi siapa pun yang berjuang meninggalkannya hari ini.",
      "Jalan kembali, dengan penuh kasih sayang: Mereka yang kecanduan tidak boleh dihina, melainkan harus dibantu. Tobat berarti bertekad meninggalkan zat itu, menyingkirkannya beserta pemicu-pemicunya dari kehidupan, mencari bantuan dan pengobatan tanpa rasa malu, dan mengisi kekosongan itu dengan pergaulan yang baik, dzikir, dan ibadah. Pintu Allah terbuka, dan setiap langkah tulus menjauh dari kecanduan adalah langkah yang Dia sambut.",
    ],
    quran: [
      {
        excerpt:
          "Wahai orang-orang yang beriman, sesungguhnya khamr, judi, berhala, dan anak panah undian adalah kekejian dari perbuatan setan — maka jauhilah itu.",
      },
    ],
    hadith: [
      {
        excerpt: "Setiap yang memabukkan adalah khamr, dan setiap khamr adalah haram.",
      },
    ],
    actions: [
      "Carilah bantuan bila diperlukan; gantikan kebiasaan itu dengan dzikir dan pergaulan yang baik.",
    ],
    appLinks: [{ label: "Dzikir harian" }],
  },
];

export const JAHANNAM_NAMES_ID: DeepPartial<JahannamNameEntry>[] = [
  {
    name: "Jahannam",
    transliteration: "Jahannam",
    meaning: "Api — nama yang paling sering disebut Al-Qur'an untuk neraka.",
    quran: {
      excerpt:
        "Takutlah kepada Api yang bahan bakarnya adalah manusia dan batu, yang disediakan bagi orang-orang kafir.",
    },
    context:
      "Muncul di seluruh Al-Qur'an sebagai tempat siksaan bagi mereka yang mengingkari keimanan dan bersikeras dalam keburukan.",
    tafsirNote:
      "Ibnu Katsir menjelaskan bahwa Jahannam adalah nama menyeluruh untuk Api yang disediakan sebagai peringatan dan tempat kembali.",
    scholarlyNote:
      "Sebagian ulama membahas apakah Jahannam adalah seluruh neraka atau satu tingkatan tertentu — pendapat berbeda-beda.",
  },
  {
    name: "Jahim",
    transliteration: "Jahim",
    meaning: "Api yang berkobar — panas yang hebat dan menyala.",
    quran: {
      excerpt:
        "Kamu dan apa yang kamu sembah selain Allah adalah bahan bakar Jahannam — kamu akan memasukinya.",
    },
    context: "Menggambarkan hebatnya api yang disediakan bagi mereka yang menyekutukan Allah.",
    tafsirNote:
      "Al-Thabari mengaitkan Jahim dengan api yang berkobar dan menyala yang tidak menyisakan apa pun.",
  },
  {
    name: "Saqar",
    transliteration: "Saqar",
    meaning: "Yang menghanguskan atau tidak menyisakan apa pun — panas yang hebat.",
    quran: {
      excerpt: "Aku akan memasukkannya ke dalam Saqar. Dan tahukah kamu apa itu Saqar?",
    },
    context: "Disebutkan dalam Surah Al-Muddatstsir tentang seseorang yang berpaling dari wahyu.",
    tafsirNote:
      "Tafsir klasik menggambarkan Saqar sebagai satu tingkatan neraka yang membakar dengan hebat; perinciannya berbeda-beda di antara ulama.",
    scholarlyNote:
      "Apakah Saqar adalah tingkatan tersendiri atau nama untuk seluruh neraka masih diperdebatkan dalam tafsir — tidak eksplisit dalam satu nas yang disepakati.",
  },
  {
    name: "Sa'ir",
    transliteration: "Sa'ir",
    meaning: "Yang berkobar — api yang menyala.",
    quran: {
      excerpt: "Mereka akan berada di dalam Sa'ir — api yang berkobar.",
    },
    context: "Peringatan bagi mereka yang memakan harta anak yatim secara tidak sah.",
    tafsirNote:
      "Akar katanya membawa makna menyalakan dan membakar — menekankan api yang aktif dan menghanguskan.",
  },
  {
    name: "Al-Hutamah",
    transliteration: "Al-Hutamah",
    meaning: "Yang meremukkan — yang menghancurkan dan meremukkan menjadi berkeping-keping.",
    quran: {
      excerpt:
        "Dia pasti akan dilemparkan ke dalam al-Hutamah. Dan tahukah kamu apa itu al-Hutamah?",
    },
    context:
      "Hukuman bagi orang yang menggunjing dan mengumpulkan harta, mengira itu akan membuatnya hidup kekal.",
    tafsirNote:
      "Ibnu Katsir menjelaskan bahwa al-Hutamah meremukkan dan menghanguskan — sebuah api yang dinyalakan Allah.",
  },
  {
    name: "Al-Hawiyah",
    transliteration: "Al-Hawiyah",
    meaning: "Jurang atau lubang — jatuh yang dalam.",
    quran: {
      excerpt: "Dan adapun orang yang ringan timbangannya — tempat kembalinya adalah al-Hawiyah.",
    },
    context: "Tujuan bagi mereka yang kebaikannya sangat ringan pada Hari Kiamat.",
    tafsirNote:
      "Digambarkan sebagai jurang yang dalam di dalam Api; al-Thabari mengutip pendapat tentang kedalaman dan keparahannya.",
    scholarlyNote:
      "Sebagian tafsir menghitung al-Hawiyah sebagai tingkatan tertentu — kutiplah ini sebagai tafsiran keilmuan.",
  },
  {
    name: "Laza",
    transliteration: "Laza",
    meaning: "Nyala api — api yang berkobar.",
    quran: {
      excerpt: "Sekali-kali tidak! Sesungguhnya itu adalah nyala api Allah yang bergejolak.",
    },
    context: "Surah Al-Ma'arij — peringatan bagi mereka yang mengingkari Hari Kiamat.",
    tafsirNote:
      "Terkait dengan nyala yang mengelupas dan membakar — Laza menekankan kobaran yang aktif.",
  },
];

export const JAHANNAM_GATES_ID: DeepPartial<JahannamGateEntry>[] = [
  {
    label: "Pintu Pertama",
    quranNote:
      "Allah menyatakan bahwa Jahannam memiliki tujuh pintu; setiap pintu memiliki bagian tertentu dari mereka yang masuk (15:44).",
    scholarlyNote:
      "Sebagian tafsir belakangan mengaitkan pintu-pintu dengan kategori pendosa. Kaitan-kaitan ini tidak seragam dalam sumber-sumber paling awal — sajikan sebagai tafsiran.",
  },
  {
    label: "Pintu Kedua",
    quranNote:
      "Al-Qur'an secara umum menegaskan tujuh pintu; ia tidak menamai setiap pintu secara eksplisit dalam wahyu.",
    scholarlyNote:
      "Ibnu Katsir menjelaskan bahwa pembagian ini berasal dari hikmah dan keadilan Allah.",
  },
  {
    label: "Pintu Ketiga",
    quranNote:
      "Tujuh pintu — sebuah kenyataan nas yang jelas. Perincian penghuni setiap pintu sebagian besar merupakan pembahasan keilmuan.",
  },
  {
    label: "Pintu Keempat",
    quranNote:
      "Ayat ini menekankan pembagian yang sepadan — setiap pintu memiliki bagiannya sendiri yang telah ditentukan.",
  },
  {
    label: "Pintu Kelima",
    quranNote:
      "Orang-orang beriman diperingatkan agar melalui tobat menjauhi jalan-jalan yang menuju pintu-pintu ini.",
  },
  {
    label: "Pintu Keenam",
    quranNote:
      "Jahannam telah disiapkan — peringatannya nyata. Perlindungan ada pada keimanan dan amal saleh.",
  },
  {
    label: "Pintu Ketujuh",
    quranNote:
      "Tujuh pintu, satu api — kesatuan peringatan dalam keragaman ini tentang bagaimana para pendosa dikelompokkan oleh hikmah ilahi.",
    scholarlyNote:
      "Jangan mengajarkan kaitan pintu tertentu dengan dosa tertentu sebagai kenyataan kenabian tanpa merujuk pada karya keilmuan yang disebutkan namanya.",
  },
];

export const JAHANNAM_VERSES_ID: DeepPartial<JahannamVerseEntry>[] = [
  {
    excerpt: "Takutlah kepada Api yang disediakan bagi orang-orang kafir.",
    context: "Ditujukan kepada orang-orang beriman — rasa takut sebagai pendorong ketaatan.",
    tafsirSummary:
      "Ibnu Katsir: seruan kepada takwa yang dipasangkan dengan ketaatan kepada Rasul.",
  },
  {
    excerpt: "Janganlah berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni semua dosa.",
    context: "Diturunkan untuk menenangkan mereka yang khawatir dosa mereka terlalu besar.",
    tafsirSummary: "Ayat harapan yang mendasar — rahmat begitu luas bagi mereka yang kembali.",
  },
  {
    excerpt:
      "Bertobatlah kepada Allah dengan tobat yang tulus — semoga Rabbmu menghapus keburukan-keburukanmu.",
    context: "Perintah kepada orang-orang beriman setelah panduan tentang keluarga dan akhlak.",
    tafsirSummary:
      "Taubatan nasuha — tobat murni yang tidak diikuti kembalinya seseorang kepada dosa.",
  },
  {
    excerpt: "Bagi semuanya ada derajat sesuai dengan apa yang mereka kerjakan.",
    context: "Keadilan ilahi — pahala dan siksaan sepadan dengan amal.",
    tafsirSummary: "Derajat ini berlaku baik untuk surga maupun neraka.",
  },
  {
    excerpt:
      "Allah sama sekali tidak menzalimi manusia, tetapi manusialah yang menzalimi diri mereka sendiri.",
    context: "Penegasan bahwa keputusan ilahi sepenuhnya adil.",
  },
  {
    excerpt:
      "Wahai Rabb kami, berilah kami kebaikan di kedua alam dan lindungilah kami dari azab Api.",
    context: "Doa mereka yang menggabungkan kebaikan dunia dan akhirat.",
    tafsirSummary: "Doa kenabian yang diajarkan dalam Al-Qur'an — keseimbangan dunia dan akhirat.",
  },
  {
    excerpt: "Jahannam memiliki tujuh pintu; setiap pintu mempunyai bagian yang ditentukan.",
    context: "Disebutkan dalam konteks perdebatan Nabi Ibrahim 'alaihis salam dengan kaumnya.",
    tafsirSummary: "Penyebutan eksplisit tujuh pintu — perincian pembagiannya adalah hikmah ilahi.",
  },
  {
    excerpt:
      "Kecuali mereka yang bertobat, beriman, dan beramal saleh — Allah akan mengganti keburukan dengan kebaikan.",
    context: "Pengecualian setelah daftar dosa-dosa berat.",
    tafsirSummary: "Harapan bagi mereka yang bertobat — amal dapat diganti dengan rahmat.",
  },
  {
    excerpt:
      "Bagi mereka yang mengingkari Rabb mereka adalah azab Jahannam — seburuk-buruk tempat kembali.",
    context: "Surah Al-Mulk — pengingat akan yang gaib.",
  },
  {
    excerpt: "Sesungguhnya kebaikan-kebaikan menghapus keburukan-keburukan.",
    context: "Perintah menegakkan salat di kedua ujung hari.",
    tafsirSummary: "Dorongan bahwa ibadah yang konsisten menghapus kesalahan masa lalu.",
  },
  {
    excerpt: "Wahai Rabb kami, ampunilah dosa-dosa kami dan lindungilah kami dari azab Api.",
    context: "Gambaran tentang orang-orang yang bertakwa (muttaqin).",
  },
  {
    excerpt: "Dan adapun orang yang ringan timbangannya — tempat kembalinya adalah al-Hawiyah.",
    context: "Surah Al-Qari'ah — penimbangan amal.",
  },
];

export const JAHANNAM_HADITH_ID: DeepPartial<JahannamHadithEntry>[] = [
  {
    hadith: {
      excerpt:
        "Siapa yang memohon surga kepada Allah tiga kali, surga berkata: Ya Allah, masukkanlah dia ke dalam surga. Dan siapa yang memohon perlindungan dari Api tiga kali, Api berkata: Ya Allah, lindungilah dia dari Api.",
    },
    context:
      "Dorongan untuk secara rutin berdoa memohon perlindungan dari Jahannam dan memohon Jannah.",
  },
  {
    hadith: {
      excerpt:
        "Allah lebih bergembira dengan tobat hamba-Nya daripada seseorang yang menemukan kembali tunggangannya yang hilang di tanah yang tandus.",
    },
  },
  {
    hadith: {
      excerpt:
        "Tidak seorang pun di antara kalian masuk surga semata-mata karena amalnya — aku pun tidak, kecuali jika Allah menyelimutiku dengan rahmat-Nya.",
    },
    context: "Keseimbangan: berusahalah dalam amal namun bertawakallah pada rahmat.",
  },
  {
    hadith: {
      excerpt:
        "Apimu ini adalah satu dari tujuh puluh bagian Api Jahannam, setiap bagian sepanas apimu ini.",
    },
  },
  {
    hadith: {
      excerpt:
        "Perjanjian antara kami dan mereka adalah salat; siapa yang meninggalkannya, dia telah kafir.",
    },
    context: "Keseriusan mengabaikan salat — salah satu peringatan terberat.",
  },
  {
    hadith: {
      excerpt:
        "Orang yang bangkrut adalah dia yang datang dengan salat, puasa, dan sedekah — namun dia telah mencaci, memfitnah, memakan harta secara batil, dan menumpahkan darah.",
    },
    context:
      "Hak-hak sesama manusia dapat dilunasi pada Hari Kiamat sebelum amal-amal lain diperhitungkan.",
  },
  {
    hadith: {
      excerpt:
        "Allah membentangkan tangan-Nya di malam hari untuk menerima tobat pelaku dosa di siang hari, dan membentangkan tangan-Nya di siang hari untuk menerima tobat pelaku dosa di malam hari.",
    },
  },
  {
    hadith: {
      excerpt:
        "Siapa yang beriman kepada Allah dan Hari Akhir, hendaklah dia berkata baik atau diam.",
    },
    context: "Menjaga lisan — muhasabah harian.",
  },
];

export const JAHANNAM_REFLECTIONS_ID: DeepPartial<JahannamReflectionEntry>[] = [
  {
    question:
      "Apakah hari ini aku telah menzalimi seseorang — lewat perkataan, tindakan, atau kelalaian?",
    appLink: { label: "Jurnal" },
  },
  {
    question:
      "Apakah hari ini aku telah memohon ampunan kepada Allah — dengan tulus dan berulang kali?",
    appLink: { label: "Dzikir dan istighfar" },
  },
  {
    question: "Apakah aku menjaga lisanku dari ghibah, dusta, dan ejekan?",
    appLink: { label: "Dosa-dosa lisan" },
  },
  {
    question: "Apakah aku salat tepat waktu dan dengan kekhusyukan?",
    appLink: { label: "Pelacak Salat" },
  },
  {
    question:
      "Apakah aku melangkah menuju perdamaian dengan seseorang yang hubungannya telah menjauh dariku?",
    appLink: { label: "Mengabaikan hak orang lain" },
  },
  {
    question: "Apakah hari ini aku bersedekah atau berbuat baik — sekecil apa pun itu?",
    appLink: { label: "Perjalanan Menuju Jannah" },
  },
  {
    question: "Apakah hari ini aku membaca atau mendengarkan Al-Qur'an?",
    appLink: { label: "Al-Qur'an" },
  },
];

export const JAHANNAM_REFERENCES_ID: DeepPartial<JahannamReferenceEntry>[] = [
  {
    title: "Al-Qur'an",
    note: "Sumber utama nama-nama, peringatan, rahmat, dan tobat. Terjemahan dapat bervariasi; rujuklah bahasa Arab untuk ketepatan.",
  },
  {
    title: "Sahih al-Bukhari dan Sahih Muslim",
    note: "Kumpulan hadis standar; dikutip dalam modul ini di mana derajat sahih telah ditetapkan.",
  },
  {
    title: "Tafsir Ibnu Katsir",
    note: "Dirujuk untuk konteks nama-nama Jahannam dan ayat-ayat peringatan yang besar — tafsiran keilmuan.",
  },
  {
    title: "Tafsir al-Thabari",
    note: "Tafsir komprehensif paling awal — berguna untuk memahami pandangan klasik tentang Jahannam.",
  },
  {
    title: "Di Mana Ulama Berbeda Pendapat",
    note: "Perincian tingkatan Jahannam, kaitan pintu-pintu, dan makna sebagian nama masih dibahas di kalangan ulama — tidak selalu eksplisit dalam wahyu.",
  },
];

export const JAHANNAM_DUAS_ID: DeepPartial<JahannamDuaEntry>[] = [
  {
    context: "Memohon kebaikan di kedua alam dan perlindungan dari Api — doa dari Al-Qur'an.",
  },
  {
    context: "Setelah tasyahud: memohon perlindungan dari Jannah dan Api.",
  },
  {
    context: "Dzikir pagi: perlindungan dari azab kubur dan azab Api.",
  },
];

export const JAHANNAM_REFUGE_DUA_ID: { translation: string } = {
  translation:
    "Ya Allah, aku berlindung kepada-Mu dari azab Jahannam, dari azab kubur, dari fitnah kehidupan dan kematian, serta dari keburukan fitnah Al-Masih Ad-Dajjal.",
};
