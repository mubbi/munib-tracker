import type { HajjGuideSection } from "../../types/hajj-guide";
import type { DeepPartial } from "./localize";

// Indonesian translation overlay for the Learn Hajj & Umrah guide. Mirrors the order
// of HAJJ_GUIDE_SECTIONS in ../hajj-guide.ts (index-aligned); untranslated entries
// fall back to English. Only human-readable text is translated — ids and the
// section `kind` stay in the English source.
export const HAJJ_GUIDE_SECTIONS_ID: DeepPartial<HajjGuideSection>[] = [
  {
    day: "Sebelum berangkat",
    title: "Kewajiban dan syarat",
    summary: "Mengapa Haji diwajibkan, dan atas siapa ia menjadi wajib.",
    steps: [
      {
        title: "Rukun kelima",
        body: 'Haji adalah rukun Islam yang kelima, wajib sekali seumur hidup bagi setiap muslim yang mampu. Allah berfirman: "Dan (di antara) kewajiban manusia terhadap Allah adalah melaksanakan ibadah haji ke Baitullah, yaitu bagi orang yang mampu mengadakan perjalanan ke sana" (Al-Qur\\\'an 3:97). Perintah ini diserukan kepada seluruh manusia: "Dan serulah manusia untuk mengerjakan haji, niscaya mereka akan datang kepadamu dengan berjalan kaki atau mengendarai setiap unta kurus" (Al-Qur\\\'an 22:27).',
      },
      {
        title: "Kemampuan (istita'ah)",
        body: "Haji hanya wajib bagi mereka yang mampu: sehat secara fisik untuk melakukan perjalanan, memiliki harta halal yang cukup untuk biaya perjalanan dan nafkah keluarga yang ditinggalkan, serta jalur yang aman dan terbuka. Siapa yang belum memiliki kemampuan tahun ini tidak berdosa jika menundanya hingga mampu.",
      },
      {
        title: "Perjalanan seorang wanita",
        body: "Mayoritas ulama berpendapat bahwa seorang wanita bepergian untuk Haji bersama mahram (suami atau kerabat dekat yang tidak boleh dinikahi); sebagian ulama belakangan membolehkan bepergian dalam rombongan wanita yang aman dan terpercaya. Ikutilah fatwa ulama tepercaya yang Anda yakini serta ketentuan lembaga penyelenggara Haji Anda.",
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
        body: "Jamaah berihram hanya untuk Haji, tidak melaksanakan Umrah secara terpisah, dan tidak wajib menyembelih hewan kurban karenanya. Ia tetap dalam ihram hingga tiba manasik Hari Nahr.",
      },
      {
        title: "Qiran",
        body: "Jamaah menggabungkan Umrah dan Haji dalam satu ihram, melaksanakan manasik Umrah, dan tetap berihram hingga Haji selesai. Sama seperti Tamattu', jenis ini mewajibkan penyembelihan hewan (hadyu).",
      },
      {
        title: "Tamattu'",
        body: "Jamaah melaksanakan Umrah secara lengkap pada bulan-bulan Haji, keluar dari ihram, lalu berihram kembali untuk Haji pada 8 Dzulhijjah. Inilah yang dilakukan oleh sebagian besar jamaah; jenis ini mewajibkan penyembelihan hewan, atau berpuasa tiga hari selama Haji dan tujuh hari setelah pulang bagi yang tidak mampu (Al-Qur'an 2:196).",
      },
    ],
  },
  {
    day: "Sebelum berangkat",
    title: "Miqat dan Ihram",
    summary: "Tempat dimulainya keadaan suci ihram, dan apa saja yang dilarang di dalamnya.",
    steps: [
      {
        title: "Lima miqat",
        body: "Nabi ﷺ menetapkan lima miqat — batas-batas yang tidak boleh dilewati tanpa berihram terlebih dahulu: Dzul Hulaifah (untuk penduduk Madinah), Al-Juhfah (untuk penduduk Syam/Mesir), Qarnul Manazil (untuk penduduk Najd), Yalamlam (untuk penduduk Yaman), dan Dzatu 'Irq (untuk penduduk Irak). Mereka yang sudah berada di dalam batas-batas ini berihram dari tempat mereka berada.",
        location: "Miqat",
      },
      {
        title: "Apa itu ihram",
        body: "Ihram adalah keadaan suci yang dimasuki melalui niat dan talbiyah. Pria mengenakan dua lembar kain putih tanpa jahitan; wanita tetap mengenakan pakaian sopan seperti biasa. Ihram dimasuki setelah mandi (ghusl), dan bagi pria setelah memakai wangi-wangian pada tubuh (bukan pada pakaian) sebelum berihram.",
        location: "Miqat",
      },
      {
        title: "Larangan-larangan ihram",
        body: "Selama berihram, hindari: pakaian berjahit/pas badan dan menutup kepala (bagi pria), wangi-wangian, memotong rambut atau kuku, berburu binatang, melangsungkan atau melamar pernikahan, dan segala bentuk hubungan suami istri. Melanggar hal-hal ini bisa mewajibkan tebusan (fidyah), jadi patuhilah dengan saksama.",
        location: "Miqat",
      },
    ],
  },
  {
    title: "Umrah",
    summary: "Haji kecil — dapat dilaksanakan kapan saja sepanjang tahun.",
    steps: [
      {
        title: "Memasuki ihram",
        body: "Di miqat atau sebelumnya, mandilah (ghusl), kenakan pakaian ihram, niatkan Umrah, dan mulai bertalbiyah. Niat diucapkan dalam hati, dan keadaan suci ihram dimulai sejak saat itu.",
        location: "Miqat",
      },
      {
        title: "Membaca talbiyah",
        body: 'Ucapkan berulang-ulang "Labbaik Allahumma labbaik, labbaika la syarika laka labbaik…" selama perjalanan menuju Makkah — sebagai pernyataan bahwa Anda hanya memenuhi panggilan Allah semata — dan lanjutkan hingga Anda memulai tawaf.',
      },
      {
        title: "Tawaf mengelilingi Ka'bah",
        body: "Kelilingi Ka'bah tujuh kali berlawanan arah jarum jam, dimulai dan diakhiri di sudut Hajar Aswad, di mana Anda menciumnya, menyentuhnya, atau cukup mengisyaratkannya sambil bertakbir. Pria melakukan raml (berjalan cepat) pada tiga putaran pertama dan idtiba' (membuka bahu kanan). Di antara Rukun Yamani dan Hajar Aswad, bacalah: \"Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka\" (Al-Qur'an 2:201).",
        location: "Masjidil Haram",
      },
      {
        title: "Shalat dua rakaat",
        body: "Setelah tawaf, shalatlah dua rakaat di belakang Maqam Ibrahim jika memungkinkan (atau di mana saja di dalam masjid bila ramai), lalu minumlah air Zamzam sepuasnya, karena Nabi ﷺ bersabda bahwa air Zamzam sesuai dengan niat orang yang meminumnya.",
        location: "Masjidil Haram",
      },
      {
        title: "Sa'i antara Shafa & Marwah",
        body: "Berjalanlah tujuh kali antara Shafa dan Marwah, dimulai dari Shafa, sebagai peringatan atas pencarian air oleh Hajar untuk putranya Isma'il. Allah berfirman: \"Sesungguhnya Shafa dan Marwah adalah sebagian dari syiar-syiar Allah\" (Al-Qur'an 2:158). Di Shafa, menghadaplah ke Ka'bah dan angkat kedua tangan untuk berdoa dan bertakbir; pria berlari-lari kecil di antara dua tanda hijau.",
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
    summary: "Ibadah Haji dimulai; hari ini dihabiskan di Mina.",
    steps: [
      {
        title: "Berihram untuk Haji",
        body: "Niatkan Haji dan berihram kembali (bagi jamaah tamattu' dari tempat tinggalnya di Makkah), lalu ucapkan kembali talbiyah. Ini mengawali kembali keadaan suci ihram, sehingga larangan-larangan ihram berlaku lagi.",
      },
      {
        title: "Berangkat ke Mina",
        body: "Pergilah ke Mina dan shalat Dzuhur, Ashar, Maghrib, Isya, serta Subuh keesokan harinya, masing-masing diqashar menjadi dua rakaat pada waktunya, mengikuti sunnah Nabi ﷺ. Habiskan siang dan malam dalam ibadah, menantikan wukuf di Arafah.",
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
        body: "Shalat Dzuhur dan Ashar dengan dijamak dan diqashar pada waktu Dzuhur (jamak taqdim), lalu curahkan sisa hari sepenuhnya untuk berdoa, bukan untuk shalat sunnah tambahan.",
        location: "Arafah",
      },
      {
        title: "Berpindah ke Muzdalifah",
        body: "Setelah matahari terbenam, berjalanlah dengan tenang menuju Muzdalifah, jamak shalat Maghrib dan Isya (Isya diqashar), bermalamlah di sana, dan kumpulkan kerikil untuk melempar jumrah. Orang lemah dan wanita boleh berangkat ke Mina setelah tengah malam untuk menghindari kepadatan.",
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
        body: "Sembelihlah hewan kurban sendiri, atau percayakan kepada lembaga tepercaya, sebagaimana diwajibkan bagi jamaah tamattu' dan qiran (Al-Qur'an 2:196). Dagingnya dimakan dan sebagian dibagikan kepada orang miskin.",
      },
      {
        title: "Halq atau taqsir",
        body: "Cukurlah habis (halq) atau potong rata (taqsir) rambut; wanita memotong sepanjang ujung jari. Setelah melempar jumrah dan mencukur rambut, berlaku tahalul pertama (tahalul awal) — seluruh larangan ihram berakhir kecuali hubungan suami istri.",
      },
      {
        title: "Tawaf Ifadah",
        body: "Pergilah ke Makkah untuk melaksanakan Tawaf Ifadah — salah satu rukun Haji — dan sa'i (bagi jamaah tamattu'). Dengan ini seseorang benar-benar bebas dari ihram, dan siapa yang menjauhi kekejian dan dosa \"kembali seperti hari ketika ibunya melahirkannya\" (Bukhari 1521, Muslim 1350).",
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
        body: "Bermalamlah pada malam ke-11, ke-12 (dan ke-13 bagi yang tidak menyegerakan kepulangan) di Mina. Hari-hari ini adalah hari makan, minum, dan mengingat Allah, dihabiskan dalam ibadah dan takbir.",
        location: "Mina",
      },
      {
        title: "Melempar tiga jumrah",
        body: "Setiap sore setelah Dzuhur, lemparkan tujuh kerikil pada masing-masing dari tiga tiang secara berurutan — yang kecil, lalu yang tengah, lalu yang besar — dengan takbir pada setiap lemparan. Siapa yang ingin menyegerakan kepulangan boleh berangkat setelah melempar jumrah pada hari ke-12 (Al-Qur'an 2:203).",
        location: "Mina",
      },
      {
        title: "Tawaf Wada'",
        body: "Sebelum meninggalkan Makkah, laksanakan Tawaf Wada' sebagai manasik terakhir, agar amal terakhir Haji Anda bersama Baitullah. Wanita yang sedang haid dibebaskan dari kewajiban ini.",
        location: "Masjidil Haram",
      },
    ],
  },
  {
    day: "Penyempurnaan dan hukum",
    title: "Rukun, kewajiban, dan pahala",
    summary: "Apa yang menyahkan Haji, apa yang dapat ditebus, dan pahalanya.",
    steps: [
      {
        title: "Rukun (arkan)",
        body: "Rukun adalah inti dari Haji: berihram, wukuf di Arafah, Tawaf Ifadah, dan sa'i (menurut pendapat mayoritas ulama). Jika salah satu rukun tertinggal, Hajinya tidak sah dan tidak dapat ditebus dengan kurban — ia harus mengulanginya.",
      },
      {
        title: "Kewajiban (wajibat)",
        body: "Kewajiban meliputi berihram dari miqat, bermalam di Muzdalifah, melempar jumrah, bermalam di Mina pada hari-hari Tasyrik, dan Tawaf Wada'. Meninggalkan salah satu kewajiban tidak membatalkan Haji, namun harus ditebus dengan dam (penyembelihan hewan). Mazhab-mazhab berbeda pendapat mengenai rincian daftarnya; konsultasikan dengan ulama yang kompeten.",
      },
      {
        title: "Pahala Haji mabrur",
        body: 'Haji yang diterima (Haji mabrur) — yang bersih dari dosa dan dilaksanakan dengan tulus — menghapuskan dosa-dosa yang telah lalu dan pahalanya adalah surga itu sendiri. Nabi ﷺ bersabda, "Haji mabrur tidak ada balasannya kecuali surga" (Bukhari 1773, Muslim 1349). Berusahalah menjaga akhlak yang baik dan kelembutan sepanjang perjalanan.',
      },
      {
        title: "Panduan praktis, bukan fatwa",
        body: "Ini adalah gambaran praktis untuk membantu Anda melaksanakan manasik secara berurutan. Mazhab-mazhab berbeda pendapat secara terhormat dalam banyak rincian, dan keadaan setiap jamaah berbeda-beda — selalu konsultasikan kepada ulama yang kompeten atau pembimbing Haji resmi Anda untuk hukum-hukum khusus dan kasus-kasus yang tidak terduga.",
      },
    ],
  },
];
