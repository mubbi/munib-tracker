import type {
  SalahGuidePhrase,
  SalahGuideQuizQuestion,
  SalahGuideTopic,
} from "../../types/salah-guide";
import type { DeepPartial } from "./localize";

// Indonesian translation overlay for the Learn Salah content. Mirrors the order of
// SALAH_GUIDE_TOPICS / SALAH_GUIDE_PHRASES in ../salah-guide.ts &
// ../salah-guide-phrases.ts (index-aligned); untranslated entries fall back to
// English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations, grades and the ruling enum stay in English.
// Arabic script fields (arabic/transliteration) are kept from the English source.

export const SALAH_GUIDE_TOPICS_ID: DeepPartial<SalahGuideTopic>[] = [
  {
    title: "Apa itu Salah?",
    summary: "Rukun Islam yang kedua — pertemuan harian Anda dengan Allah.",
    body: [
      "Sholat adalah ibadah formal yang diperintahkan Allah bagi setiap orang beriman: urutan berdiri (qiyam), rukuk (ruku), dan sujud (sujud), digabungkan dengan kata-kata pujian, Al-Qur'an, dan permohonan, yang dilakukan pada lima waktu yang ditentukan setiap hari. Kata salah berasal dari akar bahasa Arab yang berarti hubungan dan permohonan — kata ini merupakan jalur langsung dan tanpa perantara orang beriman kepada Sang Pencipta, tidak memerlukan imam dan perantara.",
      "Satu unit salat yang lengkap - yaitu berdiri hingga sujud kedua - disebut rakaat. Sholat dihitung dalam rakaat: Subuh dua, Maghrib tiga, dan Dhuhur, Ashar, dan Isya empat. Sholat wajib disebut fardhu; Shalat tambahan yang dilakukan secara teratur oleh Nabi ﷺ adalah sunnah, dan shalat sunnah yang dilakukan secara cuma-cuma adalah nafl.",
      "Uniknya di antara rukun-rukun tersebut, salat tidak diturunkan melalui malaikat yang turun ke bumi melainkan diperintahkan langsung kepada Nabi ﷺ ketika beliau diangkat melintasi langit dalam Perjalanan Malam (al-Isra' wa al-Mi'raj). Lima puluh salat ditetapkan terlebih dahulu, kemudian — melalui permohonan Nabi ﷺ yang berulang kali untuk meminta keringanan bagi umatnya — dikurangi menjadi lima dalam pelaksanaan sambil tetap mempertahankan pahala lima puluh.",
      "Inilah sebabnya mengapa salat menjadi pusat kehidupan Islam: diulangi lima kali sehari, salat mengganggu pekerjaan, istirahat, dan waktu senggang untuk kembali memusatkan hati kepada Allah, dan merupakan amalan pertama yang dimintai pertanggungjawaban seorang hamba di Hari Kebangkitan. Jika salatnya baik, amal-amal lainnya pun cenderung baik.",
    ],
    quran: [
      {
        excerpt:
          "Orang-orang yang beriman kepada hal-hal ghaib, mendirikan shalat, dan menafkahkan sebagian rezeki yang Kami berikan kepada mereka.",
      },
      {
        excerpt:
          "Bacalah apa yang diturunkan kepadamu dari Kitab dan dirikanlah shalat. Sesungguhnya shalat menjauhkan diri dari maksiat dan zalim, dan mengingat Allah lebih utama.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Pada Perjalanan Malam Allah memerintahkan lima puluh shalat; Nabi ﷺ terus kembali untuk meminta keringanan sampai tinggal lima — 'Ini lima dan ini lima puluh, karena perkataan di sisi-Ku tidak berubah.' (juga Shahih Muslim 162)",
      },
      {
        excerpt:
          "Hal pertama yang harus dipertanggungjawabkan seorang hamba pada hari kiamat adalah shalatnya; jika sehat, maka amal-amalnya yang lain pun baik. (juga Abu Dawud 864, an-Nasa'i 3991)",
      },
    ],
    appLinks: [
      {
        label: "Perjalanan ke Jannah",
      },
      {
        label: "Pelacak salat",
      },
    ],
  },
  {
    title: "Mengapa Salah?",
    summary: "Buah spiritual, moral, psikologis, dan abadi dari shalat lima waktu.",
    body: [
      "Salah adalah percakapan langsung dengan Allah. Dalam kedudukannya Anda menyapa Dia melalui firman-Nya yang diwahyukan; dalam sujud – sikap kerendahan hati yang tertinggi – Anda paling dekat dengan-Nya dan kemungkinan besar akan dijawab. Tidak ada ibadah lain yang diulangi sesering atau seintim itu.",
      "Buah pertamanya adalah jiwa yang terkendali dan disiplin. Allah sendiri menyatakan bahwa shalat, jika dilakukan dengan benar, akan 'menahan diri dari perbuatan maksiat dan kezaliman' (29:45): orang yang sungguh-sungguh berdiri di hadapan Allah lima kali sehari akan mendapati dosa lebih sulit didekati. Ini juga merupakan penyucian yang berulang-ulang – Nabi ﷺ mengibaratkan shalat lima waktu seperti sungai yang mengalir di mana seseorang mandi lima kali sehari tanpa meninggalkan kotoran.",
      "Buah kedua adalah kedamaian batin. Al-Qur'an berjanji bahwa hati akan mendapat ketenangan dengan mengingat Allah, dan Nabi ﷺ, di saat-saat khawatir, akan berkata, 'Beri kami kenyamanan dengan itu, wahai Bilal,' menyerukan doa. Dia menggambarkan kenikmatan matanya seperti ditempatkan dalam shalat.",
      "Buah sosial dan kekalnya melengkapi gambarannya: shalat berjamaah tingkatkan kaya dan miskin menjadi satu baris dan menjalin persaudaraan, sedangkan menjaga shalat termasuk jalan yang paling pasti menuju ampunan Allah dan menuju surga. Nabi ﷺ menjanjikan surga bagi siapa pun yang memelihara dua shalat 'dingin' yaitu Fajar dan Ashar.",
    ],
    quran: [
      {
        excerpt:
          "Sesungguhnya Akulah Allah. Tidak ada Tuhan selain Aku, maka sembahlah Aku dan dirikanlah shalat untuk mengingat-Ku.",
      },
      {
        excerpt:
          "Sesungguhnya orang-orang yang beriman adalah orang-orang yang khusyuk, yaitu orang-orang yang khusyuk dalam shalatnya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "“Seandainya di depan pintu salah satu kalian ada sungai yang dimandikannya lima kali sehari, apakah masih ada kotoran yang menempel padanya?” Mereka berkata, 'Tidak ada.' Beliau ﷺ berkata, 'Itulah ibarat shalat lima waktu - Allah menghapus dosa dengannya.' (juga Shahih Muslim 667)",
      },
      {
        excerpt:
          "Barangsiapa yang melaksanakan dua shalat yang sejuk – Subuh dan Ashar – maka ia akan masuk surga.",
      },
      {
        excerpt:
          "Yang kucintai dari duniamu adalah wanita-wanita dan wewangian, dan kesejukan mataku ditempatkan pada doaku.",
      },
    ],
    actions: [
      "Berdoalah hanya satu doa penuh tepat waktu hari ini — konsistensi, bukan kesempurnaan, adalah tujuan pertama.",
      "Bacalah makna Al-Fatihah satu kali sebelum salat berikutnya agar Anda merasa terjawab.",
      "Aktifkan pengingat adzan agar tidak ada jendela salat yang terlewatkan tanpa disadari.",
    ],
    appLinks: [
      {
        label: "Pengingat salat",
      },
      {
        label: "Jurnal khushu",
      },
    ],
  },
  {
    title: "Peringkatnya dalam Islam",
    summary: "Sebuah rukun agama — dan perbuatan paling buruk yang harus diabaikan.",
    body: [
      "Nabi ﷺ mengajarkan bahwa Islam dibangun di atas lima rukun, dan shalat adalah rukun kedua, segera setelah dua kesaksian iman. Kesaksian itu memasukkan Anda ke dalam Islam; doa adalah bukti nyata bahwa kesaksian itu hidup di hati Anda. Inilah sebabnya mengapa para ulama menyebut salat sebagai 'rukun agama' - sebuah rumah tanpa pilar utamanya akan runtuh.",
      "Bobotnya terlihat dari bagaimana teks berbicara tentang pengabaian. Al-Qur'an memperingatkan generasi yang 'mengabaikan shalat dan mengejar nafsu' serta meramalkan kehancurannya, dan Nabi ﷺ menggambarkan shalat sebagai perjanjian yang membedakan beriman dan tidak beriman.",
      "Mengenai hukum meninggalkan salat, terdapat perbedaan pendapat yang umum dan terhormat di kalangan ulama Sunni. Beberapa orang berpendapat bahwa dengan sengaja meninggalkannya – meskipun menegaskan bahwa hal itu wajib – merupakan kekafiran besar yang mengeluarkan seseorang dari Islam; mayoritas (Hanafi, Maliki, Syafi'i) berpendapat bahwa orang tersebut tetaplah seorang Muslim yang berdosa dan melakukan salah satu dosa besar yang paling berat, asalkan dia tidak mengingkari kewajibannya. Semua sepakat bahwa meninggalkan shalat adalah malapetaka dan siapa pun yang mengingkari kewajibannya, berarti meninggalkan Islam berdasarkan konsensus.",
      "Hikmah praktisnya sama dalam setiap pandangan: menjalankan salat lima waktu bukanlah suatu pilihan atau hal yang dapat dinegosiasikan bagi seorang mukmin. Sholat sunah (sunnah dan nafl) kemudian menjadi jaring pengaman, menutupi kekurangan sholat wajib di hari kiamat.",
    ],
    quran: [
      {
        excerpt:
          "Peliharalah dengan tekun salat dan salat tengah, serta berdirilah di hadapan Allah dengan penuh ketaatan.",
      },
      {
        excerpt:
          "Namun setelah mereka muncul penerus-penerus yang mengabaikan shalat dan mengejar hawa nafsu; jadi mereka akan bertemu kejahatan.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Islam dibangun atas lima hal: bersaksi bahwa tidak ada Tuhan selain Allah dan bahwa Muhammad adalah Rasul-Nya, mendirikan shalat, menunaikan zakat, haji, dan puasa Ramadhan. (juga Sahih al-Bukhari 8)",
      },
      {
        excerpt:
          "Perjanjian antara kita dan mereka adalah doa; barangsiapa meninggalkannya, ia telah kafir. (Buraydah; juga an-Nasa'i, Ibnu Majah 1079)",
      },
      {
        excerpt:
          "Antara manusia dengan kekafiran dan penyembahan berhala adalah ditinggalkannya shalat. (Jabir)",
      },
    ],
    disclaimer:
      "Para ulama berbeda pendapat mengenai hukum orang yang meninggalkan shalat karena kemalasan (dosa besar bagi mayoritas; kekafiran bagi orang lain) dengan orang yang mengingkari kewajibannya (kafir berdasarkan konsensus). Aplikasi ini tidak mengeluarkan putusan terhadap individu mana pun — konsultasikan dengan pakar yang berkualifikasi untuk kasus pribadi.",
  },
  {
    title: "Siapa yang harus berdoa?",
    summary: "Setiap Muslim dewasa yang waras – dengan pengecualian dan kelonggaran yang jelas.",
    body: [
      "Shalat menjadi wajib bagi setiap muslim yang berakal dan telah baligh (baligh). Tiga kelompok diangkat dari tanggung jawab sepenuhnya dengan prinsip otentik: orang yang tidur sampai dia bangun, anak-anak sampai dia dewasa, dan orang yang tidak mampu mental sampai akal sehat kembali.",
      "Anak-anak belum diwajibkan, namun dilatih secara bertahap. Nabi ﷺ memerintahkan agar anak-anak diperintahkan untuk shalat sejak usia tujuh tahun dan didisiplin dengan lembut karena mengabaikannya pada usia sepuluh tahun — sehingga pada masa puber, shalat sudah menjadi kebiasaan yang menetap, bukan menjadi beban yang tiba-tiba.",
      "Wanita yang sedang haid (hayd) atau nifas (nifas) tidak shalat pada waktu tersebut; salat fardhu yang ditinggalkan tidak diganti sesudahnya, itu rahmat dan hukum yang disepakati para ulama. (Puasa yang ditinggalkan, tidak seperti salat, adalah qadha.) Seorang wanita melanjutkan salat setelah pendarahannya selesai dan dia telah bersuci dengan mandi.",
      "Ketidakmampuan sejati mendatangkan kelonggaran, tidak pernah pembatalan: penyakit yang parah, ketidaksadaran, dan rasa takut yang luar biasa dapat membuat seseorang memaafkan untuk sementara waktu, dan orang yang sakit berdoa sesuai dengan kemampuannya - duduk, berbaring, atau bahkan dengan isyarat. Perjalanan tidak menghilangkan shalat, melainkan memudahkannya melalui pemendekan (qasr) dan penggabungan (jam'), yang tercakup dalam Panduan Perjalanan.",
    ],
    hadith: [
      {
        excerpt:
          "Perintahkanlah anak-anakmu untuk shalat pada usia tujuh tahun, dan disiplinkanlah mereka pada waktu sepuluh tahun, dan pisahkan tempat tidurnya. ('Amr ibn Shu'ayb dari bapaknya dari kakeknya)",
      },
    ],
    quran: [
      {
        excerpt: "Dan ajaklah salat atas keluargamu, dan bersabarlah didalamnya.",
      },
    ],
    appLinks: [
      {
        label: "Panduan haid",
      },
      {
        label: "Salat saat sakit",
      },
      {
        label: "Salat perjalanan",
      },
    ],
  },
  {
    title: "Kondisi sebelum shalat",
    summary: "Sembilan syarat (shurut) yang harus ada agar shalat sah.",
    body: [
      "Sebelum shalat sah, syarat-syarat tertentu (shurut al-salah) harus dipenuhi. Syarat berbeda dengan rukun: syarat adalah prasyarat yang ada sebelum memulai dan berlanjut sepanjang shalat, sedangkan rukun (arkan) adalah bagian dari shalat itu sendiri. Jika syarat wajibnya tidak ada, maka shalatnya tidak diterima, betapapun baik pelaksanaannya.",
      "Anggaplah sembilan hal ini sebagai daftar periksa sebelum penerbangan. Sebagian besar terhubung ke pelajaran yang lebih lengkap di bagian lain dalam panduan ini — ketuk untuk mempelajari masing-masing pelajaran secara mendalam. Dua di antaranya (menghadap kiblat dan waktu yang tepat) dapat dimaafkan karena ketidakmampuannya yang sesungguhnya; sisanya sangat dibutuhkan kapan pun seseorang mampu.",
    ],
    steps: [
      {
        title: "Islam",
        body: "Doa adalah tindakan seorang Muslim; itu tidak sah dari – dan tidak wajib bagi – seorang non-Muslim sampai mereka masuk Islam.",
      },
      {
        title: "Pikiran yang sehat ('aql)",
        body: "Orang tersebut harus berakal sehat. Orang yang kehilangan kewarasannya tidak bertanggung jawab ketika berada dalam keadaan tersebut.",
      },
      {
        title: "Ketajaman (tamyiz)",
        body: "Kemampuan untuk membedakan, dicapai sekitar usia tujuh tahun – usia dimana anak-anak disuruh berdoa.",
      },
      {
        title: "Menghilangkan najis kecil & besar (taharah dari hadath)",
        body: "Wudhu yang sah, atau mandi setelah najis besar, atau tayammum ketika air tidak dapat digunakan.",
      },
      {
        title: "Menghilangkan kotoran (najasah)",
        body: "Badan, pakaian, dan tempat salat harus bebas dari kotoran ritual seperti air seni, darah dalam jumlah banyak, dan zat-zat lain yang disebutkan di atas.",
      },
      {
        title: "Menutupi aurat",
        body: "Bagian yang wajib ditutup ditutup dengan pakaian yang bersih dan tidak tembus pandang — lihat pelajaran Busana & Aurat.",
      },
      {
        title: "Waktu sholat sudah masuk",
        body: "Setiap shalat memiliki jendela yang ditentukan; shalat sebelum waktunya dimulai, tidak sah. Gunakan jadwal dan pengingat Anda.",
      },
      {
        title: "Menghadap kiblat",
        body: "Berpaling ke arah Ka'bah sedekat mungkin - hanya dimaafkan jika memang benar-benar tidak mampu.",
      },
      {
        title: "Niat (niyyah)",
        body: "Putuskan dalam hati doa mana yang akan Anda panjatkan. Ini adalah tindakan batin dan tidak diucapkan dengan suara keras.",
      },
    ],
    disclaimer:
      "Mazhab menyebutkan dan menghitung syarat-syaratnya dengan sedikit berbeda (ada yang mencantumkan niyyah di antara rukun-rukunnya, bukan syarat-syaratnya). Substansinya disepakati.",
    appLinks: [
      {
        label: "Taharah",
      },
      {
        label: "Kompas kiblat",
      },
      {
        label: "Jadwal salat",
      },
    ],
  },
  {
    title: "Pemurnian (Taharah)",
    summary: "Kemurnian diri, pakaian, dan tempat — pintu masuk ke setiap doa.",
    body: [
      "Taharah artinya mengangkat najis agar bisa berdiri di hadapan Allah dalam keadaan bersih. Allah menyukai orang-orang yang bersuci, dan Nabi ﷺ mengajarkan bahwa 'bersuci adalah separuh dari iman.' Tidak ada doa yang diterima tanpanya.",
      "Pengotor ada dua macam. Najis kecil (hadath asghar) — yang disebabkan oleh hal-hal seperti menggunakan toilet atau buang angin — dihilangkan dengan wudhu. Najis besar (hadath akbar atau janabah) — setelah keintiman, ejakulasi, atau berakhirnya menstruasi dan pendarahan pasca melahirkan — dihilangkan dengan mandi ritual lengkap (mandi).",
      "Selain keadaan ritual ini, kotoran yang nyata (najasah) – seperti air seni, kotoran, darah yang mengalir, dan sejenisnya – harus dihilangkan secara fisik dari tubuh, pakaian, dan tempat Anda berdoa. Boleh saja berwudhu sah namun tetap perlu membersihkan noda pada pakaian sebelum shalat.",
      "Air adalah pembersih utama. Ketika air benar-benar tidak tersedia, atau akan membahayakan Anda karena sakit atau pilek yang parah, Islam mengizinkan tayamum – penyucian kering dengan menggunakan tanah bersih – sebagai penggantinya. Pemurnian tidak pernah dimaksudkan sebagai suatu kesulitan; itu adalah sarana untuk mendekat.",
    ],
    hadith: [
      {
        excerpt: "Bersuci adalah separuh dari iman… (Abu Malik al-Ash'ari)",
      },
    ],
    quran: [
      {
        excerpt:
          "Sesungguhnya Allah menyukai orang-orang yang bertaubat dan menyukai orang-orang yang bersuci.",
      },
    ],
    actions: [
      "Pelajari wudhu selangkah demi selangkah sebelum shalat berikutnya agar setiap anggota tubuh terbasuh dengan benar.",
      "Simpanlah pakaian bersih yang dikhususkan untuk sembahyang jika Anda bekerja di lingkungan yang kotor.",
      "Lihatlah ke tempat salat Anda untuk mencari kotoran yang terlihat sebelum meletakkan matras.",
    ],
    appLinks: [
      {
        label: "Panduan taharah lengkap",
      },
      {
        label: "Pelajaran wudhu",
      },
    ],
  },
  {
    title: "Wudu — wudhu",
    summary: "Pencucian teratur yang mengangkat kotoran kecil dan mempersiapkan Anda untuk berdoa.",
    body: [
      "Wudhu adalah ritual mencuci yang mengangkat najis kecil. Wajib dilakukan sebelum setiap salat kecuali Anda masih dalam keadaan sah dari salat sebelumnya, dan — menurut mayoritas ulama — sebelum menyentuh teks fisik Al-Qur'an. Empat wudhu wajibnya disebutkan langsung dalam Al-Qur'an (5:6): wajah, lengan hingga siku, mengusap kepala, dan kaki hingga mata kaki.",
      "Nabi ﷺ melakukan wudhu secara tetap, tiga kali untuk membasuh anggota tubuh, secara menyeluruh tetapi tanpa membuang-buang air – beliau memperingatkan agar tidak berlebihan bahkan di sungai yang mengalir. Di luar empat kewajiban tersebut, berkumur-kumur, mencuci tangan terlebih dahulu, dan menggunakan siwak merupakan sunnah-sunnah yang menyempurnakan dan memperindah wudhu.",
      "Pahalanya sangat besar: Nabi ﷺ mengajarkan bahwa sebagaimana seorang mukmin membasuh setiap anggota tubuh, maka dosa-dosa yang dilakukan oleh anggota tubuh tersebut akan hilang bersama air – bahkan dari bawah kukunya – sehingga ia menjadi bersih. Oleh karena itu, wudhu bukan hanya sekedar formalitas tetapi merupakan tindakan kecil memaafkan sebelum setiap shalat.",
      "Batalnya wudhu dengan keluarnya apa pun (air kencing, feses, angin), tidur nyenyak yang menghilangkan kesadaran, dan hilangnya kesadaran. Jika rusak saat salat, maka harus berhenti, memperbaharui wudhu, dan memulai salat lagi.",
    ],
    steps: [
      {
        title: "Niat & Bismillah",
        body: "Niatkan wudhu dalam hati dan awali dengan 'Bismillah'. Niatnya ada di dalam diri dan tidak perlu disuarakan.",
        tip: "Gunakan siwak (siwak) sebelumnya jika Anda bisa — sebuah sunnah yang disukai Nabi ﷺ dan hampir diwajibkan.",
      },
      {
        title: "Cuci tangan",
        body: "Basuhlah kedua tangan hingga pergelangan sebanyak tiga kali, usap air di sela-sela jari.",
      },
      {
        title: "Bilas mulut",
        body: "Ambil air ke dalam mulut, putar, dan keluarkan — tiga kali.",
      },
      {
        title: "Bilas hidung",
        body: "Tarik air ke dalam lubang hidung dengan tangan kanan dan keluarkan dengan tangan kiri — tiga kali.",
      },
      {
        title: "Cuci muka (fardhu)",
        body: "Cuci seluruh wajah satu sampai tiga kali, dari garis rambut ke dagu dan dari telinga ke telinga; seorang pria mengusap janggutnya yang tebal dengan jari-jarinya yang basah.",
      },
      {
        title: "Mencuci lengan (fardhu)",
        body: "Basuh lengan kanan, lalu kiri, dari ujung jari hingga dan termasuk siku – masing-masing tiga kali.",
      },
      {
        title: "Usap kepala (fardhu)",
        body: "Dengan tangan basah, usap kepala satu kali dari depan ke belakang dan ke belakang lagi, lalu usap bagian dalam dan belakang telinga dengan basah yang sama.",
      },
      {
        title: "Membasuh kaki (fardhu)",
        body: "Basuhlah kaki kanan, lalu kaki kiri, hingga dan termasuk mata kaki – masing-masing tiga kali, dengan memasukkan jari ke sela-sela jari kaki.",
      },
      {
        title: "Kesaksian iman",
        body: "Lengkap dengan doa: 'Asyhadu an la ilaha illallah…' — delapan pintu surga terbuka bagi siapa pun yang mengucapkannya setelah wudhu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ketika seorang hamba membasuh mukanya saat berwudhu, segala dosa yang dilihatnya dengan matanya akan hilang bersama air… hingga ia bersih dari dosa.",
      },
    ],
    quran: [
      {
        excerpt:
          "Wahai orang-orang yang beriman, ketika bangun salat, basuhlah mukamu dan lenganmu sampai siku, usap kepalamu, dan basuhlah kakimu sampai mata kaki.",
      },
    ],
    actions: [
      "Lakukan wudhu secara perlahan sebanyak satu kali sambil membaca setiap langkah dengan suara keras, memeriksa siku dan tumit.",
      "Hafalkan doa singkat setelah wudhu — lihat Kata-kata Shalat.",
    ],
    appLinks: [
      {
        label: "Wudhu & doa terkait",
      },
      {
        label: "Kata-kata salat",
      },
    ],
  },
  {
    title: "Tayammum — dry purification",
    summary: "When water cannot be used, clean earth lifts impurity so prayer is not delayed.",
    body: [
      "Tayammum is the dry purification Allah legislated when water is genuinely unavailable, or when using it would cause harm because of illness or severe cold. It is not a lesser workaround for convenience — it is a complete substitute that lifts minor or major impurity for prayer until water can be used again.",
      "The Qur'an names it in the same verse as wudu and ghusl (5:6): wipe the face and hands with clean earth after striking it. The Prophet ﷺ taught the companions this concession as mercy, not as a loophole to skip searching for water when it is reasonably available.",
      "Practically: intend tayammum, say Bismillah, strike clean earth once (or twice according to some schools), wipe the face, then wipe the hands to the wrists (many scholars include up to the elbows in continuity with wudu). What breaks wudu or ghusl also ends the corresponding tayammum; finding usable water ends the concession and you return to ordinary purification.",
      "If you prayed validly with tayammum and only found water afterward, the majority hold that the completed prayer need not be repeated. If water appears before you pray, you must use it. For casts, wounds, and illness, combine wiping over dressings with tayammum as your school and doctor advise — see the full Taharah guide for detail.",
    ],
    steps: [
      {
        title: "Confirm the need",
        body: "Search reasonably for usable water, or confirm that using water would harm you (illness, severe cold, medical advice).",
      },
      {
        title: "Intention & Bismillah",
        body: "Intend tayammum in place of wudu or ghusl, and begin with Bismillah.",
        transliteration: "Bismillah",
      },
      {
        title: "Strike clean earth",
        body: "Strike clean earth (or a clean dusty surface) with both hands once — some schools strike twice.",
      },
      {
        title: "Wipe the face",
        body: "Wipe the entire face with the dust remaining on the hands.",
      },
      {
        title: "Wipe the hands",
        body: "Wipe the hands — at minimum to the wrists; many scholars wipe to the elbows.",
      },
    ],
    quran: [
      {
        excerpt:
          "…and you find no water, then perform tayammum with clean earth and wipe your faces and your hands with it.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Reported in the chapters of tayammum: the concession to purify with clean earth in the absence of usable water.",
      },
    ],
    actions: [
      "Know when tayammum applies before travel or illness so prayer is never skipped for lack of water.",
      "Open the full Taharah tayammum lessons for school differences on striking and wiping.",
    ],
    disclaimer:
      "Schools differ on details (one strike vs two, wrists vs elbows, renewing per prayer). This is a mainstream educational summary — follow reliable local scholarship for your practice.",
  },
  {
    title: "Pakaian & aurat",
    summary: "Tutupi apa yang harus ditutupi – dengan bersih, sopan, dan penuh hormat.",
    body: [
      "Menutup aurat – bagian tubuh yang wajib disembunyikan – merupakan syarat sahnya shalat, yang diambil dari perintah Allah untuk 'bawalah perhiasanmu di setiap tempat shalat' (7:31). Pakaian tersebut harus bersih dari najasah dan cukup buram sehingga warna kulit tidak terlihat.",
      "Bagi laki-laki, aurat dalam shalat minimal dari pusar hingga lutut. Akan tetapi, shalat dengan bertelanjang dada ketika pakaian tersedia tidak disukai; Nabi ﷺ berpesan bahwa seorang laki-laki tidak boleh shalat dengan satu pakaian tanpa ada bagian di bahunya.",
      "Bagi wanita, seluruh tubuh adalah aurat dalam shalat kecuali wajah dan tangan, menurut mayoritas ulama; seorang wanita menutupi rambut, leher, dan kakinya, biasanya dengan pakaian longgar dan jilbab. Para ulama berbeda pendapat mengenai kaki, beberapa menganggap kaki termasuk dalam apa yang diperlihatkan — shalat dengan kaki tertutup adalah amalan yang paling aman dan mayoritas.",
      "Dua aturan berpakaian juga berlaku di luar salat: sutra dan emas dilarang dipakai oleh laki-laki (dibolehkan bagi wanita), dan pakaian tidak boleh terlalu ketat, tipis, atau menarik perhatian sehingga mengalahkan kesopanan dalam salat. Sebagai aturan praktisnya, berdoalah dengan mengenakan apa yang akan Anda kenakan untuk bertemu seseorang yang Anda hormati – bukan pakaian tidur atau pakaian pantai.",
    ],
    quran: [
      {
        excerpt: "Wahai anak Adam, bawalah perhiasanmu di setiap tempat shalat.",
      },
    ],
    actions: [
      "Sisihkan satu pakaian yang bersih dan sederhana atau pakaian salat khusus agar Anda selalu siap.",
      "Jika tidak yakin apakah sesuatu cukup menutupi, tutupi lebih banyak, bukan lebih sedikit.",
    ],
    disclaimer:
      "Detail aurat (khususnya kaki wanita) menjadi titik perbedaan keilmuan yang saling menghormati. Ikuti beasiswa lokal yang dapat diandalkan di mana pun Anda berbeda.",
  },
  {
    title: "Waktu sholat",
    summary: "Lima jendela harian — setiap shalat memiliki awal, akhir, dan momen yang diinginkan.",
    body: [
      "Allah menetapkan shalat 'pada waktu-waktu tertentu' (4:103), membagi siang dan malam menjadi lima jendela yang diikatkan pada pergerakan matahari. Sholat sebelum jendela terbuka tidak sah; menunda shalat melewati jendelanya tanpa alasan adalah dosa besar. Kapan pun memungkinkan, salatlah lebih awal di jendela — Nabi ﷺ menyebut salat pertama kali di antara amalan yang paling dicintai Allah.",
      "Lima jendela tersebut adalah: Subuh, dari terbitnya fajar hingga terbitnya matahari; Dhuhr, dari matahari melewati puncaknya sampai bayangan suatu benda sama dengan panjangnya; Asar, dari akhir Dhuhur hingga terbenamnya matahari (sebaiknya shalat sebelum matahari menguning); Maghrib, sejak terbenamnya matahari hingga senja merah memudar; dan Isya, dari senja hingga fajar yang sebenarnya (sebaiknya shalat sebelum tengah malam).",
      "Ada tiga periode singkat yang diharamkan salat sunah, sehingga ibadah tidak boleh disamakan dengan ibadah matahari: saat matahari terbit hingga terbit sempurna, saat matahari tepat berada di puncaknya pada tengah hari, dan saat terbenam hingga terbenam sepenuhnya. Mengqadha shalat fardhu dikecualikan dari larangan ini.",
      "Waktu jam yang tepat berubah setiap hari sesuai garis lintang dan musim, itulah sebabnya Nabi ﷺ mengaitkannya dengan tanda-tanda alam, bukan jam yang tetap. Aplikasi ini menghitungnya untuk lokasi Anda — namun mengetahui tanda-tanda yang mendasarinya membuat Anda tetap terhubung ketika teknologi tidak tersedia.",
    ],
    steps: [
      {
        title: "Subuh — 2 rakaat fardhu",
        body: "Fajar sejati hingga matahari terbit. Diawali dengan sunnah 2 rakaat yang sangat ditekankan.",
      },
      {
        title: "Dhuhur — fardhu 4 rakaat",
        body: "Setelah matahari melewati puncaknya hingga bayangan Ashar. Sunnah 4 sebelum dan 2 sesudahnya.",
      },
      {
        title: "Asar — ​​fardhu 4 rakaat",
        body: "Dari akhir Dhuhur hingga terbenamnya matahari; berdoalah sebelum matahari menguning. Sering diidentikkan dengan 'sholat tengah' Surat 2:238.",
      },
      {
        title: "Maghrib — fardhu 3 rakaat",
        body: "Dari matahari terbenam hingga senja memudar; segera berdoa. Sunnah ke 2 setelahnya.",
      },
      {
        title: "Isya — fardhu 4 rakaat",
        body: "Dari memudarnya senja hingga fajar; sebaiknya sebelum tengah malam. Dilanjutkan oleh Witr.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ada tiga waktu yang Nabi ﷺ larang kita salat: ketika matahari terbit hingga terbit, ketika matahari berdiri di tengah hari, dan ketika matahari terbenam hingga terbenam. (Uqbah bin 'Amir)",
      },
    ],
    quran: [
      {
        excerpt:
          "Sesungguhnya shalat telah diwajibkan atas orang-orang mukmin dengan ketetapan waktu-waktu tertentu.",
      },
      {
        excerpt:
          "Dan dirikanlah shalat pada kedua ujung siang dan menjelang malam. Sesungguhnya amal shaleh akan mengusir perbuatan keburukan.",
      },
    ],
    disclaimer:
      "Awal Asar ada dua pendapat yang dilaporkan (bayangan sama dengan, atau dua kali, panjang suatu benda). Keduanya sah; ikuti perhitungan lokal dan komunitas Anda.",
    appLinks: [
      {
        label: "Jadwal salat",
      },
      {
        label: "Pengaturan pengingat",
      },
    ],
  },
  {
    title: "Menghadap kiblat",
    summary: "Beralih ke Rumah Suci di Makkah – arah yang mempersatukan umat.",
    body: [
      "Kiblat adalah arah Ka'bah di dalam Masjid al-Haram di Makkah. Menghadapinya adalah syarat sahnya shalat. Pada awal Islam, kaum Muslim berdoa menghadap Yerusalem; kemudian Allah menurunkan perintah untuk menghadap Masjidil Haram, dan satu arah telah menyatukan para jamaah sedunia sejak saat itu — sebuah ekspresi fisik sehari-hari dari satu komunitas yang menghadap satu Tuhan.",
      "Anda diharuskan menghadap kiblat seakurat mungkin — dengan kompas, mihrab masjid, aplikasi yang dapat diandalkan, atau matahari dan bintang saat bepergian. Penyimpangan kecil yang tidak dapat dihindari dimaafkan; yang penting adalah upaya tulus menuju arah yang benar.",
      "Jika Anda benar-benar tidak dapat menentukan arah — tersesat di laut, di awan, di daratan asing pada malam hari — Anda berusaha untuk menentukan arah dan kemudian berdoa untuk mendapatkan penilaian terbaik Anda; shalatnya sah meskipun kemudian terbukti sedikit melenceng. Dalam kendaraan atau pesawat terbang yang tidak memungkinkan menghadap kiblat untuk salat fardhu, maka hadapilah semampumu, karena Allah tidak akan membebani jiwa melebihi kesanggupannya.",
    ],
    quran: [
      {
        excerpt:
          "Jadi arahkan wajahmu ke arah Masjidil Haram. Dan dimanapun kamu berada, arahkanlah wajahmu ke arahnya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ketika bangun salat, berwudhu dengan baik, lalu menghadap kiblat dan mengucapkan takbir. (dari hadits orang yang shalatnya jelek)",
      },
    ],
    appLinks: [
      {
        label: "Kompas kiblat",
      },
    ],
  },
  {
    title: "Adzan — adzan",
    summary: "Kata-kata yang menyemangati ummat, maknanya, dan cara menjawabnya.",
    body: [
      "Adzan adalah panggilan yang memberitahukan bahwa waktu shalat telah masuk. Merupakan sunah berjamaah untuk salat lima waktu (bukan salat Idul Fitri atau salat jenazah), yang diberikan dari tempat yang ditinggikan sehingga masyarakat berkumpul untuk beribadah. Diikuti, tepat sebelum salat dimulai, dengan seruan kedua yang lebih singkat, yakni iqamah.",
      "Ketika mendengar adzan, sunnahnya adalah mengulangi setiap kalimat setelah mu'adhdhin — kecuali pada 'Hayya 'ala as-salah' dan 'Hayya 'ala al-falah', di mana Anda malah mengucapkan 'La hawla wa la quwwata illa billah' (tidak ada daya dan kekuatan kecuali dengan izin Allah). Pada adzan Subuh, penelepon menambahkan 'As-salatu khayrun min an-nawm' (sholat lebih baik dari tidur).",
      "Setelah adzan selesai, pancarkan shalawat (shalawat) kepada Nabi ﷺ, kemudian ucapkan do'a yang telah ditetapkan memohon kepada Allah untuk memberinya maqam terpuji (al-wasilah) — Nabi ﷺ menjanjikan syafaatnya kepada siapa pun yang mengucapkannya. Momen antara adzan dan iqamah adalah saat dimana doa tidak ditolak, maka doakanlah dengan leluasa.",
    ],
    steps: [
      {
        title: "Allahu Akbar (×4)",
        body: "Allah Maha Besar — ​​lebih besar dari apa pun yang mungkin mengalihkan perhatian Anda.",
      },
      {
        title: "Asyhadu an la ilaha illallah (×2)",
        body: "Saya bersaksi bahwa tidak ada Tuhan selain Allah.",
      },
      {
        title: "Ashhadu anna Muhammadan rasulullah (×2)",
        body: "Saya bersaksi bahwa Muhammad adalah Utusan Allah.",
      },
      {
        title: "Hayya 'ala as-salah (×2)",
        body: "Datanglah untuk berdoa. Jawabannya adalah: La hawla wa la quwwata illa billah.",
      },
      {
        title: "Hayya 'ala al-falah (×2)",
        body: "Datanglah ke kesuksesan. Jawabannya adalah: La hawla wa la quwwata illa billah.",
      },
      {
        title: "Allahu Akbar (×2)",
        body: "Allah Maha Besar.",
      },
      {
        title: "La ilaha illallah",
        body: "Tidak ada Tuhan selain Allah – seruan itu ditutup dengan kata yang sama yang ditujunya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Barang siapa yang mendengar seruan, 'Ya Allah, Tuhan atas seruan yang sempurna dan shalat yang rukun, berilah Muhammad wasilah dan keutamaan...', maka syafaatku akan menjadi miliknya pada Hari Kebangkitan. (Jabir)",
      },
    ],
    appLinks: [
      {
        label: "Dengarkan adzan",
      },
      {
        label: "Adzan & doa salat",
      },
    ],
  },
  {
    title: "Salah langkah demi langkah",
    summary: "Urutan lengkap rakaat — setiap kalimat yang dibacakan, dengan hukumnya.",
    body: [
      "Setiap shalat dibangun dari satu unit pengulangan — rakaat: berdiri dan membaca, rukuk, bangun, sujud dua kali, dan (di akhir shalat) duduk untuk tashahhud dan mengucapkan salam. Pelajari satu rakaat dengan baik dan Anda dapat shalat apa saja, karena shalat yang lebih panjang cukup mengulangi satuan ini. Langkah-langkah di bawah ini memberikan setiap tindakan secara berurutan, kata-kata yang tepat untuk diucapkan dalam bahasa Arab beserta artinya, dan label kecil yang menunjukkan apakah tindakan tersebut merupakan pilar, tindakan yang diwajibkan, atau tindakan yang direkomendasikan.",
      "Para ulama mengurutkan amalan salat menjadi tiga tingkatan. Fardhu (rukun / rukn) itu penting: jika dibiarkan - bahkan karena kesalahan - maka shalat, atau rakaat itu, tidak sah sampai dilakukan. Wajib (wajib) adalah wajib, tetapi jika Anda lupa, Anda memperbaiki shalatnya dengan sujud sahw (sujud as-sahw) daripada mengulanginya. Sunnah itu dianjurkan dan pahalanya, dan shalatnya lengkap dan sah tanpanya. Ketika mazhab fiqh menempatkan suatu tindakan dalam kategori yang berbeda, tipsnya mencatatnya – batasan tiga kali lipat ini sendiri merupakan salah satu bidang klasik perbedaan keilmuan.",
      "Secara keseluruhan, satu kualitas yang tidak boleh hilang adalah tuma'ninah - keheningan: menetap sepenuhnya pada setiap postur, dengan anggota tubuh dalam keadaan istirahat, sebelum melanjutkan. Nabi ﷺ mengutus kembali seorang laki-laki yang tadinya salat tergesa-gesa untuk salat lagi sebanyak tiga waktu, seraya bersabda, 'Kembalilah salat, karena kamu belum salat,' lalu mengajarkannya untuk tetap tenang dalam setiap posisi. Bergerak di antara postur dengan takbir 'Allahu Akbar', dan arahkan pandangan Anda ke tempat sujud.",
      "Berapa rakaat, dan di mana Anda duduk: shalat dua rakaat (Fajr, dan Jumu'ah) memiliki satu kali duduk — tashahhud terakhir setelah rakaat kedua — lalu salam. Sholat tiga rakaat (Maghrib) dan sholat empat rakaat (Dhuhur, Asr, Isya) duduk untuk tashahhud pertama yang lebih pendek setelah rakaat kedua, kemudian berdiri untuk rakaat yang tersisa — hanya membaca Al-Fatihah di dalamnya, tanpa tambahan surah — dan duduk kembali untuk tashahhud dan salam terakhir.",
      "Dengan suara keras atau diam: Al-Fatihah dan surah dibacakan dengan suara keras (jahri) pada waktu Subuh, Jumu'ah, dan dua rakaat pertama Maghrib dan Isya; dibacakan dalam hati (sirri) pada waktu Dhuhur dan Asar, pada rakaat ketiga Maghrib, dan pada rakaat ketiga dan keempat Isya. Setiap kalimat doa lainnya – tasbih ruku dan sujud, tashahhud, dan seterusnya – diucapkan dengan pelan. Seseorang yang berdoa sendirian mungkin melafalkannya dengan suara keras atau dengan suara pelan; seorang pengikut di belakang imam hanya mendengarkan sementara imam membacakan dengan suara keras.",
      "Beberapa tambahan berkaitan dengan doa atau momen tertentu. Dalam shalat Witir banyak yang membaca Qunut di rakaat terakhir — mengangkat tangan untuk memohon bimbingan dan perlindungan (kata-kata terkenal dimulai dengan 'Allahumma-hdini fiman hadayt…'). Di masa-masa sulit, Qunut an-Nazilah dapat ditambahkan ke dalam shalat wajib, dan madzhab berbeda pendapat mengenai Qunut berdiri di waktu Subuh. Jika Anda terlambat bergabung dengan jamaah (masbuq), apa pun yang Anda tangkap dengan imam dihitung, dan Anda mengqadha rakaat yang Anda lewatkan setelah salamnya. Dan jika Anda tidak sengaja menambah atau menghilangkan sesuatu, lihatlah panduan sujud as-sahw.",
    ],
    steps: [
      {
        title: "1. Niat & pendirian (niyyah & qiyam)",
        body: "Menghadap kiblat dan berdiri tegak, berdiri adalah rukun shalat wajib bagi siapa saja yang mampu. Tentukan dalam hati doa spesifik apa yang hendak Anda panjatkan; niatnya adalah tekad batin, bukan kalimat yang diucapkan dengan lantang.",
        ruling: "fard",
        tip: "Arahkan pandanganmu pada tempat sujud dan pertahankan di sana. Siapa pun yang benar-benar tidak tahan, shalatnya sambil duduk, lalu berbaring - shalatnya sendiri tidak pernah dibatalkan.",
      },
      {
        title: "2. Pembukaan takbir (Takbirat al-Ihram)",
        body: "Angkat tangan hingga ke bahu atau daun telinga dan ucapkan takbir, lalu letakkan tangan kanan di atas tangan kiri di dada. Dengan ini shalat dimulai, dan ucapan serta gerakan biasa sekarang dilarang sampai salam.",
        translation: "Allah Maha Besar.",
        ruling: "fard",
        tip: "Mengangkat tangan (raf’ al-yadayn) dengan takbir adalah sunnah yang sah, bukan rukun.",
      },
      {
        title: "3. Doa pembuka (Doa al-Istiftah)",
        body: "Ucapkan dengan tenang doa pembuka singkat untuk menenangkan hati sebelum firman Allah. Beberapa kata-kata otentik dilaporkan; ini adalah salah satu yang paling umum.",
        translation:
          "Maha Suci Engkau ya Allah dan puji syukur. Terberkatilah nama-Mu dan maha agung Yang Mulia. Tidak ada Tuhan selain Engkau.",
        ruling: "sunnah",
      },
      {
        title: "4. Ta'awwudh & Basmalah",
        body: "Berlindung kepada Allah dari setan, kemudian diawali dengan Basmalah, sebelum Al-Fatihah. Keduanya diucapkan dengan pelan, bahkan dalam doa yang bersuara.",
        translation:
          "Aku berlindung kepada Allah dari setan yang terkutuk. Dengan menyebut nama Allah Yang Maha Penyayang lagi Maha Penyayang.",
        ruling: "sunnah",
      },
      {
        title: "5. Membaca Al-Fatihah",
        body: "Bacalah Pembukaan Kitab di setiap rakaat — 'Tidak ada doa bagi orang yang tidak membaca Pembukaan Kitab.' Imam dan jamaah yang sendirian melafalkannya dengan lantang dalam doa yang nyaring; jika tidak, itu dibacakan dengan tenang.",
        translation:
          "Dengan menyebut nama Allah Yang Maha Penyayang lagi Maha Penyayang. Segala puji bagi Allah, Tuhan semesta alam, Yang Maha Penyayang, Yang Maha Penyayang, Yang Berdaulat pada Hari Pembalasan. Engkaulah yang kami sembah dan Engkaulah yang kami mohon pertolongan. Bimbinglah kami ke jalan yang lurus, yaitu jalan orang-orang yang Engkau beri nikmat, bukan jalan orang-orang yang mudah marah atau orang-orang yang sesat.",
        ruling: "fard",
        tip: "Ucapkan 'Ameen' setelahnya (dengan lantang dalam doa yang bersuara). Golongan Hanafi membacakan sebagian Al-Qur'an sebagai rukun dan Al-Fatihah khusus sebagai wajib; mayoritas berpendapat Al-Fatihah sendiri merupakan rukun dalam setiap rakaat.",
      },
      {
        title: "6. Bacalah satu surah atau beberapa ayat",
        body: "Pada dua rakaat pertama saja, ikuti Al-Fatihah dengan surah pendek atau beberapa ayat — misalnya Surah Al-Ikhlas ('Qul huwa Allahu ahad…'). Pada rakaat ketiga dan keempat membaca Al-Fatihah saja.",
        ruling: "sunnah",
        tip: "Direkomendasikan untuk jamaah tunggal dan imam; seorang pengikut mendengarkan. Hanafi berpendapat bahwa menambahkan satu surah pada dua rakaat pertama adalah wajib.",
      },
      {
        title: "7. Membungkuk (ruku)",
        body: "Ucapkan 'Allahu Akbar' dan rukuk dengan punggung rata, tangan mencengkeram lutut, dan mengagungkan Tuhanmu tiga kali atau lebih, tanpa tergesa-gesa.",
        translation: "Maha Suci Tuhanku Yang Maha Agung.",
        ruling: "fard",
        tip: "Busur itu sendiri, yang dipegang dengan tenang, adalah pilarnya; tasbih yang dibacakan di dalamnya adalah sunnah (wajib di beberapa sekolah).",
      },
      {
        title: "8. Bangkit dari ruku (i'tidal)",
        body: "Bangkitlah dengan tegak – imam dan jamaah yang sendirian mengucapkan tasmi', dan semua orang mengucapkan tahmid – dan berdiri diam sebelum turun.",
        translation:
          "Allah mendengar siapa pun yang memuji-Nya. Ya Tuhan kami, hanya milikMu segala puji.",
        ruling: "fard",
        tip: "Berdiri kembali tegak dan tenang adalah sebuah pilar – jangan tenggelam dalam sujud sampai Anda menetap di sini.",
      },
      {
        title: "9. Sujud (sujud)",
        body: "Ucapkan 'Allahu Akbar' dan sujud dengan tujuh tulang - dahi dan hidung, kedua telapak tangan, kedua lutut, dan kedua jari kaki - mengagungkan Yang Maha Tinggi sebanyak tiga kali atau lebih. Ini adalah sikap yang paling dekat dengan Allah, maka panjatkanlah doa setelah tasbih.",
        translation: "Maha Suci Tuhanku Yang Maha Tinggi.",
        ruling: "fard",
        tip: "Jaga agar lengan bawah terangkat dari lantai dan menjauhi samping, dan perut dari paha.",
      },
      {
        title: "10. Duduk di antara dua sujud (jalsah)",
        body: "Bangkitlah dari sujud pertama sambil mengucapkan 'Allahu Akbar', duduklah dengan tenang dan tegak, dan mohon ampun kepada Tuhanmu sebelum sujud kembali.",
        translation: "Tuhanku, maafkan aku.",
        ruling: "fard",
        tip: "Duduklah sampai Anda merasa nyaman - duduk singkat ini, dengan keheningan, merupakan pilar tersendiri.",
      },
      {
        title: "11. Sujud kedua",
        body: "Ucapkan 'Allahu Akbar' dan sujud untuk kedua kalinya persis seperti yang pertama, dengan tasbih yang sama dan keheningan yang sama. Ini menyelesaikan satu rakaat penuh.",
        translation: "Maha Suci Tuhanku Yang Maha Tinggi.",
        ruling: "fard",
      },
      {
        title: "12. Berdiri untuk rakaat berikutnya",
        body: "Ucapkan 'Allahu Akbar' lalu bangkit berdiri, lalu ulangi dari Al-Fatihah. Pada rakaat ketiga dan keempat hanya membaca Al-Fatihah saja, tanpa tambahan surah.",
        ruling: "fard",
        tip: "Dalam shalat dua rakaat, Anda tidak berdiri lagi setelah rakaat kedua — Anda tetap duduk untuk tashahhud terakhir.",
      },
      {
        title: "13. Tashahhud pertama (dalam shalat 3 dan 4 rakaat)",
        body: "Setelah rakaat kedua Maghrib, Dhuhur, Ashar, atau Isya, duduk dan membaca At-Tahiyyat, lalu berdiri untuk rakaat yang tersisa. Sholat dua rakaat tidak ada tashahhud pertamanya.",
        translation:
          "Segala salam, doa, dan kata-kata yang murni hanya untuk Allah. Salam sejahtera bagimu wahai Nabi, dan rahmat Allah dan berkah-Nya. Salam sejahtera bagi kami dan hamba-hamba Allah yang shaleh. Aku bersaksi bahwa tidak ada Tuhan selain Allah, dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya.",
        ruling: "wajib",
        tip: "Angkat jari telunjuk kanan sambil duduk. Jika Anda lupa tashahhud pertama dan sudah mulai berdiri, lanjutkan dan lakukan sujud as-sahw sebelum salam — jangan duduk kembali.",
      },
      {
        title: "14. Tasyahhud terakhir",
        body: "Pada setiap duduk terakhir shalat, bacalah At-Tahiyyat yang sama seperti yang ditunjukkan di atas. Duduk untuk tashahhud terakhir dan membacanya adalah rukun shalat.",
        ruling: "fard",
      },
      {
        title: "15. Sampaikan shalawat kepada Nabi ﷺ (Salawat)",
        body: "Setelah At-Tahiyyat terakhir, kirimkan shalawat kepada Nabi ﷺ dengan kata-kata yang dia sendiri ajarkan kepada para Sahabatnya.",
        translation:
          "Ya Allah, kirimkan shalawat kepada Muhammad dan keluarga Muhammad, sebagaimana Engkau memberkati Ibrahim dan keluarga Ibrahim; sesungguhnya Engkau Maha Terpuji lagi Maha Mulia. Ya Allah, limpahkan nikmat kepada Muhammad dan keluarga Muhammad, sebagaimana Engkau menyayangi Ibrahim dan keluarga Ibrahim; sesungguhnya Engkau Maha Terpuji lagi Maha Mulia.",
        ruling: "sunnah",
        tip: "Mazhab Syafi'i dan Hanbali menganggap shalawat pada duduk terakhir itu wajib.",
      },
      {
        title: "16. Berdoa sebelum salam",
        body: "Sebelum mengakhiri, mohon perlindungan kepada Allah dari empat cobaan — lalu doakan apa pun yang Anda inginkan, untuk kehidupan ini dan akhirat, dalam bahasa Arab atau bahasa Anda sendiri.",
        translation:
          "Ya Allah, aku berlindung kepada-Mu dari siksa kubur, dari siksa Neraka, dari cobaan hidup dan mati, dan dari keburukan cobaan al-Masih Palsu (Dajjal).",
        ruling: "sunnah",
      },
      {
        title: "17. Salam Penutup (Taslim)",
        body: "Akhiri shalat dengan menghadapkan wajah ke kanan, lalu ke kiri, sambil mengucap salam damai. Dengan salam maka selesailah shalat.",
        translation: "Damai dan rahmat Allah besertamu.",
        ruling: "fard",
        tip: "Taslim pertama (di sebelah kanan) adalah tiang; yang kedua (ke kiri) adalah sunnah di beberapa sekolah.",
      },
    ],
    hadith: [
      {
        excerpt: "Berdoalah sebagaimana Anda melihat saya berdoa. (Malik bin al-Huwayrits)",
      },
      {
        excerpt:
          "'Kembalilah dan salatlah, karena kamu belum salat'—diulang tiga kali—lalu beliau ﷺ mengajarkan: ucapkan takbir, bacalah Al-Qur'an semampumu, kemudian ruku’ hingga engkau merasa tenteram, bangkit hingga engkau berdiri tegak, sujud hingga engkau merasa tenteram… ​​(orang yang shalatnya buruk; juga Sahih Muslim 397)",
      },
      {
        excerpt:
          "Tidak ada doa bagi orang yang tidak membaca Pembukaan Kitab. (Ubadah bin as-Samit; juga Sahih Muslim 394)",
      },
    ],
    appLinks: [
      {
        label: "Kata & makna",
      },
      {
        label: "Bacaan keras & pelan",
      },
      {
        label: "Setiap posisi",
      },
      {
        label: "Jika salah (sujud sahw)",
      },
      {
        label: "Pelacak latihan",
      },
    ],
  },
  {
    title: "Bacaan keras & pelan",
    summary:
      "Rakaat mana imam membaca dengan suara keras, mana yang pelan, dan apa yang Anda lakukan di belakangnya atau saat salat sendirian.",
    body: [
      "Salah satu pertanyaan paling umum — bagi Muslim baru maupun yang sudah lama salat — menjadi sederhana setelah Anda memahami dua prinsip: sebagian salat dibaca keras (jahri) dan sebagian pelan (sirri). Nabi ﷺ salat dengan kedua cara; para Sahabat menularkan polanya, dan hal ini tercatat di koleksi hadis utama.",
      "Dalam setiap salat, dua rakaat pertama adalah rakaat 'panjang': Al-Fatihah ditambah surah lain (atau beberapa ayat). Pada sisa rakaat salat tiga atau empat rakaat, Nabi ﷺ umumnya hanya membaca Al-Fatihah. Itulah sebabnya bacaan keras berhenti setelah rakaat kedua pada Maghrib dan Isya, sementara Dhuhur dan Ashar tetap pelan sepanjang salat.",
      "Allah tidak menyebut alasan eksplisit mengapa sebagian salat keras dan sebagian pelan. Para ulama menyebut hikmah — salat malam cocok dengan bacaan keras; salat siang terjadi di tengah kesibukan; polanya membedakan salat — tetapi Muslim mengikutinya terutama karena itu Sunnah. Allah berfirman: 'Sungguh, pada Rasulullah ada teladan yang baik bagimu' (33:21).",
      "Di belakang imam, aturan yang disepakati pada salat keras adalah mendengarkan dengan penuh perhatian dan tidak membaca surah lain dengan keras. Apakah Anda juga membaca Al-Fatihah pelan saat imam membaca adalah salah satu perbedaan paling dikenal di antara empat mazhab Sunni — semuanya posisi valid yang dipegang ulama serius. Pada salat pelan imam membaca pelan, sehingga setiap jamaah membaca untuk dirinya menurut ajaran mazhabnya.",
      "Salat sendirian: baca Al-Fatihah di setiap rakaat; tambahkan surah pada dua rakaat pertama setiap salat; pada rakaat terakhir hanya Al-Fatihah. Pada salat keras, sunnah membaca dengan suara keras saat sendirian, meskipun membaca pelan tetap sah.",
    ],
    steps: [
      {
        title: "Subuh — keras pada kedua rakaat",
        body: "Imam membaca keras pada kedua rakaat. Di belakangnya: dengarkan dengan penuh perhatian; jangan membaca surah lain dengan keras. Al-Fatihah — lihat langkah mazhab di bawah.",
        ruling: "fard",
      },
      {
        title: "Dhuhur — pelan pada keempat rakaat",
        body: "Imam membaca pelan di setiap rakaat. Di belakangnya: baca Al-Fatihah dan surah pelan untuk diri sendiri menurut mazhab Anda.",
        ruling: "fard",
      },
      {
        title: "Ashar — pelan pada keempat rakaat",
        body: "Sama seperti Dhuhur — bacaan imam sepenuhnya pelan; setiap jamaah membaca pelan di belakangnya.",
        ruling: "fard",
      },
      {
        title: "Maghrib — keras lalu pelan",
        body: "Keras pada rakaat ke-1 dan ke-2; pelan pada ke-3. Di belakangnya: dengarkan pada dua pertama; pada rakaat ketiga baca untuk diri sendiri menurut mazhab Anda.",
        ruling: "fard",
      },
      {
        title: "Isya — keras lalu pelan",
        body: "Keras pada rakaat ke-1 dan ke-2; pelan pada ke-3 dan ke-4. Di belakangnya: dengarkan pada dua pertama; pada dua terakhir baca untuk diri sendiri menurut mazhab Anda.",
        ruling: "fard",
      },
      {
        title: "Mengapa hanya dua rakaat pertama?",
        body: "Abu Qatadah (RA) melaporkan bahwa Nabi ﷺ membaca Al-Fatihah dan surah lain pada dua rakaat pertama Dhuhur dan Ashar, dan pada dua terakhir hanya Al-Fatihah. Pola ini menjelaskan struktur rakaat panjang/pendek pada setiap salat multi-rakaat.",
        ruling: "sunnah",
      },
      {
        title: "Di belakang imam pada salat keras — semua sepakat",
        body: "Dengarkan dengan saksama ketika Al-Qur'an dibaca keras. Jangan bersaing dengan imam atau membaca surah lain dengan keras. Allah berfirman: 'Apabila Al-Qur'an dibacakan, dengarkanlah dan diamlah agar kamu dirahmati' (7:204).",
        ruling: "fard",
      },
      {
        title: "Al-Fatihah di belakang imam — empat mazhab",
        body: "Hanafi: jangan baca Al-Fatihah pada salat keras; dengarkan. Maliki: umumnya mendengarkan saat bacaan keras. Syafi'i: baca Al-Fatihah di setiap rakaat, bahkan di belakang imam. Hanbali: dua pendapat; banyak ulama Hanbali menyarankan membaca Al-Fatihah pada jeda atau saat memungkinkan. Keempatnya adalah posisi Sunni yang diakui.",
        ruling: "wajib",
        tip: "Ikuti ajaran mazhab yang Anda pelajari dari guru terpercaya. Tidak ada mazhab yang memperbolehkan membaca surah lain dengan keras di atas imam.",
      },
      {
        title: "Di belakang imam pada salat pelan",
        body: "Hanafi (yang diandalkan): baca thana dan dzikir pelan tetapi bukan Al-Fatihah — bacaan imam sudah cukup. Maliki: dzikir pelan; praktik bervariasi. Syafi'i & Hanbali: baca Al-Fatihah pelan sendiri di setiap rakaat.",
        ruling: "fard",
      },
      {
        title: "Salat sendirian",
        body: "Tidak ada perbedaan pada apa yang Anda baca — hanya apakah Anda mengangkat suara. Setiap rakaat: Al-Fatihah. Dua pertama: tambahkan surah. Rakaat terakhir: hanya Al-Fatihah. Pada Subuh, Maghrib, dan Isya sunnah membaca keras; Dhuhur dan Ashar dibaca pelan.",
        ruling: "fard",
      },
    ],
    quran: [
      {
        excerpt: "Sungguh, pada Rasulullah ada teladan yang baik bagimu.",
      },
      {
        excerpt: "Apabila Al-Qur'an dibacakan, dengarkanlah dan diamlah agar kamu dirahmati.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Nabi ﷺ biasanya membaca Al-Fatihah dan surah lain pada dua rakaat pertama Dhuhur dan Ashar, dan pada dua terakhir hanya Al-Fatihah. (Abu Qatadah; juga Sahih Muslim 451)",
      },
      {
        excerpt:
          "Tidak ada salat bagi orang yang tidak membaca Pembukaan Kitab. (Ubadah bin as-Samit; juga Sahih Muslim 394)",
      },
      {
        excerpt:
          "Beliau membaca pada dua rakaat pertama Dhuhur dan Ashar sehingga Anda mengira beliau membaca surah-surah panjang, dan pada dua terakhir sehingga Anda mengira beliau membaca yang pendek. (Abu Qatadah)",
      },
    ],
    actions: [
      "Pada salat berjamaah berikutnya, perhatikan rakaat mana imam membaca dengan keras.",
      "Tanyakan kepada guru dari mazhab Anda apakah Anda membaca Al-Fatihah di belakang imam pada salat keras.",
      "Saat salat sendirian, coba membaca keras pada Subuh untuk merasakan sunnah bacaan jahri.",
    ],
    appLinks: [
      {
        label: "Salah langkah demi langkah",
      },
      {
        label: "Doa berjamaah",
      },
      {
        label: "Kata & makna",
      },
    ],
    disclaimer:
      "Empat mazhab Sunni berbeda pendapat tentang membaca Al-Fatihah di belakang imam pada salat keras dan pelan. Pelajaran ini menyajikan posisi mapan setiap mazhab tanpa menyatakan salah satunya sebagai satu-satunya pandangan benar. Pelajari rincian mazhab Anda dari guru yang berkualifikasi.",
  },
  {
    title: "Setiap posisi",
    summary: "Cara menjaga badan yang benar pada setiap posisi shalat.",
    body: [
      "Setiap postur dalam shalat memiliki bentuk tubuh yang ditunjukkan Nabi ﷺ dan dijaga oleh para Sahabatnya. Mempelajari bentuk doa yang benar melindungi doa Anda dari kesalahan fisik yang umum dan membantu tubuh mendukung kerendahan hati daripada mengalihkan perhatian darinya.",
      "Kedekatan sujud patut mendapat perhatian khusus: Nabi ﷺ bersabda, 'Yang paling dekat seorang hamba dengan Tuhannya adalah ketika dia sujud, maka banyaklah berdoa.' Sujud yang dilakukan dengan hening dan ikhlas merupakan salah satu momen yang paling dahsyat dalam hari orang beriman.",
    ],
    steps: [
      {
        title: "Berdiri (qiyam)",
        body: "Tegak, kaki kira-kira selebar bahu, berat badan seimbang, pandangan ke tempat sujud, tangan kanan di atas kiri di dada.",
      },
      {
        title: "Mengangkat tangan (raf' al-yadayn)",
        body: "Telapak tangan menghadap kiblat, sejajar dengan bahu atau daun telinga — pada pembukaan takbir, dan (oleh mayoritas) juga masuk dan keluar dari ruku.",
      },
      {
        title: "Membungkuk (ruku)",
        body: "Punggung rata dan rata, kepala tidak terangkat atau terkulai, jari-jari terentang mencengkeram lutut, lengan dijauhkan dari samping.",
      },
      {
        title: "Sujud (sujud)",
        body: "Dahi dan hidung menempel di tanah, telapak tangan rata di dekat bahu atau telinga, siku terangkat dan tidak menyentuh lantai, lutut ke bawah, jari-jari kaki ditekuk ke arah kiblat.",
      },
      {
        title: "Duduk (iftirash)",
        body: "Di antara dua sujud dan tashahhud pertama: duduk dengan kaki kiri dibaringkan mendatar dengan kaki kanan tegak, tangan bertumpu pada paha.",
      },
      {
        title: "Sidang terakhir (tawarruk)",
        body: "Pada tashahhud terakhir shalat 3 atau 4 rakaat (sunnah mazhab Syafi'i dan Hanbali): lewati kaki kiri di bawah kaki kanan dan duduk di tanah.",
      },
      {
        title: "Memutar kepala untuk salam (taslim)",
        body: "Putar wajah sepenuhnya ke kanan, lalu ke kiri, dengan kata-kata damai — akhiri doa sambil menyapa malaikat di setiap bahu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Yang paling dekat seorang hamba datang kepada Tuhannya adalah ketika ia sedang sujud, maka perbanyaklah berdoa. (Abu Hurairah)",
      },
    ],
    disclaimer:
      "Perbedaan kecil dalam penempatan tangan, cara duduk, dan mengangkat tangan semuanya berakar pada laporan otentik; masing-masing sekolah mengikuti narasi yang valid. Tidak ada yang membatalkan shalat orang lain.",
  },
  {
    title: "Kesalahan umum",
    summary: "Kesalahan-kesalahan yang diam-diam melemahkan doa - dan cara memperbaikinya.",
    body: [
      "Kebanyakan kesalahan dalam shalat bukanlah dosa hati, melainkan kebiasaan tergesa-gesa dan kurang perhatian. Memberi nama pada mereka adalah langkah pertama untuk memperbaikinya; Nabi ﷺ sendiri mengoreksi doa Sahabat dengan sabar dan langsung, yang mengajarkan kita bahwa kesalahan tersebut adalah hal yang lumrah dan dapat diperbaiki.",
      "Yang terparah sedang terburu-buru — mematuk ruku dan sujud tanpa keheningan. Tuma’ninah (diam menetap) merupakan rukun shalat bagi sebagian besar ulama, sehingga shalat yang tergesa-gesa bukan hanya tidak sempurna tetapi bisa juga batal. Selesaikan daftar di bawah ini satu per satu kebiasaan.",
    ],
    steps: [
      {
        title: "Berdoa terlalu cepat",
        body: "Hampir tidak berhenti dalam ruku atau sujud. Diamlah sampai badanmu tenang dan kamu dapat berdzikir minimal tiga kali tanpa terburu-buru.",
      },
      {
        title: "Wudhu tidak lengkap",
        body: "Bercak kering di tumit, pergelangan kaki, siku, atau sela-sela jari. Nabi ﷺ memperingatkan, 'Celakalah dari Neraka.' Cuci perlahan dan menyeluruh.",
      },
      {
        title: "Melengkung kembali dalam ruku, tenggelam dalam sujud",
        body: "Membungkuk dengan punggung membulat, atau menyandarkan dahi tanpa hidung, atau membiarkan lengan bawah tergeletak rata di lantai. Jaga agar punggung tetap rata dan siku terangkat.",
      },
      {
        title: "Mata dan hati yang mengembara",
        body: "Melihat sekeliling, atau memeriksa telepon. Pertahankan pandangan pada tempat sujud dan diamkan atau lepaskan ponsel Anda sebelum takbir.",
      },
      {
        title: "Berlomba mendahului imam",
        body: "Secara berjamaah, berpindah ke ruku atau sujud di hadapan imam. Ikuti dia - jangan pernah mendahuluinya - hanya bergerak setelah dia melakukannya.",
      },
      {
        title: "Berbicara, makan, atau tertawa",
        body: "Ucapan, makan, minum, atau suara tawa yang disengaja membatalkan shalat. Salah adalah percakapan dengan Allah saja.",
      },
      {
        title: "Salah membaca Al-Fatihah",
        body: "Melewatkan kata, atau membuat kesalahan yang mengubah makna. Pelajarilah dengan sempurna - seluruh doa bergantung padanya.",
      },
    ],
    actions: [
      "Berdoalah satu kali shalat hari ini dengan kecepatan setengah dari biasanya dan rasakan betapa berbedanya rasanya.",
      "Matikan suara ponsel Anda atau tinggalkan di ruangan lain sebelum Anda mengucapkan takbir pembuka.",
      "Mintalah seseorang yang berpengetahuan untuk memperhatikan salah satu doa Anda dan memperbaiki postur tubuh Anda.",
    ],
    appLinks: [
      {
        label: "Pelajari membaca Al-Fatihah",
      },
    ],
  },
  {
    title: "Amalan sunnah",
    summary: "Nabi ﷺ menganjurkan amalan yang mempercantik dan melipatgandakan pahala salat.",
    body: [
      "Di luar kewajiban, Nabi ﷺ mencontohkan banyak amalan yang dianjurkan (sunan) seputar shalat. Hal-hal tersebut tidak diwajibkan, jadi menghilangkan satu hal tidak membatalkan shalat — tetapi setiap hal tersebut mendekatkan Anda kepada Allah, mendapatkan pahala tambahan, dan memperbaiki kekurangan dalam shalat wajib.",
      "Yang paling utama di antaranya adalah shalat sunnah rutin (sunan rawatib) sebelum dan sesudah fardhu. Tidak semua shalat sukarela memiliki tingkatan yang sama: ulama membedakan sunnah mu'akkadah (sangat ditekankan dan rutin dikerjakan Nabi ﷺ), sunnah ghayr mu'akkadah (dianjurkan tetapi kurang ditekankan), dan nafl umum (sukarela tanpa jumlah tetap). Memahami perbedaannya membantu Anda menentukan amalan yang paling perlu dijaga setiap hari.",
      "Jadwal harian yang paling jelas dan paling kuat dalilnya adalah dua belas rawatib: dua sebelum Subuh, empat sebelum Zuhur, dua setelah Zuhur, dua setelah Maghrib, dan dua setelah Isya — dua belas rakaat dengan pahala sebuah rumah yang dibangun di Surga. Lihat pelajaran Jenis-jenis Salah untuk rincian lengkap setiap shalat beserta dalilnya.",
    ],
    actions: [
      "Gunakan siwak (siwak) sebelum wudhu dan shalat — Nabi ﷺ hampir mewajibkannya.",
      "Berjalanlah ke masjid dengan tenang dan dini hari, setiap langkah menaikkan derajat dan menghapus dosa.",
      "Jagalah dua belas rakaat sunnah rawatib untuk mendapatkan rumah yang dijanjikan di surga.",
      "Masuk masjid dengan kaki kanan dan keluar dengan kaki kiri, masing-masing dengan doanya.",
      "Ucapkan adhkar yang telah ditetapkan setelah setiap shalat — lihat Setelah Sholat.",
    ],
    hadith: [
      {
        excerpt:
          "Seandainya aku tidak memberatkan umatku, niscaya aku perintahkan mereka menggunakan siwak sebelum shalat. (Abu Hurairah; juga Sahih Muslim 252)",
      },
      {
        excerpt:
          "Nabi ﷺ tidak pernah meninggalkan dua rakaat sebelum Subuh. (Aisyah; juga Sahih Muslim 724)",
      },
      {
        excerpt:
          "Barang siapa yang rutin shalat dua belas rakaat pada siang dan malam, Allah akan membangunkan baginya sebuah rumah di Surga — dua sebelum Subuh, empat sebelum Zuhur, dua setelah Zuhur, dua setelah Maghrib, dan dua setelah Isya. (Umm Habibah)",
      },
    ],
    appLinks: [
      {
        label: "Jenis-jenis Salah — panduan rawatib",
      },
      {
        label: "Sunnah & dzikir pasca-salat",
      },
      {
        label: "Doa masjid",
      },
    ],
  },
  {
    title: "Khushu — kehadiran hati",
    summary: "Tujuan dari seluruh perjalanan: berdoa seolah-olah Anda melihat Allah.",
    body: [
      "Khushu adalah kerendahan hati, fokus, dan kesadaran bahwa diri kita benar-benar berdiri di hadapan Allah. Hal inilah yang menjadikan gerakan fisik salat menjadi ibadah yang nyata. Nabi ﷺ mendefinisikan kesempurnaan (ihsan) sebagai 'menyembah Allah seolah-olah kamu melihat-Nya, meskipun kamu tidak melihat-Nya, Dia pasti melihatmu' - dan hal ini paling langsung dilakukan selain dalam shalat.",
      "Allah membuka gambaran orang-orang mukmin yang berhasil dengan kata-kata ini: 'orang-orang yang khusyuk dalam shalatnya' (23:1-2). Dan Dia memperingatkan dengan tajam terhadap hal yang sebaliknya – 'celakalah orang-orang yang berdoa, tetapi lalai dari doanya' – sebuah teguran yang ditujukan kepada mereka yang tubuhnya bergerak-gerak sedangkan hatinya tidak ada.",
      "Khushu dibangun, bukan diharapkan. Pelajari arti dari apa yang Anda ucapkan sehingga kata-katanya menggerakkan Anda. Hilangkan gangguan sebelum takbir. Perlambat dan berikan ketenangan pada setiap postur. Renungkan keagungan Dia yang Anda tujukan dan kenyataan bahwa doa ini bisa menjadi doa terakhir Anda. Sholatlah setiap salat sebagai salat perpisahan, sebagaimana anjuran Nabi ﷺ.",
      "Jangan berkecil hati dengan pikiran yang mengembara – bahkan para Sahabat pun bergumul dengannya. Perjuangan untuk mengembalikan fokus, lagi dan lagi, itu sendiri adalah bagian dari ibadah. Khushu tumbuh sepanjang hidup; konsistensilah yang memupuknya.",
    ],
    quran: [
      {
        excerpt:
          "Sesungguhnya orang-orang yang beriman adalah orang-orang yang khusyuk, yaitu orang-orang yang khusyuk dalam shalatnya.",
      },
      {
        excerpt:
          "Maka celakalah orang-orang yang salat, yaitu orang-orang yang lalai dari salatnya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ihsan adalah beribadah kepada Allah seolah-olah kamu melihat-Nya, meskipun kamu tidak melihat-Nya, Dia pasti melihatmu. (Hadits Jibril, 'Umar)",
      },
    ],
    actions: [
      "Bacalah arti satu kalimat dari Kata Kata Sholat sebelum setiap sholat minggu ini.",
      "Berhentilah selama tiga detik santai di setiap postur sebelum melanjutkan.",
      "Catat tingkat fokus Anda dalam jurnal setelah salat dan perhatikan perubahan polanya.",
    ],
    appLinks: [
      {
        label: "Jurnal khushu",
      },
      {
        label: "Kata & makna",
      },
    ],
  },
  {
    title: "Pilar & pembatalan",
    summary: "Tanpanya doa tidak dapat ada - dan apa yang membatalkannya.",
    body: [
      "Amalan salat terbagi dalam tiga tingkatan. Rukun (arkan) adalah bagian yang penting: menghilangkan salah satu yang disengaja berarti membatalkan shalat, dan menghilangkan satu karena lupa harus diperbaiki dengan kembali ke sana. Amalan wajib (wajibat) itu wajib, namun jika terlupa diperbaiki dengan sujud lupa (sujud al-sahw). Sunnah itu menyempurnakan dan memperindah shalat, dan meninggalkannya tidak ada sanksinya.",
      "Mengetahui hierarki ini melindungi Anda dari dua ekstrem: menganggap kelalaian kecil sebagai hal yang merusak, atau memperlakukan pilar asli sebagai opsional. Bila ragu terhadap suatu rukun, maka doanya tidak akan terkabul hingga terkabul.",
      "Secara terpisah, ada hal-hal tertentu yang membatalkan salat pada saat hal itu terjadi – karena hal-hal tersebut bertentangan dengan kondisi salat itu sendiri. Yang lain membatalkan wudhu, yang pada gilirannya mengakhiri shalat. Waspadalah terhadap kedua hal tersebut agar Anda tidak pernah shalat dalam keadaan tidak sah tanpa menyadarinya.",
    ],
    steps: [
      {
        title: "Pilar (arkan)",
        body: "Berdiri bila mampu, pembukaan takbir, membaca Al-Fatihah, ruku, bangun darinya, dua sujud, duduk di antara keduanya, duduk terakhir, tashahhud, salam, tuma'ninah masing-masing, dan menjaga urutan yang benar.",
      },
      {
        title: "Amalan wajib (wajibat)",
        body: "Seperti takbir lainnya, kata-kata dzikir dalam ruku dan sujud, serta tashahhud pertama — diperbaiki dengan sujud al-sahw jika terlupakan (menurut rincian Hanbali; alirannya berbeda).",
      },
      {
        title: "Pembatalan wudhu",
        body: "Segala sesuatu yang keluar dari saluran depan atau belakang, tidur nyenyak, kehilangan kesadaran – dan, menurut sebagian ulama, menyentuh langsung bagian pribadi. Semua ini mengakhiri doa.",
      },
      {
        title: "Pembatalan shalat itu sendiri",
        body: "Ucapan yang disengaja, makan atau minum yang disengaja, banyak melakukan gerakan yang tidak perlu terus menerus, tertawa terbahak-bahak, sengaja memalingkan dada dari kiblat, dan membuka aurat.",
      },
    ],
    disclaimer:
      "Keempat mazhab tersebut mengklasifikasikan beberapa perbuatan secara berbeda — misalnya apakah tashahhud pertama itu wajib atau sunnah, atau daftar persis apa yang diwajibkan sujud al-sahw. Pelajari detail sekolah Anda dari guru yang berkualifikasi.",
    appLinks: [
      {
        label: "Sujud sahw",
      },
    ],
  },
  {
    title: "Sujud al-Sahw - memperbaiki kesalahan",
    summary: "Sujud lupa yang memperbaiki kesalahan dalam shalat.",
    body: [
      "Tidak ada seorang pun yang kebal terhadap lupa dalam shalat — bahkan Nabi ﷺ pun lupa, lalu mengajarkan, 'Aku hanya manusia biasa sepertimu; Aku lupa seperti kamu lupa, jadi ketika aku lupa, ingatkan aku.' Dari contohnya sendiri muncul solusi yang sudah ada: dua sujud tambahan, yang disebut sujud al-sahw (sujud karena lupa), yang memperbaiki kesalahan-kesalahan kecil sehingga shalat tidak perlu diulang.",
      "Diwajibkan dalam tiga situasi umum: tambahan (sholat rakaat tambahan atau posisi tubuh karena kesalahan), kelalaian (meninggalkan kewajiban seperti tashahhud pertama), atau keraguan (tidak yakin berapa banyak rakaat yang telah Anda salat). Tidak perlu meninggalkan sunnah, dan tidak perlu melakukan kesalahan yang disengaja, semua itu ada hukumnya sendiri.",
      "Ketika Anda benar-benar ragu, prinsip panduannya adalah: buang keraguan itu, kembangkan apa yang Anda yakini (jumlah yang lebih kecil), selesaikan shalat, dan kemudian lakukan dua sujud. Hal ini mengubah kebingungan menjadi doa yang mantap dan sahih, bukan sekadar dugaan yang cemas.",
      "Praktisnya: lakukan dua sujud persis seperti sujud biasa, dengan takbir sebelum dan sesudahnya, lalu salam. Para ulama berbeda pendapat mengenai apakah mereka datang sebelum atau sesudah salam, tergantung pada jenis kesalahannya. Kedua-duanya dilaporkan secara shahih, sehingga keduanya diterima dan tidak ada yang membatalkan shalat.",
    ],
    hadith: [
      {
        excerpt:
          "Jika salah seorang di antara kalian ragu-ragu dalam shalatnya dan tidak mengetahui berapa kali ia shalat, tiga atau empat kali, hendaklah ia membuang keraguannya, bertumbuhlah pada apa yang ia yakini, lalu sujud dua kali sebelum salam. (Abu Sa'id al-Khudri)",
      },
      {
        excerpt:
          "Apabila salah seorang di antara kalian ragu-ragu dalam shalatnya, hendaklah ia mencari yang benar dan sempurna, lalu mengucapkan salam dan sujud sebanyak dua kali. (Ibnu Mas'ud; juga Sahih Muslim 572)",
      },
    ],
    actions: [
      "Hafalkan aturan keraguan: bangunlah angka yang lebih kecil, selesaikan, lalu sujud dua kali.",
      "Jika ditengah shalat Anda menyadari Anda meninggalkan tashahhud pertama, lanjutkan dan sujud al-sahw di akhir.",
    ],
    disclaimer:
      "Jatuhnya dua sujud sebelum atau sesudah salam tergantung pada kesalahannya, dan madzhabnya berbeda. Keduanya berasal dari sunnah; jangan biarkan ketidakpastian menghentikan Anda untuk berdoa.",
    appLinks: [
      {
        label: "Rukun & pembatal",
      },
    ],
  },
  {
    title: "Jenis-jenis shalat",
    summary:
      "Fardhu, sunnah mu'akkadah, sunnah ghayr mu'akkadah, witir, dan nafl umum — dengan dalil sahih untuk masing-masing.",
    body: [
      "Shalat dibedakan menurut tingkat kewajibannya. Lima shalat harian adalah fardhu — kewajiban tegas bagi setiap Muslim mukallaf. Di sekelilingnya terdapat dunia shalat sukarela yang kaya, yang dengannya Nabi ﷺ semakin mendekat kepada Allah dan yang juga dapat mendekatkan kita kepada-Nya.",
      "Agar memahaminya dengan benar, bedakan empat kategori sukarela yang berlandaskan dalil sahih: sunnah mu'akkadah (rawatib yang jarang ditinggalkan Nabi ﷺ), sunnah ghayr mu'akkadah (dianjurkan tetapi kurang ditekankan), witir (kategori tersendiri karena mazhab Hanafi menilainya wajib sedangkan mayoritas menilainya sunnah mu'akkadah), dan nafl umum (shalat sukarela tanpa jumlah tetap yang tidak diperselisihkan). Jika ulama berbeda mengenai jumlah tertentu — seperti enam rakaat setelah Maghrib sebagai Salat al-Awwabin — kami menyampaikan anjuran umumnya tanpa menetapkan jumlah yang diperselisihkan sebagai sunnah yang baku.",
      "Shalat sukarela penting karena dua alasan: ia merupakan amalan yang dicintai dan meninggikan derajat seorang mukmin, serta menyempurnakan shalat wajib, karena kekurangan dalam fardhu akan dilengkapi dari shalat sukarela seseorang pada Hari Kiamat.",
      "Dua belas rawatib di bawah ini adalah jadwal sunnah harian paling jelas dengan kesepakatan terkuat. Tabel rakaat pada halaman Belajar Salah melacak dua belas rakaat yang ditekankan ini; nafl sebelum Asar, sebelum Maghrib, atau setelah Isya tetap dianjurkan bila ada dalil, tetapi tidak dimasukkan ke dalam jumlah tetap tersebut.",
    ],
    steps: [
      {
        title: "Lima fardhu harian",
        body: "Subuh, Zuhur, Asar, Maghrib, Isya — fondasi wajib yang tidak boleh ditinggalkan.",
      },
      {
        title: "Subuh — 2 sebelum (sunnah mu'akkadah)",
        body: "Dua rakaat sebelum fardhu Subuh adalah sunnah mu'akkadah — Nabi ﷺ tidak pernah meninggalkannya. Tidak ada sunnah rutin yang sahih setelah Subuh; shalat sukarela umumnya dilarang setelah Subuh hingga matahari terbit.",
      },
      {
        title: "Zuhur — 4 sebelum & 2 setelah (sunnah mu'akkadah)",
        body: "Empat rakaat sebelum Zuhur dan dua setelahnya termasuk dua belas rawatib. Secara terpisah, Umm Habibah meriwayatkan bahwa siapa yang shalat empat sebelum dan empat setelah Zuhur akan Allah haramkan dari Neraka — maka dua rakaat tambahan setelah dua rawatib adalah nafl yang dianjurkan, dan sebagian ulama juga menganjurkan dua tambahan sebelumnya hingga berjumlah enam.",
      },
      {
        title: "Asar — 4 sebelum (sunnah ghayr mu'akkadah)",
        body: "Empat rakaat sebelum Asar sangat dianjurkan sebagai sunnah ghayr mu'akkadah. Tidak ada sunnah rutin yang sahih setelah Asar; shalat sukarela umumnya dilarang setelah Asar hingga matahari terbenam.",
      },
      {
        title: "Maghrib — 2 sebelum & 2 setelah",
        body: "Dua rakaat setelah Maghrib adalah sunnah mu'akkadah dan termasuk dua belas rawatib. Sebelum Maghrib, Nabi ﷺ bersabda dua kali, 'Shalatlah sebelum Maghrib,' lalu menambahkan, 'bagi yang menghendaki' — maka dua rakaat sebelumnya adalah nafl pilihan, bukan rawatib tetap. Nafl umum setelah Maghrib dianjurkan, tetapi penetapan enam rakaat sebagai Salat al-Awwabin diperselisihkan kesahihannya.",
      },
      {
        title: "Isya — 2 setelah & pilihan sebelum",
        body: "Dua rakaat setelah Isya adalah sunnah mu'akkadah dan termasuk dua belas rawatib. Sebelum Isya, hadits 'Di antara setiap dua panggilan ada shalat' membolehkan dua atau empat rakaat antara adzan dan iqamah sebagai nafl umum, bukan sunnah rawatib. Nafl tambahan setelah Isya boleh, tetapi tidak ada sunnah sahih dengan dua rakaat tetap selain rawatib biasa.",
      },
      {
        title: "Witir — kategori tersendiri",
        body: "Witir dikerjakan setelah Isya dengan jumlah ganjil (1, 3, 5, 7, 9, 11…). Banyak hadits sahih memerintah dan menganjurkannya. Mazhab Hanafi menilainya wajib; mayoritas menilainya sunnah mu'akkadah. Karena perbedaan hukum ini, witir dipisahkan dari dua belas rawatib.",
      },
      {
        title: "Dua belas rawatib — jadwal yang disepakati",
        body: "Sebelum Subuh: 2. Sebelum Zuhur: 4. Setelah Zuhur: 2. Setelah Maghrib: 2. Setelah Isya: 2. Total: 12 rakaat. Siapa yang rutin mengerjakannya, Allah membangunkan baginya sebuah rumah di Surga.",
      },
      {
        title: "Nafl yang dianjurkan — bukan rawatib tetap",
        body: "Sebelum Asar: 4 (hasan). Sebelum Maghrib: 2 pilihan (sahih). Sebelum Isya: 2 atau 4 antara adzan dan iqamah (sahih). Tambahan sebelum Zuhur: 2 dianjurkan. Tambahan setelah Zuhur: 2 (hasan/sahih). Setelah Maghrib dan Isya: nafl umum dianjurkan — tanpa jumlah tetap yang diperselisihkan.",
      },
      {
        title: "Tahajjud (qiyam al-layl)",
        body: "Shalat malam pada sepertiga malam terakhir — shalat sukarela yang paling utama dan kebiasaan orang-orang saleh.",
      },
      {
        title: "Duha",
        body: "Shalat pertengahan pagi (2–8 rakaat) — sedekah harian bagi setiap persendian tubuh.",
      },
      {
        title: "Tarawih",
        body: "Sholat malam berjamaah di bulan Ramadhan — menghidupkan kembali malam-malam di bulan yang penuh berkah.",
      },
      {
        title: "Kedua Idul Fitri",
        body: "Dua rakaat Idul Fitri dan Idul Adha, dilanjutkan dengan khutbah.",
      },
      {
        title: "Istikharah",
        body: "Sholat dua rakaat memohon petunjuk Allah sebelum mengambil keputusan.",
      },
      {
        title: "Janazah",
        body: "Sholat jenazah merupakan kewajiban berjamaah (fardhu kifayah) yang dilakukan sambil berdiri, tanpa ruku atau sujud.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Nabi ﷺ tidak pernah meninggalkan dua rakaat sebelum Subuh. (Aisyah; juga Sahih Muslim 724)",
      },
      {
        excerpt:
          "Barang siapa yang rutin shalat dua belas rakaat pada siang dan malam, Allah akan membangunkan baginya sebuah rumah di Surga — dua sebelum Subuh, empat sebelum Zuhur, dua setelah Zuhur, dua setelah Maghrib, dan dua setelah Isya. (Umm Habibah)",
      },
      {
        excerpt:
          "Barang siapa shalat empat rakaat sebelum Zuhur dan empat setelahnya, Allah mengharamkannya dari Neraka. (Umm Habibah; dinilai sahih oleh banyak ulama)",
      },
      {
        excerpt: "Semoga Allah merahmati orang yang shalat empat rakaat sebelum Asar.",
      },
      {
        excerpt:
          "Shalatlah sebelum Maghrib, shalatlah sebelum Maghrib — kemudian beliau bersabda: bagi yang menghendaki. (Ibnu 'Umar)",
      },
      {
        excerpt:
          "Di antara setiap dua panggilan (adzan dan iqamah) terdapat shalat. (Anas bin Malik; juga Sahih Muslim 838)",
      },
      {
        excerpt:
          "Witir adalah hak, maka siapa yang mau hendaklah shalat lima, siapa yang mau tiga, dan siapa yang mau satu. (Ibnu 'Umar)",
      },
      {
        excerpt: "Shalat terbaik setelah shalat wajib adalah shalat malam. (Abu Hurairah)",
      },
      {
        excerpt:
          "Hamba-Ku terus mendekat kepada-Ku dengan amalan-amalan nafl hingga Aku mencintainya. (Hadits Qudsi)",
      },
    ],
    actions: [
      "Mulailah dengan dua belas rawatib — bangun kebiasaannya sebelum menambah nafl pilihan.",
      "Gunakan tabel rakaat pada halaman ini untuk melacak sunnah yang ditekankan di sekitar setiap fardhu.",
      "Baca kartu-kartu dalil di bawah dan tandai hadits yang ingin Anda pelajari kembali.",
    ],
    appLinks: [
      {
        label: "Amalan sunnah",
      },
      {
        label: "Panduan tahajud",
      },
      {
        label: "Tabel rakaat",
      },
    ],
    disclaimer:
      "Hukum witir (wajib atau sunnah mu'akkadah), jumlah pasti rakaat pilihan sebelum Isya, dan Salat al-Awwabin setelah Maghrib merupakan perkara khilafiyah. Pelajaran ini hanya menyajikan hal yang memiliki dasar nash sahih dan mencatat perbedaan ketika ada.",
  },
  {
    title: "Jumu'ah - shalat Jumat",
    summary:
      "Kewajiban mingguan yang menghimpun masyarakat dan menggantikan Dhuhur pada hari Jum'at.",
    body: [
      "Jumu'ah adalah shalat berjamaah yang diadakan setelah Dzuhur setiap hari Jumat, dan ini merupakan kewajiban tersendiri, yang diperintahkan sesuai dengan namanya dalam Al-Qur'an: 'Jika ada adzan pada hari Jumat, segeralah mengingat Allah dan tinggalkan perdagangan.' Terdiri dari khotbah (khutbah) dalam dua bagian, dilanjutkan dengan dua rakaat shalat dengan suara keras di belakang imam, dan menggantikan waktu Dhuhur bagi yang hadir.",
      "Ini adalah kewajiban pribadi (fardhu 'ayn) atas setiap pria Muslim yang merdeka, dewasa, menetap, dan mampu. Nabi ﷺ merinci bahwa itu adalah 'kewajiban bagi setiap Muslim yang berjamaah, kecuali empat: seorang budak, seorang wanita, seorang anak, atau orang yang sakit.' Wanita, musafir, dan orang sakit diperbolehkan untuk melaksanakan shalat Dhuhur, meskipun mereka boleh hadir jika mereka menginginkannya.",
      "Kelalaiannya adalah bahaya besar: Nabi ﷺ memperingatkan bahwa siapa pun yang meninggalkan tiga Jum'at karena lalai, maka Allah akan menutup hatinya. Namun pahalanya juga sama besarnya – Jumat adalah hari terbaik saat matahari terbit, dan merupakan waktu di mana doa terkabul.",
      "Persiapkanlah seperti yang dilakukan Nabi ﷺ: mandi, kenakan pakaian bersih terbaik, gunakan wewangian, berangkat pagi, dan dengarkan khutbah dengan penuh perhatian dalam diam (berbicara sia-sia akan menyia-nyiakan pahala). Membaca Surat Al-Kahfi pada hari Jumat membawa cahaya di antara dua hari Jumat.",
    ],
    quran: [
      {
        excerpt:
          "Hai orang-orang yang beriman, jika ada adzan pada hari Jumat, segeralah mengingat Allah dan tinggalkan perdagangan. Itu lebih baik bagimu, jika kamu mengetahui.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sholat Jumat berjamaah merupakan kewajiban wajib bagi setiap muslim, kecuali empat orang, yaitu: seorang budak, seorang wanita, seorang anak kecil, atau seorang yang sedang sakit. (Tariq bin Shihab)",
      },
      {
        excerpt:
          "Barangsiapa meninggalkan shalat Jum'at tiga kali karena lalai, maka Allah akan menutup hatinya. (Abu al-Ja'd; juga Abu Dawud 1052, at-Tirmidzi 500)",
      },
      {
        excerpt:
          "Mandi pada hari Jum'at wajib hukumnya bagi setiap orang yang telah baligh. (Abu Sa'id al-Khudri)",
      },
    ],
    actions: [
      "Mandi, memakai pakaian bersih dan wangi, dan datang lebih awal – orang yang datang paling awal akan mendapat pahala terbesar.",
      "Bacalah Surat Al-Kahfi pada suatu waktu di hari Jum'at untuk mendapatkan pencerahan di antara dua hari Jum'at.",
      "Tetap diam dan penuh perhatian selama khutbah; jauhkan teleponnya.",
    ],
    disclaimer:
      "Minimnya jumlah jamaah, dan apakah mandi itu wajib atau sunah yang kuat, menjadi perbedaan pendapat para ulama. Ikuti praktik terpercaya komunitas lokal Anda.",
    appLinks: [
      {
        label: "Baca Surah Al-Kahf",
      },
    ],
  },
  {
    title: "Doa berjamaah",
    summary: "Sholat di belakang imam pahalanya dua puluh tujuh kali lipat.",
    body: [
      "Sholat lima waktu berjamaah (jama'ah) sangat ditekankan, terutama bagi laki-laki, dan merupakan ciri komunitas Muslim yang hidup. Nabi ﷺ mengajarkan bahwa shalat berjamaah pahalanya dua puluh tujuh kali lebih besar daripada shalat sendirian – suatu pengganda yang tidak dapat ditandingi oleh upaya individu.",
      "Jamaah berdiri dalam barisan lurus, tanpa celah, bahu-membahu, mengikuti imam dengan tepat: Anda memulai setiap gerakan hanya setelah dia melakukannya, tidak pernah sebelum dia, dan tidak pernah pada saat yang sama. Meluruskan shaf itu sendiri merupakan bagian dari menyempurnakan shalat.",
      "Jika Anda datang setelah imam mulai (orang yang terlambat disebut masbuq), segeralah bergabung dalam posisi apa pun yang Anda temukan – porsi itu tetap dihitung sebagai shalat bersamanya. Saat dia memberikan salam terakhir, berdirilah dan selesaikan rakaat yang Anda lewatkan sendiri, lalu selesaikan.",
      "Jamaahnya tidak hanya di masjid saja, dua orang yang shalat berjamaah membentuk satu jama'ah, sehingga seorang ayah yang membawa anaknya, atau dua orang temannya yang sedang bepergian, dapat memperoleh pahalanya. Perempuan boleh salat berjamaah dan beribadah di masjid jika tersedia fasilitas yang memadai, namun salat di rumah juga mendapat pahala yang besar.",
    ],
    hadith: [
      {
        excerpt:
          "Sholat berjamaah dua puluh tujuh derajat lebih mulia dari pada sholat sendirian. (Ibnu 'Umar; juga Sahih Muslim 650)",
      },
    ],
    quran: [
      {
        excerpt:
          "Dan dirikanlah shalat, keluarkan zakat, dan ruku’ bersama orang-orang yang ruku’.",
      },
    ],
    actions: [
      "Berdoalah setidaknya satu kali di masjid hari ini, atau kumpulkan anggota rumah tangga Anda dalam satu barisan di rumah.",
      "Pelajari apa yang harus dilakukan sebagai orang yang terlambat: segera bergabung, lalu selesaikan rakaat yang terlewat setelah salam imam.",
    ],
  },
  {
    title: "Sholat yang terlewat (qada).",
    summary: "Mengkompensasi apa yang terlewat – pintu rahmat Allah tetap terbuka.",
    body: [
      "Jika salat fardhu terlewat karena terlalu banyak tidur, lupa, atau kelalaian (semoga Allah melindungi kita) maka kewajiban tersebut tidak hilang begitu saja. Itu harus diqadha, dan Nabi ﷺ memperjelas hukumnya: 'Barang siapa yang lupa shalat atau tertidur, maka kafirnya adalah dengan shalat ketika dia mengingatnya.' Tidak ada tebusan lain selain mendoakannya.",
      "Sholat qadha yang dilakukan sama dengan shalatnya yang asli, yakni empat rakaat Dhuhur yang terlewat, maka shalatnya sama dengan empat rakaat, meskipun ia mengqadha pada malam hari atau saat bepergian. Barangsiapa yang meninggalkan salat karena alasan yang sah (seperti tidur nyenyak) tidak berdosa jika menunda salat; orang yang meninggalkannya dengan sengaja harus menebusnya dengan pertobatan yang tulus dan mendesak.",
      "Para ulama menganjurkan untuk segera mengqadha salat yang terlewat dan sedapat mungkin dilakukan secara berurutan, tanpa membiarkannya menumpuk karena bebannya akan bertambah berat seiring berjalannya waktu dan penundaan. Jika banyak hal yang terlewat selama bertahun-tahun, lakukan pendekatan dengan rencana harian yang realistis daripada putus asa; Pintu kembali Allah selalu terbuka.",
    ],
    hadith: [
      {
        excerpt:
          "Barang siapa yang lupa salat atau tertidur, maka kafirnya adalah dengan salat ketika ia mengingatnya. (Anas; juga Sahih Muslim 684)",
      },
    ],
    actions: [
      "Perkirakan dengan jujur ​​berapa banyak doa yang harus Anda panjatkan dan tetapkan target riasan harian yang realistis.",
      "Gabungkan setiap salat wajib dengan satu salat qadha hingga terhapuskan simpanannya.",
      "Jangan pernah menunda salat yang sudah jatuh tempo untuk mengganti salat lama. Jagalah salat hari ini tepat pada waktunya.",
    ],
    appLinks: [
      {
        label: "Pelacak qadha",
      },
      {
        label: "Riwayat qadha",
      },
    ],
  },
  {
    title: "Setelah shalat",
    summary: "Adhkar dan doa yang menyegel pahala setiap doa.",
    body: [
      "Nabi ﷺ tidak pernah tiba-tiba bangun dari shalat. Beliau tetap duduk, memohon ampun kepada Allah dan berdzikir – dan Beliau mengajarkan bahwa saat setelah shalat fardhu adalah saat-saat di mana doa paling mudah dikabulkan. Meninggalkan dengan segera akan menghilangkan sebagian dari hasil terbesar dari doa.",
      "Rutinitas pasca salat yang ditetapkan sederhana dan berbobot: ucapkan 'Astaghfirullah' tiga kali; lalu kata-kata tauhid dan pujian; kemudian 'SubhanAllah', 'Alhamdulillah', dan 'Allahu Akbar' masing-masing tiga puluh tiga kali, dan menutup seperseratusnya dengan 'La ilaha illallah…' - siapa pun yang melakukannya akan diampuni dosanya meskipun seperti buih di lautan.",
      "Membaca Ayat al-Kursi setelah setiap shalat wajib hanya menghilangkan kematian antara seseorang dan surga, seperti yang dijanjikan Nabi ﷺ. Dilanjutkan dengan tiga Quls (Al-Ikhlas, Al-Falaq, An-Nas), dan ditambah dengan adzkar pagi setelah Subuh dan adzkar sore setelah Ashar atau Maghrib dimana mereka berlaku.",
    ],
    hadith: [
      {
        excerpt:
          "Barangsiapa mengagungkan, memuji dan mengagungkan Allah sebanyak tiga puluh tiga kali setiap selesai shalat… dan menyempurnakan seratus kali dengan kalimat tauhid, maka dosanya diampuni meskipun seperti buih di lautan. (Abu Hurairah)",
      },
      {
        excerpt:
          "Barangsiapa membaca Ayat al-Kursi setelah setiap shalat yang diwajibkan, tidak ada yang menghalangi dia untuk masuk surga kecuali kematian. (Abu Umamah; dinilai sahih oleh al-Albani)",
      },
    ],
    actions: [
      "Hafalkanlah pasca-shalat tasbih (33/33/33+tahlil) minggu ini.",
      "Bacalah Ayat al-Kursi dan tiga Qul sebelum Anda berdiri.",
      "Tetaplah duduk selama satu menit untuk berdoa pribadi setelah setiap shalat fardhu.",
    ],
    appLinks: [
      {
        label: "Dzikir pasca-salat",
      },
      {
        label: "Penghitung tasbih",
      },
    ],
  },
];

