import type { HajjGuideSection } from "../../types/hajj-guide";
import type { DeepPartial } from "./localize";

// Malay translation overlay for the Learn Hajj & Umrah guide. Mirrors the order
// of HAJJ_GUIDE_SECTIONS in ../hajj-guide.ts (index-aligned); untranslated entries
// fall back to English. Only human-readable text is translated — ids and the
// section `kind` stay in the English source.

export const HAJJ_GUIDE_SECTIONS_MS: DeepPartial<HajjGuideSection>[] = [
  {
    day: "Sebelum berangkat",
    title: "Kewajiban dan syarat",
    summary: "Mengapa Haji diwajibkan, dan atas siapa ia menjadi wajib.",
    steps: [
      {
        title: "Rukun kelima",
        body: 'Haji adalah rukun Islam yang kelima, wajib sekali seumur hidup bagi setiap muslim yang mampu. Allah berfirman: "Dan (di antara) kewajiban manusia terhadap Allah adalah melaksanakan ibadat haji ke Baitullah, iaitu bagi orang yang mampu mengadakan perjalanan ke sana" (Al-Qur\\\'an 3:97). Perintah ini diserukan kepada seluruh manusia: "Dan serulah manusia untuk mengerjakan haji, pasti mereka akan datang kepadamu dengan berjalan kaki atau mengendarai setiap unta kurus" (Al-Qur\\\'an 22:27).',
      },
      {
        title: "Kemampuan (istita'ah)",
        body: "Haji hanya wajib bagi mereka yang mampu: sehat secara fisik untuk melakukan perjalanan, memiliki harta halal yang cukup untuk biaya perjalanan dan nafkah keluarga yang ditinggalkan, serta jalur yang aman dan terbuka. Siapa yang belum memiliki kemampuan tahun ini tidak berdosa jika menundanya hingga mampu.",
      },
      {
        title: "Perjalanan seorang wanita",
        body: "Mayoritas ulama berpenboleh bahawa seorang wanita bepergian untuk Haji bersama mahram (suami atau kerabat dekat yang tidak boleh dinikahi); sebahagian ulama belakangan membolehkan bepergian dalam rombongan wanita yang aman dan terpercaya. Ikutilah fatwa ulama tepercaya yang anda yakini serta ketentuan lembaga penyelenggara Haji anda.",
      },
    ],
  },
  {
    day: "Sebelum berangkat",
    title: "Tiga jenis Haji",
    summary: "Ifrad, Qiran, dan Tamattu' — pilih sebelum memasuki ihram.",
    steps: [
      {
        title: "Ifrad",
        body: "Jamaah berihram hanya untuk Haji, tidak melaksanakan Umrah secara terpisah, dan tidak wajib menyembelih hewan kurban kerananya. Ia tetap dalam ihram hingga tiba manasik Hari Nahr.",
      },
      {
        title: "Qiran",
        body: "Jamaah menggabungkan Umrah dan Haji dalam satu ihram, melaksanakan manasik Umrah, dan tetap berihram hingga Haji selesai. Sama seperti Tamattu', jenis ini mewajibkan penyembelihan hewan (hadyu).",
      },
      {
        title: "Tamattu'",
        body: "Jamaah melaksanakan Umrah secara lengkap pada bulan-bulan Haji, keluar dari ihram, lalu berihram kembali untuk Haji pada 8 Dzulhijjah. Inilah yang dilakukan oleh sebahagian besar jamaah; jenis ini mewajibkan penyembelihan hewan, atau berpuasa tiga hari selama Haji dan tujuh hari selepas pulang bagi yang tidak mampu (Al-Quran 2:196).",
      },
    ],
  },
  {
    day: "Sebelum berangkat",
    title: "Miqat dan Ihram",
    summary: "Tempat dimulainya keadaan suci ihram, dan apa sahaja yang dilarang di dalamnya.",
    steps: [
      {
        title: "Lima miqat",
        body: "Nabi ﷺ menetapkan lima miqat — batas-batas yang tidak boleh dilewati tanpa berihram terterlebih dulu: Dzul Hulaifah (untuk penduduk Madinah), Al-Juhfah (untuk penduduk Syam/Mesir), Qarnul Manazil (untuk penduduk Najd), Yalamlam (untuk penduduk Yaman), dan Dzatu 'Irq (untuk penduduk Irak). Mereka yang sudah berada di dalam batas-batas ini berihram dari tempat mereka berada.",
        location: "Miqat",
      },
      {
        title: "Apa itu ihram",
        body: "Ihram adalah keadaan suci yang dimasuki melalui niat dan talbiyah. Pria mengenakan dua lembar kain putih tanpa jahitan; wanita tetap mengenakan pakaian sopan seperti biasa. Ihram dimasuki selepas mandi (ghusl), dan bagi pria selepas memakai wangi-wangian pada tubuh (bukan pada pakaian) sebelum berihram.",
        location: "Miqat",
      },
      {
        title: "Larangan-larangan ihram",
        body: "Selama berihram, hindari: pakaian berjahit/pas badan dan menutup kepala (bagi pria), wangi-wangian, memotong rambut atau kuku, berburu binatang, melangsungkan atau melamar pernikahan, dan segala bentuk hubungan suami istri. Melanggar hal-hal ini boleh mewajibkan tebusan (fidyah), jadi patuhilah dengan saksama.",
        location: "Miqat",
      },
    ],
  },
  {
    title: "Umrah",
    summary: "Haji kecil — boleh dilaksanakan kapan sahaja sepanjang tahun.",
    steps: [
      {
        title: "Memasuki ihram",
        body: "Di miqat atau sebelumnya, mandilah (ghusl), kenakan pakaian ihram, niatkan Umrah, dan mulai bertalbiyah. Niat diucapkan dalam hati, dan keadaan suci ihram dimulai sejak saat itu.",
        location: "Miqat",
      },
      {
        title: "Membaca talbiyah",
        body: 'Ucapkan berulang-ulang "Labbaik Allahumma labbaik, labbaika la syarika laka labbaik…" selama perjalanan menuju Mekah — sebagai pernyataan bahawa anda hanya memenuhi panggilan Allah semata — dan lanjutkan hingga anda memulai tawaf.',
      },
      {
        title: "Tawaf mengelilingi Kaabah",
        body: 'Kelilingi Kaabah tujuh kali berlawanan arah jarum jam, dimulai dan diakhiri di sudut Hajar Aswad, di mana anda menciumnya, menyentuhnya, atau cukup mengisyaratkannya sambil bertakbir. Pria melakukan raml (berjalan cepat) pada tiga putaran pertama dan idtiba\' (membuka bahu kanan). Di antara Rukun Yamani dan Hajar Aswad, bacalah: "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka" (Al-Quran 2:201).',
        location: "Masjidil Haram",
      },
      {
        title: "Solat dua rakaat",
        body: "Selepas tawaf, solatlah dua rakaat di belakang Maqam Ibrahim jika memungkinkan (atau di mana sahaja di dalam masjid bila ramai), lalu minumlah air Zamzam sepuasnya, kerana Nabi ﷺ bersabda bahawa air Zamzam sesuai dengan niat orang yang meminumnya.",
        location: "Masjidil Haram",
      },
      {
        title: "Sa'i antara Shafa & Marwah",
        body: 'Berjalanlah tujuh kali antara Shafa dan Marwah, dimulai dari Shafa, sebagai peringatan atas pencarian air oleh Hajar untuk putranya Isma\'il. Allah berfirman: "Sesungguhnya Shafa dan Marwah adalah sebahagian dari syiar-syiar Allah" (Al-Quran 2:158). Di Shafa, menghadaplah ke Kaabah dan angkat kedua tangan untuk berdoa dan bertakbir; pria berlari-lari kecil di antara dua tanda hijau.',
        location: "Masjidil Haram",
      },
      {
        title: "Halq atau taqsir",
        body: "Pria mencukur habis rambut kepala (halq, yang lebih besar pahalanya) atau memotongnya rata (taqsir); wanita mengumpulkan rambutnya dan memotong sepanjang ujung jari. Dengan ini Umrah selesai dan larangan-larangan ihram pun berakhir.",
      },
    ],
  },
  {
    day: "8 Dzulhijjah",
    title: "Hari Tarwiyah — Mina",
    summary: "Ibadat Haji dimulai; hari ini dihabiskan di Mina.",
    steps: [
      {
        title: "Berihram untuk Haji",
        body: "Niatkan Haji dan berihram kembali (bagi jamaah tamattu' dari tempat tinggalnya di Mekah), lalu ucapkan kembali talbiyah. Ini mengawali kembali keadaan suci ihram, sehingga larangan-larangan ihram berlaku lagi.",
      },
      {
        title: "Berangkat ke Mina",
        body: "Pergilah ke Mina dan solat Dzuhur, Ashar, Maghrib, Isya, serta Subuh keesokan harinya, masing-masing diqashar menjadi dua rakaat pada waktunya, mengikuti sunnah Nabi ﷺ. Habiskan siang dan malam dalam ibadat, menantikan wukuf di Arafah.",
        location: "Mina",
      },
    ],
  },
  {
    day: "9 Dzulhijjah",
    title: "Hari Arafah",
    summary: "Hari teragung dalam Haji — wukuf di Arafah.",
    steps: [
      {
        title: "Wukuf di Arafah",
        body: 'Tetaplah berada di dalam batas Arafah sejak tergelincirnya matahari hingga terbenam, dalam doa, zikir, dan taubat. Nabi ﷺ bersabda, "Haji adalah Arafah" (Tirmidzi 889, Abu Dawud 1949, hasan sahih): siapa yang tidak sempat wukuf ini maka Hajinya tidak sah. Menghadaplah ke kiblat, angkat kedua tangan, dan bermohonlah kepada Allah dengan sungguh-sungguh — inilah hari teragung untuk berdoa.',
        location: "Arafah",
      },
      {
        title: "Menjamak Dzuhur & Ashar",
        body: "Solat Dzuhur dan Ashar dengan dijamak dan diqashar pada waktu Dzuhur (jamak taqdim), lalu curahkan sisa hari sepenuhnya untuk berdoa, bukan untuk solat sunnah tambahan.",
        location: "Arafah",
      },
      {
        title: "Berpindah ke Muzdalifah",
        body: "Selepas matahari terbenam, berjalanlah dengan tenang menuju Muzdalifah, jamak solat Maghrib dan Isya (Isya diqashar), bermalamlah di sana, dan kumpulkan kerikil untuk melempar jumrah. Orang lemah dan wanita boleh berangkat ke Mina selepas tengah malam untuk menghindari kepadatan.",
        location: "Muzdalifah",
      },
    ],
  },
  {
    day: "10 Dzulhijjah",
    title: "Hari Nahr — Idul Adha",
    summary: "Melempar jumrah, menyembelih kurban, dan tawaf utama.",
    steps: [
      {
        title: "Melempar Jumrah Aqabah",
        body: 'Kembalilah menuju Mina dan lemparkan tujuh kerikil ke tiang besar (Jumrah Aqabah), mengucapkan "Allahu akbar" pada setiap lemparan. Ini mengenang penolakan Ibrahim terhadap Setan dan merupakan manasik pertama pada hari ini.',
        location: "Mina",
      },
      {
        title: "Menyembelih kurban",
        body: "Sembelihlah hewan kurban sendiri, atau percayakan kepada lembaga tepercaya, seperti diwajibkan bagi jamaah tamattu' dan qiran (Al-Quran 2:196). Dagingnya dimakan dan sebahagian dibagikan kepada orang miskin.",
      },
      {
        title: "Halq atau taqsir",
        body: "Cukurlah habis (halq) atau potong rata (taqsir) rambut; wanita memotong sepanjang ujung jari. Selepas melempar jumrah dan mencukur rambut, berlaku tahalul pertama (tahalul awal) — seluruh larangan ihram berakhir kecuali hubungan suami istri.",
      },
      {
        title: "Tawaf Ifadah",
        body: "Pergilah ke Mekah untuk melaksanakan Tawaf Ifadah — salah satu rukun Haji — dan sa'i (bagi jamaah tamattu'). Dengan ini seseorang benar-benar bebas dari ihram, dan siapa yang menjauhi kekejian dan dosa \"kembali seperti hari ketika ibunya melahirkannya\" (Bukhari 1521, Muslim 1350).",
        location: "Masjidil Haram",
      },
    ],
  },
  {
    day: "11–13 Dzulhijjah",
    title: "Hari-hari Tasyrik — Mina",
    summary: "Bermalam di Mina dan melempar tiga jumrah setiap hari.",
    steps: [
      {
        title: "Bermalam di Mina",
        body: "Bermalamlah pada malam ke-11, ke-12 (dan ke-13 bagi yang tidak menyegerakan kepulangan) di Mina. Hari-hari ini adalah hari makan, minum, dan mengingat Allah, dihabiskan dalam ibadat dan takbir.",
        location: "Mina",
      },
      {
        title: "Melempar tiga jumrah",
        body: "Setiap sore selepas Dzuhur, lemparkan tujuh kerikil pada masing-masing dari tiga tiang secara berurutan — yang kecil, lalu yang tengah, lalu yang besar — dengan takbir pada setiap lemparan. Siapa yang ingin menyegerakan kepulangan boleh berangkat selepas melempar jumrah pada hari ke-12 (Al-Quran 2:203).",
        location: "Mina",
      },
      {
        title: "Tawaf Wada'",
        body: "Sebelum meninggal duniakan Mekah, laksanakan Tawaf Wada' sebagai manasik terakhir, supaya amal terakhir Haji anda bersama Baitullah. Wanita yang sedang haid dibebaskan dari kewajiban ini.",
        location: "Masjidil Haram",
      },
    ],
  },
  {
    day: "Penyempurnaan dan hukum",
    title: "Rukun, kewajiban, dan pahala",
    summary: "Apa yang menyahkan Haji, apa yang boleh ditebus, dan pahalanya.",
    steps: [
      {
        title: "Rukun (arkan)",
        body: "Rukun adalah inti dari Haji: berihram, wukuf di Arafah, Tawaf Ifadah, dan sa'i (menurut penboleh mayoritas ulama). Jika salah satu rukun tertinggal, Hajinya tidak sah dan tidak boleh ditebus dengan kurban — ia harus mengulanginya.",
      },
      {
        title: "Kewajiban (wajibat)",
        body: "Kewajiban meliputi berihram dari miqat, bermalam di Muzdalifah, melempar jumrah, bermalam di Mina pada hari-hari Tasyrik, dan Tawaf Wada'. Meninggal duniakan salah satu kewajiban tidak membatalkan Haji, namun harus ditebus dengan dam (penyembelihan hewan). Mazhab-mazhab berbeda penboleh mengenai rincian daftarnya; konsultasikan dengan ulama yang kompeten.",
      },
      {
        title: "Pahala Haji mabrur",
        body: 'Haji yang diterima (Haji mabrur) — yang bersih dari dosa dan dilaksanakan dengan tulus — menghapuskan dosa-dosa yang telah lalu dan pahalanya adalah syurga itu sendiri. Nabi ﷺ bersabda, "Haji mabrur tidak ada balasannya kecuali syurga" (Bukhari 1773, Muslim 1349). Berusahalah menjaga akhlak yang baik dan kelembutan sepanjang perjalanan.',
      },
      {
        title: "Panduan praktis, bukan fatwa",
        body: "Ini adalah gambaran praktis untuk membantu anda melaksanakan manasik secara berurutan. Mazhab-mazhab berbeda penboleh secara terhormat dalam banyak rincian, dan keadaan setiap jamaah berbeda-beda — selalu konsultasikan kepada ulama yang kompeten atau pembimbing Haji resmi anda untuk hukum-hukum khusus dan kasus-kasus yang tidak terduga.",
      },
    ],
  },
  {
    day: "Sebelum berangkat",
    title: "Visa dan pendaftaran",
    summary:
      "Bagaimana jemaah mendaftar dan mendapatkan visa Haji atau Umrah melalui saluran rasmi.",
    steps: [
      {
        title: "Platform Nusuk",
        body: "Nusuk (nusuk.sa) ialah platform rasmi Arab Saudi untuk Haji dan Umrah — digunakan untuk menempah visa, penginapan, pengangkutan, dan pakej lawatan berdaftar. Gunakan hanya Nusuk atau agensi yang dilesenkan melaluinya; orang tengah tidak rasmi merupakan sumber lazim penipuan dan perjalanan yang dibatalkan.",
      },
      {
        title: "Visa Haji dan kuota negara",
        body: "Setiap negara menerima kuota Haji tahunan, jadi kebanyakan jemaah membuat permohonan melalui badan Haji negara masing-masing atau ejen tempatan yang berlesen berbanding memohon secara individu. Mohonlah lebih awal pada tahun musim Haji dibuka — kuota dan slot pakej akan penuh berbulan-bulan lebih awal.",
      },
      {
        title: "Visa Umrah",
        body: "Berbeza dengan Haji, Umrah tidak mempunyai kuota dan boleh dilakukan pada bila-bila masa sepanjang tahun. Kebanyakan warganegara boleh memohon visa Umrah terus melalui Nusuk atau ejen pelancongan yang diluluskan, biasanya bersama tempahan penerbangan dan hotel.",
      },
    ],
  },
  {
    day: "Sebelum berangkat",
    title: "Senarai barang bawaan",
    summary: "Keperluan praktikal yang perlu dibawa sebelum bertolak.",
    steps: [
      {
        title: "Pakaian ihram",
        body: "Lelaki harus membawa sekurang-kurangnya dua set pakaian ihram tanpa jahitan (kain bawah dan kain atas) serta tali pinggang ihram yang lebar dan bukan kulit untuk wang dan dokumen. Wanita harus membawa pakaian luar yang longgar, sopan, dan tanpa hiasan.",
      },
      {
        title: "Kasut dan keselesaan",
        body: "Selipar terbuka yang mudah dipakai dan ditanggalkan amat penting, kerana kasut yang menutup buku lali dilarang dalam ihram bagi lelaki. Bawalah beg galas ringan, botol air yang boleh diisi semula, dan sejadah kecil untuk menunggu yang lama.",
      },
      {
        title: "Alat mandian tanpa wangian",
        body: "Bawalah sabun tanpa wangian, losyen matahari, dan tisu basah — produk berwangian dilarang dalam ihram. Kit pertolongan cemas yang padat, sebarang ubat peribadi berserta nota doktor, dan plaster lelasan berbaloi dengan berat tambahan memandangkan banyaknya berjalan kaki.",
      },
      {
        title: "Dokumen dan keperluan penting",
        body: "Simpan pasport, cetakan visa, sijil vaksinasi (vaksin meningitis lazimnya diperlukan), dan nombor kecemasan dalam beg nipis yang dipakai di bawah pakaian. Bank kuasa mudah alih serta SIM tempatan atau eSIM memudahkan pergerakan di tempat sesak dengan banyak.",
      },
    ],
  },
  {
    day: "Sebelum berangkat",
    title: "Direktori tapak suci",
    summary: "Nota praktikal ringkas tentang tapak-tapak utama yang akan anda lawati.",
    steps: [
      {
        title: "Masjidil Haram, Makkah",
        body: "Masjid Agung yang mengelilingi Kaabah — tapak tawaf dan sa'i. Ia beroperasi sepanjang masa; jangkakan kesesakan yang amat tinggi berhampiran Hajar Aswad dan semasa lima solat harian, terutamanya pada sepuluh malam terakhir Ramadan dan hari-hari Haji.",
        location: "Makkah",
      },
      {
        title: "Masjid Nabawi, Madinah",
        body: "Masjid Nabi ﷺ, tempat Raudhah dan tempat pengebumian baginda, bukan sebahagian daripada Haji itu sendiri tetapi hampir semua jemaah mengunjungi Madinah sebelum atau selepas Haji. Memasuki Raudhah memerlukan pas masuk bermasa yang ditempah melalui Nusuk atau aplikasi Raudhah.",
        location: "Madinah",
      },
      {
        title: "Mina",
        body: "Bandar khemah beberapa kilometer dari Makkah tempat jemaah menghabiskan malam 8, 11, 12 (dan 13) Dzulhijjah. Kem khemah berhawa dingin dan kalis kebakaran ditentukan oleh operator pelancongan; jangkakan kemudahan kongsi yang asas dan berjalan jauh ke Jamarat.",
        location: "Mina",
      },
      {
        title: "Arafah",
        body: "Dataran terbuka kira-kira 20km dari Makkah, tapak rukun Haji yang paling penting — wukuf pada 9 Dzulhijjah. Struktur naungan dan titik air disediakan, tetapi kepanasan siang amat tinggi; hidrasi dan perlindungan matahari amat penting.",
        location: "Arafah",
      },
      {
        title: "Muzdalifah",
        body: "Kawasan terbuka antara Arafah dan Mina tempat jemaah menghabiskan malam 9–10 Dzulhijjah di bawah langit terbuka dan mengumpul batu kecil untuk melontar jumrah. Kemudahan sengaja dibuat minimum — bawalah tikar dan berpakaianlah untuk udara malam yang lebih sejuk.",
        location: "Muzdalifah",
      },
    ],
  },
  {
    day: "Sebelum berangkat",
    title: "Sumber rasmi",
    summary: "Di mana untuk mencari maklumat rasmi yang boleh dipercayai dan terkini.",
    steps: [
      {
        title: "Nusuk (nusuk.sa)",
        body: "Portal dan aplikasi rasmi Kementerian Haji dan Umrah Saudi untuk visa, pakej yang diakreditasi, permit lawatan Raudhah, dan panduan kesesakan serta pengangkutan masa nyata — tempat pertama untuk sebarang soalan rasmi.",
      },
      {
        title: "Badan Haji negara anda",
        body: "Kebanyakan negara mempunyai badan Haji negara atau pejabat kementerian yang menguruskan kuota tahunan, menyemak ejen tempatan, dan menerbitkan jadual berlepas serta keperluan kesihatan — semaklah sebelum menempah melalui mana-mana ejen persendirian.",
      },
      {
        title: "Visit Saudi (visitsaudi.com)",
        body: "Laman pelancongan rasmi Kerajaan itu mengandungi keperluan kemasukan, maklumat e-visa untuk warganegara yang layak, dan nasihat perjalanan praktikal untuk Makkah, Madinah, dan perjalanan seterusnya di dalam Arab Saudi.",
      },
      {
        title: "Sahkan sebelum membayar",
        body: "Tempahlah hanya melalui agensi yang disenaraikan di Nusuk atau badan Haji negara anda. Jika tawaran kelihatan terlalu murah atau orang tengah meminta bayaran di luar saluran rasmi, anggaplah ia sebagai tanda amaran dan sahkan terus melalui portal kementerian.",
      },
    ],
  },
];