export const SALAH_GUIDE_PHRASES_ID: DeepPartial<SalahGuidePhrase>[] = [
  {
    title: "Setelah selesai wudhu",
    when: "Segera setelah selesai wudhu, sebelum shalat.",
    translation:
      "Aku bersaksi bahwa tidak ada Tuhan selain Allah saja, tanpa sekutu, dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya.",
    meaning:
      "Memperbarui kesaksian iman sementara tubuh Anda baru disucikan. Nabi ﷺ berjanji bahwa siapa pun yang mengucapkan hal ini setelah wudhu, maka delapan pintu surga akan dibukakan baginya untuk dimasuki oleh siapa saja yang ia kehendaki.",
  },
  {
    title: "Takbirat al-Ihram",
    when: "Di awal salat, dan saat berpindah antar posisi.",
    translation: "Allah Maha Besar.",
    meaning:
      "Doa dimulai di sini — 'al-ihram' berarti melarangmu melakukan hal-hal duniawi (berbicara, makan, berpaling). Anda menyatakan Allah lebih besar dari apa pun yang dapat mengalihkan perhatian Anda, dan melangkahlah sepenuhnya ke hadirat-Nya. Setiap takbir berikutnya memperbaharui penyerahan diri itu.",
  },
  {
    title: "Doa al-Istiftah (doa pembuka)",
    when: "Diam-diam setelah takbir pembukaan, sebelum Al-Fatihah.",
    translation:
      "Maha Suci Engkau ya Allah dan puji syukur. Terberkatilah nama-Mu dan maha agung Yang Mulia. Tidak ada Tuhan selain Engkau.",
    meaning:
      "Anda membuka percakapan dengan mengagungkan dan memuji Allah serta meneguhkan keesaan-Nya, menenangkan hati sebelum Anda mengucapkan firman-Nya. Ada beberapa doa pembuka yang otentik — ini adalah salah satu yang paling banyak digunakan.",
  },
  {
    title: "Surat Al-Fatihah",
    when: "Berdiri di setiap rakaat — tiang yang tanpanya rakaatnya tidak sah.",
    translation:
      "Dengan menyebut nama Allah Yang Maha Penyayang lagi Maha Penyayang. Segala puji bagi Allah, Tuhan semesta alam, Yang Maha Penyayang, Yang Maha Penyayang, Yang Berdaulat pada Hari Pembalasan. Engkaulah yang kami sembah dan Engkaulah yang kami mohon pertolongan. Bimbinglah kami ke jalan yang lurus, yaitu jalan orang-orang yang Engkau beri nikmat, bukan jalan orang-orang yang mudah marah atau orang-orang yang sesat.",
    meaning:
      "'Bunda Kitab': separuh puji bagi Allah dan separuh permohonan petunjuk, dengan 'Engkaulah kami sembah' sebagai penghubung di antara keduanya. Allah berkata bahwa Dia membagi surah ini antara diri-Nya dan hamba-Nya — saat Anda membaca setiap barisnya, Dia merespons. Nabi ﷺ bersabda, tidak ada doa bagi orang yang tidak membacanya.",
  },
  {
    title: "Dzikir dalam ruku",
    when: "Sambil rukuk, dengan posisi datar, duduk kembali.",
    translation: "Maha Suci Tuhanku Yang Maha Agung.",
    meaning:
      "Membungkuk adalah sikap hormat, sehingga mengagungkan keagungan Allah - diucapkan tiga kali atau lebih, tanpa tergesa-gesa. Nabi ﷺ mengajarkan bahwa dalam ruku kita mengagungkan Tuhan, maka semoga doaku terkabul.",
  },
  {
    title: "Bangkit dari ruku",
    when: "Berdiri tegak sepenuhnya setelah rukuk.",
    translation:
      "Allah mendengar siapa pun yang memuji-Nya. Ya Tuhan kami, hanya milikMu segala puji.",
    meaning:
      "Anda menegaskan bahwa Allah benar-benar mendengar orang yang memuji-Nya, lalu mengembalikan segala pujian kepada-Nya. Nabi ﷺ bersabda, ketika imam mengatakan hal ini dan orang-orang menjawab, siapa pun yang perkataannya bertepatan dengan perkataan para malaikat, maka dosa masa lalunya akan diampuni.",
  },
  {
    title: "Dzikir dalam sujud",
    when: "Dalam sujud — posisi yang paling dekat dengan Allah.",
    translation: "Maha Suci Tuhanku Yang Maha Tinggi.",
    meaning:
      "Pada titik terendah secara fisik, Anda memuliakan Yang Maha Tinggi - sebuah paradoks yang menjadi inti ibadah. Nabi ﷺ bersabda seorang hamba paling dekat dengan Tuhannya ketika sujud, maka curahkan doa di sini setelah dzikir.",
  },
  {
    title: "Di antara dua sujud",
    when: "Duduk dengan tenang di antara sujud pertama dan kedua setiap rakaat.",
    translation: "Tuhanku, maafkan aku. Tuhanku, maafkan aku.",
    meaning:
      "Permohonan ampun yang singkat namun langsung di setiap rakaat — sebuah pengingat bahwa bahkan di tengah shalat kita masih membutuhkan ampunan Allah. Duduklah sampai Anda merasa nyaman sebelum sujud kedua.",
  },
  {
    title: "At-Tahiyyat (Tashahhud)",
    when: "Di tengah duduk dan duduk terakhir shalat.",
    translation:
      "Segala salam, doa, dan kata-kata yang murni hanya untuk Allah. Salam sejahtera bagimu wahai Nabi, dan rahmat Allah dan berkah-Nya. Salam sejahtera bagi kami dan hamba-hamba Allah yang shaleh. Aku bersaksi bahwa tidak ada Tuhan selain Allah, dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya.",
    meaning:
      "Intisari salat: kamu mempersembahkan segala ibadah hanya kepada Allah, shalawat kepada Nabi ﷺ dan orang-orang shaleh, dan ucapkan kembali kedua kesaksian tersebut. Ibnu Mas'ud mempelajarinya dari Nabi ﷺ kata demi kata, seperti seseorang mempelajari sebuah surah.",
  },
  {
    title: "Shalawat Ibrahimiyyah",
    when: "Pada tashahhud terakhir, setelah At-Tahiyyat.",
    translation:
      "Ya Allah, kirimkan shalawat kepada Muhammad dan keluarga Muhammad, sebagaimana Engkau memberkati Ibrahim dan keluarga Ibrahim; sesungguhnya Engkau Maha Terpuji lagi Maha Mulia. Ya Allah, limpahkan nikmat kepada Muhammad dan keluarga Muhammad, sebagaimana Engkau menyayangi Ibrahim dan keluarga Ibrahim; sesungguhnya Engkau Maha Terpuji lagi Maha Mulia.",
    meaning:
      "Ketika para Sahabat bertanya bagaimana cara mengirimkan shalawat kepadanya, Nabi ﷺ mengajari mereka kata-kata yang tepat ini — salawat yang paling shahih dalam Sunnah. Hormatilah Rasulullah ﷺ sebagaimana diperintahkan Allah, lengkapi shalatmu dengan rasa cinta kepada yang mengajarimu shalat.",
  },
  {
    title: "Mencari perlindungan sebelum salam",
    when: "Setelah tashahhud dan salawat terakhir, sesaat sebelum mengakhiri shalat.",
    translation:
      "Ya Allah, aku berlindung kepada-Mu dari siksa kubur, dari siksa Neraka, dari cobaan hidup dan mati, dan dari keburukan cobaan al-Masih Palsu (Dajjal).",
    meaning:
      "Nabi ﷺ menginstruksikan bahwa setelah tashahhud terakhir seseorang berlindung dari empat bahaya ini sebelum memberikan salam — permohonan doa terakhir mencakup kehidupan ini, kuburan, api, dan cobaan terbesar yang akan datang.",
  },
  {
    title: "Taslim (salam penutup)",
    when: "Mengakhiri shalat — memutar wajah ke kanan, lalu ke kiri.",
    translation: "Damai dan rahmat Allah besertamu.",
    meaning:
      "Anda meninggalkan shalat sebagaimana Anda meninggalkan rombongan orang yang dihormati - dengan salam damai kepada para malaikat yang tercatat di setiap bahu dan kepada mereka yang berdoa di samping Anda. Salam adalah sebuah pilar; dengan itu doanya selesai.",
  },
];

export const SALAH_GUIDE_QUIZ_ID: DeepPartial<SalahGuideQuizQuestion>[] = [
  {
    id: "rawatib-total",
    type: "multiple-choice",
    prompt: "Berapa rakaat sunnah rawatib yang disepakati setiap hari?",
    options: ["8", "10", "12", "14"],
    correctIndex: 2,
    explanation:
      "Dua belas rawatib ialah: 2 sebelum Subuh, 4 sebelum Dhuhur, 2 setelah Dhuhur, 2 setelah Maghrib, dan 2 setelah Isya (Sahih Muslim 728).",
  },
  {
    id: "rawatib-fajr",
    type: "multiple-choice",
    prompt: "Sebelum Subuh, sunnah yang ditekankan (mu'akkadah) ialah:",
    options: ["Tidak ada", "2 rakaat", "4 rakaat", "Hanya 2 rakaat setelahnya"],
    correctIndex: 1,
    explanation:
      "Dua rakaat sebelum Subuh adalah sunnah mu'akkadah — Nabi ﷺ tidak pernah meninggalkannya (Sahih al-Bukhari 1169; Sahih Muslim 724).",
  },
  {
    id: "rawatib-dhuhr",
    type: "multiple-choice",
    prompt: "Rawatib yang disepakati sekitar Dhuhur ialah:",
    options: [
      "2 sebelum, 2 setelah",
      "4 sebelum, 2 setelah",
      "4 sebelum, 4 setelah",
      "Hanya 2 sebelum",
    ],
    correctIndex: 1,
    explanation:
      "Empat sebelum Dhuhur dan dua setelahnya termasuk dua belas rawatib. Rakaat tambahan di luar ini adalah nafl yang dianjurkan, bukan rawatib tetap.",
  },
  {
    id: "asr-ghayr-muakkadah",
    type: "true-false",
    prompt:
      "Benar atau salah: Empat rakaat sebelum Ashar termasuk dalam dua belas rawatib harian yang tetap.",
    options: ["Benar", "Salah"],
    correctIndex: 1,
    explanation:
      "Empat sebelum Ashar adalah sunnah ghayr mu'akkadah (sangat dianjurkan) tetapi tidak termasuk dalam dua belas rawatib (Jami' at-Tirmidhi 430).",
  },
  {
    id: "witr-separate",
    type: "multiple-choice",
    prompt: "Mengapa Witir dipisahkan dalam kategori tersendiri di pelacak shalat?",
    options: [
      "Tidak disebutkan dalam hadis",
      "Hanafi menganggapnya wajib sementara jumhur menganggapnya sunnah mu'akkadah",
      "Selalu dilaksanakan sebelum Isya",
      "Tidak memiliki jumlah rakaat yang tetap",
    ],
    correctIndex: 1,
    explanation:
      "Witr sangat kuat dalilnya, tetapi ulama berbeda pendapat apakah ia wajib atau sunnah mu'akkadah — sehingga dilacak terpisah dari dua belas rawatib.",
  },
  {
    id: "jahri-fajr",
    type: "multiple-choice",
    prompt: "Dalam shalat Subuh berjamaah, imam membaca:",
    options: [
      "Diam di kedua rakaat",
      "Keras di kedua rakaat",
      "Keras hanya di rakaat pertama",
      "Diam di pertama, keras di kedua",
    ],
    correctIndex: 1,
    explanation:
      "Subuh dibaca keras (jahri) di kedua rakaat. Di belakang imam Anda mendengarkan dengan penuh perhatian.",
  },
  {
    id: "jahri-dhuhr-asr",
    type: "multiple-choice",
    prompt: "Dhuhur dan Ashar dalam jamaah dibaca:",
    options: [
      "Keras di semua rakaat",
      "Diam di semua rakaat",
      "Keras di dua pertama, diam setelahnya",
      "Diam di dua pertama, keras setelahnya",
    ],
    correctIndex: 1,
    explanation:
      "Dhuhur dan Ashar keduanya sirri (diam) — imam membaca pelan dan setiap jamaah membaca untuk dirinya sendiri.",
  },
  {
    id: "jahri-maghrib",
    type: "multiple-choice",
    prompt: "Dalam Maghrib, imam membaca keras pada:",
    options: [
      "Ketiga rakaat",
      "Hanya dua rakaat pertama",
      "Hanya rakaat ketiga",
      "Tidak ada — Maghrib sepenuhnya diam",
    ],
    correctIndex: 1,
    explanation:
      "Maghrib jahri di rakaat pertama dan kedua serta sirri di rakaat ketiga — pola panjang/pendek seperti shalat lainnya.",
  },
  {
    id: "jahri-isha",
    type: "multiple-choice",
    prompt: "Dalam Isya, kapan bacaan keras berhenti?",
    options: [
      "Setelah rakaat pertama",
      "Setelah rakaat kedua",
      "Setelah rakaat ketiga",
      "Tidak pernah — keempatnya keras",
    ],
    correctIndex: 1,
    explanation: "Isya dibaca keras di dua rakaat pertama dan diam di rakaat ketiga dan keempat.",
  },
  {
    id: "behind-imam-loud",
    type: "multiple-choice",
    prompt: "Dalam shalat keras di belakang imam, semua sepakat bahwa Anda harus:",
    options: [
      "Membaca surah lain keras bersama imam",
      "Mendengarkan dengan penuh perhatian dan tidak membaca surah lain keras",
      "Meninggalkan shalat setelah Al-Fatihah",
      "Hanya membaca di rakaat terakhir",
    ],
    correctIndex: 1,
    explanation:
      "Allah berfirman: 'Apabila Al-Qur'an dibacakan, maka dengarkanlah dengan seksama dan diamlah' (QS 7:204).",
  },
  {
    id: "fatihah-shafii",
    type: "multiple-choice",
    prompt: "Menurut mazhab Syafi'i, di belakang imam dalam shalat keras Anda:",
    options: [
      "Tidak membaca Al-Fatihah sama sekali",
      "Membaca Al-Fatihah di setiap rakaat",
      "Hanya membaca di rakaat yang diam",
      "Membaca keras bersama imam",
    ],
    correctIndex: 1,
    explanation:
      "Mazhab Syafi'i berpendapat bahwa membaca Al-Fatihah wajib bagi setiap jamaah di setiap rakaat, merujuk 'Tidak sah shalat bagi orang yang tidak membaca Pembukaan Kitab' (Sahih al-Bukhari 756).",
  },
  {
    id: "fatihah-hanafi-loud",
    type: "multiple-choice",
    prompt: "Menurut mazhab Hanafi, dalam shalat keras di belakang imam Anda:",
    options: [
      "Membaca Al-Fatihah pelan di setiap rakaat",
      "Mendengarkan dengan penuh perhatian dan tidak membaca Al-Fatihah",
      "Hanya membaca surah setelah Al-Fatihah",
      "Harus membaca Al-Fatihah keras",
    ],
    correctIndex: 1,
    explanation:
      "Pandangan Hanafi yang diandalkan adalah mendengarkan dalam shalat jahri; bacaan imam sudah mencukupi. Keempat mazhab Sunni adalah posisi yang sahih.",
  },
  {
    id: "first-two-surah",
    type: "multiple-choice",
    prompt: "Dalam dua rakaat pertama Dhuhur, Nabi ﷺ umumnya membaca:",
    options: [
      "Hanya Al-Fatihah",
      "Al-Fatihah dan surah lain",
      "Tidak ada — sepenuhnya diam",
      "Hanya tasbih",
    ],
    correctIndex: 1,
    explanation:
      "Abu Qatadah melaporkan bahwa Nabi ﷺ membaca Al-Fatihah dan surah lain di dua rakaat pertama Dhuhur dan Ashar, dan hanya Al-Fatihah di dua rakaat terakhir (Sahih al-Bukhari 776; Sahih Muslim 451).",
  },
  {
    id: "alone-fajr",
    type: "multiple-choice",
    prompt: "Saat shalat Subuh sendirian, sunnahnya:",
    options: [
      "Hanya membaca diam",
      "Membaca keras (meskipun diam tetap sah)",
      "Melewatkan surah setelah Al-Fatihah",
      "Hanya shalat satu rakaat",
    ],
    correctIndex: 1,
    explanation:
      "Sendirian Anda membaca isi yang sama seperti dalam jamaah; di Subuh, Maghrib, dan Isya sunnah membaca keras.",
  },
  {
    id: "awwabin-disputed",
    type: "true-false",
    prompt:
      "Benar atau salah: Enam rakaat tetap setelah Maghrib sebagai Salat al-Awwabin adalah sunnah yang mapan dengan kesepakatan ulama.",
    options: ["Benar", "Salah"],
    correctIndex: 1,
    explanation:
      "Nafl umum setelah Maghrib dianjurkan, tetapi penetapan tepat enam rakaat sebagai Awwabin diperselisihkan keasliannya — jangan disajikan sebagai sunnah tetap yang mapan.",
  },
];
