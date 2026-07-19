import type { PilgrimageChecklistItem } from "../../types/hajj-guide";
import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// ID overlay for Hajj & Umrah Learn topics + rite checklists.
// Index-aligned with English sources; untranslated entries fall back to English.
// Only human-readable text is translated — ids, routes, citations stay English.

export const HAJJ_GUIDE_TOPICS_ID: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Ganjaran Haji yang diterima (mabrur)",
    summary: "Haji mabrur menghapus dosa dan ganjaran hujungnya Surga.",
    body: [
      "Abu Hurairah meriwayatkan bahwa Rasulullah ﷺ bersabda: 'Barangsiapa menunaikan haji karena Allah dan tidak bercampur dengan isteri serta tidak berbuat dosa, maka ia kembali seperti pada hari ibunya melahirkannya' (Shahih al-Bukhari 1521; Shahih Muslim 1350).",
      "Beliau juga bersabda: 'Haji mabrur tidak ada balasannya kecuali Surga' (Shahih al-Bukhari 1773; Shahih Muslim 1349). Penerimaan haji terkait dengan keikhlasan dan menjaga ibadah haji dari kekejian dan perbuatan dosa — bukan sekadar menyelesaikan langkah lahiriah.",
    ],
    hadith: [
      {
        excerpt:
          "Barangsiapa menunaikan haji karena Allah dan tidak bercampur dengan isteri serta tidak berbuat dosa, maka ia kembali seperti pada hari ibunya melahirkannya.",
      },
      {
        excerpt:
          "Barangsiapa menunaikan haji karena Allah dan tidak bercampur dengan isteri serta tidak berbuat dosa, maka ia kembali seperti pada hari ibunya melahirkannya.",
      },
      {
        excerpt: "Haji mabrur tidak ada balasannya kecuali Surga.",
      },
      {
        excerpt: "Haji mabrur tidak ada balasannya kecuali Surga.",
      },
    ],
    actions: [
      "Niatkan haji semata-mata karena Allah — jagalah lidah dan akhlak sepanjang perjalanan.",
      "Gunakan daftar periksa Haji dalam aplikasi hanya sebagai pengingat; jaga hati tetap fokus pada penerimaan.",
    ],
    appLinks: [
      {
        label: "Daftar periksa manasik Haji",
      },
    ],
  },
  {
    title: "Keutamaan Umrah",
    summary: "Umrah ke Umrah menghapus dosa di antara keduanya.",
    body: [
      "Abu Hurairah meriwayatkan bahwa Nabi ﷺ bersabda: 'Umrah ke Umrah menjadi penghapus dosa di antara keduanya, dan haji mabrur tidak ada balasannya kecuali Surga' (Shahih al-Bukhari 1773; Shahih Muslim 1349).",
      "Umrah dapat dilaksanakan kapan saja sepanjang tahun. Lebih singkat daripada Haji namun tetap ibadah besar: ihram, tawaf, sa'i, dan mencukur atau memotong rambut.",
    ],
    hadith: [
      {
        excerpt:
          "Umrah ke Umrah menjadi penghapus dosa di antara keduanya, dan haji mabrur tidak ada balasannya kecuali Surga.",
      },
      {
        excerpt:
          "Umrah ke Umrah menjadi penghapus dosa di antara keduanya, dan haji mabrur tidak ada balasannya kecuali Surga.",
      },
    ],
    actions: ["Buka daftar periksa Umrah saat Anda siap menjalani manasik secara berurutan."],
    appLinks: [
      {
        label: "Daftar periksa manasik Umrah",
      },
    ],
  },
  {
    title: "Hari Arafah",
    summary: "Wukuf di Arafah adalah inti Haji — dan hari yang agung untuk doa.",
    body: [
      "Abd ar-Rahman ibn Ya'mar meriwayatkan bahwa Nabi ﷺ bersabda: 'Haji adalah Arafah' (Sunan Abi Dawud 1949; Jami' at-Tirmidhi 889). Barangsiapa melewatkan wukuf dalam batas Arafah pada waktunya, telah melewatkan haji tahun itu.",
      "Bagi yang tidak sedang berhaji, puasa pada Hari Arafah adalah amalan yang sangat dianjurkan: Abu Qatadah meriwayatkan bahwa puasa Arafah menghapus dosa setahun yang lalu dan setahun yang akan datang (Shahih Muslim 1162). Jemaah haji sendiri tidak berpuasa agar dapat mengisi hari itu dengan doa.",
    ],
    hadith: [
      {
        excerpt: "Haji adalah Arafah.",
      },
      {
        excerpt: "Haji adalah Arafah.",
      },
      {
        excerpt:
          "Puasa pada Hari Arafah, aku berharap dari Allah, menghapus dosa setahun sebelumnya dan setahun sesudahnya.",
      },
    ],
  },
  {
    title: "Haji — rukun kelima",
    summary: "Wajib sekali seumur hidup bagi setiap Muslim yang mampu.",
    body: [
      'Allah berfirman: "Dan (kewajiban) manusia terhadap Allah adalah mengerjakan haji ke Baitullah — bagi orang yang mampu mengadakan perjalanan ke sana. Barangsiapa kafir, maka sesungguhnya Allah Maha Kaya (dari segala sesuatu) dari seluruh alam" (Al-Qur\'an 3:97).',
      'Seruan itu disampaikan kepada seluruh manusia: "Dan serulah manusia untuk mengerjakan haji, niscaya mereka akan datang kepadamu dengan berjalan kaki dan mengendarai unta yang kurus; mereka datang dari segenap penjuru yang jauh" (Al-Qur\'an 22:27).',
      "Ibn Umar meriwayatkan bahwa Nabi ﷺ bersabda Islam dibangun atas lima hal: syahadat, salat, zakat, puasa Ramadan, dan haji ke Baitullah bagi yang mampu (Shahih al-Bukhari 8; Shahih Muslim 16). Ulama sepakat haji wajib sekali seumur hidup apabila syarat terpenuhi; mengulanginya adalah keutamaan sunnah.",
    ],
    quran: [
      {
        excerpt:
          "Dan (kewajiban) manusia terhadap Allah adalah mengerjakan haji ke Baitullah — bagi orang yang mampu mengadakan perjalanan ke sana...",
      },
      {
        excerpt:
          "Dan serulah manusia untuk mengerjakan haji, niscaya mereka akan datang kepadamu dengan berjalan kaki dan mengendarai unta yang kurus...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Islam dibangun atas lima: syahadat bahwa tidak ada ilah selain Allah dan Muhammad adalah utusan Allah, mendirikan salat, menunaikan zakat, puasa Ramadan, dan haji ke Baitullah bagi yang mampu.",
      },
      {
        excerpt:
          "Islam dibangun atas lima... dan haji ke Baitullah bagi yang mampu mengadakan perjalanan ke sana.",
      },
    ],
  },
  {
    title: "Kemampuan (istita'ah)",
    summary: "Kesehatan, harta halal, dan jalur aman — tanpa ini, Haji belum wajib.",
    body: [
      "Syarat dalam Al-Qur'an 3:97 adalah kemampuan (istita'ah). Ulama klasik merangkumnya sebagai: kesehatan jasmani untuk perjalanan, harta halal yang cukup menutup perjalanan dan kebutuhan tanggungan selama pergi, serta jalur yang aman dan terbuka.",
      "Barangsiapa tidak memiliki sarana ini tahun ini tidak berdosa menunda hingga mampu. Kemampuan dinilai case by case — sakit, utang wajib dibayar, atau perjalanan tidak aman dapat mengangkat kewajiban langsung. Tanyakan ulama yang berkompeten jika situasi Anda tidak jelas.",
    ],
    quran: [
      {
        excerpt: "...bagi orang yang mampu mengadakan perjalanan ke sana.",
      },
    ],
    actions: [
      "Lunasi utang wajib dan atur nafkah tanggungan sebelum memesan.",
      "Verifikasi paket hanya melalui saluran resmi (lihat topik Persiapan).",
    ],
  },
  {
    title: "Perjalanan wanita untuk ibadah haji",
    summary:
      "Mayoritas mensyaratkan mahram; beberapa pandangan mutakhir mengizinkan rombongan aman yang terpercaya.",
    body: [
      "Ibn Abbas meriwayatkan bahwa Nabi ﷺ bersabda wanita tidak boleh bepergian kecuali bersama mahram, dan laki-laki tidak boleh masuk menemuinya kecuali ada mahram (Shahih al-Bukhari 1862; Shahih Muslim 1341). Banyak ulama menerapkannya pada perjalanan Haji dan Umrah.",
      "Sebagian ulama mutakhir — mempertimbangkan keamanan, kebutuhan, dan perjalanan kontemporer — mengizinkan wanita bepergian untuk haji wajib dalam rombongan terpercaya apabila tidak ada mahram. Ini tetap persoalan fiqh yang diperdebatkan.",
    ],
    hadith: [
      {
        excerpt:
          "Wanita tidak boleh bepergian kecuali bersama mahram, dan laki-laki tidak boleh masuk menemuinya kecuali ada mahram bersamanya.",
      },
      {
        excerpt:
          "Tidak halal bagi wanita yang beriman kepada Allah dan hari Akhir bepergian sehari semalam kecuali bersama mahram.",
      },
    ],
    madhhabNote:
      "Mayoritas berpendapat wanita memerlukan mahram untuk perjalanan ibadah haji. Sebagian ulama mutakhir mengizinkan perjalanan dalam rombongan wanita yang aman untuk haji wajib. Ikuti ulama yang Anda percaya dan peraturan otoritas Haji Anda.",
  },
  {
    title: "Tiga jenis Haji",
    summary: "Ifrad, Qiran, dan Tamattu' — tentukan sebelum masuk ihram.",
    body: [
      "Ifrad: masuk ihram untuk Haji saja, tanpa Umrah terpisah dalam ihram itu, dan tidak wajib kurban karena menggabungkan manasik.",
      "Qiran: menggabungkan Umrah dan Haji dalam satu ihram, tetap dalam ihram hingga Haji selesai. Wajib kurban (hady).",
      "Tamattu': menunaikan Umrah penuh dalam bulan-bulan haji, keluar ihram, lalu masuk ihram lagi untuk Haji pada 8 Dzulhijjah. Inilah yang dilakukan kebanyakan jemaah hari ini; juga wajib hady.",
      'Allah berfirman tentang yang menggabungkan manasik: "...Barangsiapa ingin mengerjakan umrah sebelum haji, (hewan kurban) yang mudah didapat..." dan yang tidak mampu berpuasa tiga hari dalam haji dan tujuh setelah pulang (Al-Qur\'an 2:196).',
    ],
    quran: [
      {
        excerpt:
          "Dan sempurnakanlah haji dan umrah karena Allah... Barangsiapa ingin mengerjakan umrah sebelum haji, (hewan kurban) yang mudah didapat. Barangsiapa tidak menemukan (hewan kurban) — maka puasa tiga hari dalam haji dan tujuh setelah pulang...",
      },
    ],
    actions: [
      "Tentukan jenis haji Anda dengan pemimpin rombongan sebelum miqat.",
      "Jika Tamattu', selesaikan Umrah penuh sebelum masuk ihram lagi untuk Haji.",
    ],
    appLinks: [
      {
        label: "Daftar periksa Umrah",
      },
      {
        label: "Daftar periksa Haji",
      },
    ],
  },
  {
    title: "Lima miqat",
    summary: "Jangan melewati miqat menuju Makkah tanpa masuk ihram untuk Haji atau Umrah.",
    body: [
      "Ibn Abbas meriwayatkan bahwa Nabi ﷺ menetapkan miqat bagi umat: Dzulhulaifah untuk Madinah, Al-Juhfah untuk Syam, Qarn al-Manazil untuk Najd, dan Yalamlam untuk Yaman; serta Dhat 'Irq bagi yang dari Irak. Beliau bersabda ini untuk mereka dan siapa saja yang melewatinya berniat Haji atau Umrah; dan siapa tinggal di dalamnya masuk ihram dari tempat berangkat, termasuk penduduk Makkah dari Makkah (Shahih al-Bukhari 1524; Shahih Muslim 1181).",
      "Bandara dan pelabuhan modern memiliki titik ihram yang sesuai atau prosedur yang diumumkan — ikuti panduan maskapai dan Kementerian Haji dan Umrah agar tidak melewati batas tanpa ihram.",
    ],
    hadith: [
      {
        excerpt:
          "Rasulullah ﷺ menetapkan Dzulhulaifah bagi penduduk Madinah, Al-Juhfah bagi penduduk Syam, Qarn al-Manazil bagi penduduk Najd, dan Yalamlam bagi penduduk Yaman... Miqat-miqat ini untuk penduduk tempat-tempat itu, dan bagi yang melewatinya berniat Haji atau Umrah...",
      },
      {
        excerpt:
          "Rasulullah ﷺ menetapkan miqat-miqat... Siapa tinggal di dalam batas ini hendaknya masuk ihram dari tempat berangkat...",
      },
    ],
  },
  {
    title: "Masuk ihram",
    summary: "Mandi, pakaian, niat, dan talbiyah memulai keadaan suci.",
    body: [
      "Ihram adalah keadaan suci yang dimasuki dengan niat Haji atau Umrah. Nabi ﷺ menganjurkan mandi sebelum ihram. Laki-laki memakai dua kain putih tidak dijahit; perempuan memakai pakaian sopan biasa tanpa menutup wajah atau tangan dengan sarung tangan sebagai pakaian ihram (rincian niqab dan sarung tangan dibahas dalam fiqh).",
      "Laki-laki boleh memakai wewangian pada tubuh sebelum ihram, bukan pada pakaian ihram setelah masuk keadaan suci (Shahih al-Bukhari 1539). Lalu bentuk niat dan mulailah talbiyah.",
      'Talbiyah yang diajarkan Nabi ﷺ: "Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, inna al-hamda wan-ni\'mata laka wal-mulk, la sharika lak" — diucapkan hingga tawaf dimulai untuk Umrah, atau hingga melempar Jamrat al-Aqaba untuk Haji menurut amalan yang masyhur (Shahih al-Bukhari 1549; Shahih Muslim 1184).',
    ],
    hadith: [
      {
        excerpt:
          "Aisyah berkata: Aku biasa memakaikan wewangian pada Rasulullah ﷺ untuk ihramnya sebelum beliau masuk ihram...",
      },
      {
        excerpt:
          "Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, inna al-hamda wan-ni'mata laka wal-mulk, la sharika lak.",
      },
      {
        excerpt: "Nabi ﷺ meninggikan suara dengan talbiyah: Labbayk Allahumma labbayk...",
      },
    ],
    actions: [
      "Bawa minimal dua set ihram untuk laki-laki; siapkan perlengkapan mandi tanpa wangi.",
      "Latih talbiyah sebelum berangkat agar lancar di perjalanan.",
    ],
  },
  {
    title: "Larangan ihram",
    summary: "Apa yang harus dihindari muhrim hingga keluar dari keadaan suci.",
    body: [
      "Dalam ihram, hindari: bagi laki-laki — pakaian dijahit/pas badan dan menutup kepala; wewangian; memotong rambut atau kuku; berburu hewan darat; akad atau melaksanakan nikah; dan hubungan suami-isteri. Perempuan hindari wewangian dan larangan lain yang sama sambil memakai pakaian sopan.",
      "Melanggar larangan dapat memerlukan fidyah — biasanya puasa, memberi makan fakir miskin, atau kurban — tergantung perbuatan. Madzhab mengklasifikasikan rinciannya berbeda. Patuhi larangan dengan hati-hati dan tanyakan pemandu yang berkompeten jika sesuatu terjadi di luar dugaan.",
    ],
    actions: ["Jauhkan wewangian, pemotong kuku, dan gunting dari jangkauan mudah selama ihram."],
    madhhabNote:
      "Daftar pelanggaran dan fidyahnya berbeda antar mazhab. Anggap ini daftar peringatan praktis, lalu konfirmasi rincian dengan mazhab atau pemandu Haji Anda.",
  },
  {
    title: "Umrah — ihram dan talbiyah",
    summary: "Masuk keadaan suci di atau sebelum miqat, lalu membalas panggilan Allah.",
    body: [
      "Di atau sebelum miqat, mandi jika mampu, pakai pakaian ihram, bentuk niat Umrah, dan mulailah talbiyah. Keadaan suci dimulai dengan niat itu.",
      "Ulangi talbiyah sering saat menuju Makkah hingga tawaf dimulai. Itu pernyataan bahwa Anda membalas panggilan Allah semata-mata.",
    ],
    actions: ["Gunakan daftar periksa Umrah untuk menandai setiap manasik saat selesai."],
    appLinks: [
      {
        label: "Daftar periksa Umrah",
      },
    ],
  },
  {
    title: "Tawaf Ka'bah",
    summary: "Tujuh kali mengelilingi berlawanan arah jarum jam, dimulai dari Hajar Aswad.",
    body: [
      "Kelilingi Ka'bah tujuh kali berlawanan arah jarum jam, mulai dan berakhir di sudut Hajar Aswad. Cium, sentuh, atau arahkan ke sana sambil bertakbir jika padat — mengikuti amalan Nabi ﷺ tanpa menyakiti orang lain.",
      "Laki-laki melakukan raml (langkah cepat) pada tiga putaran pertama dan idtiba' (membuka bahu kanan) dalam tawaf kedatangan Umrah ini, menurut sunnah yang masyhur.",
      "Antara Rukun Yamani dan Hajar Aswad dianjurkan membaca: \"Rabbana atina fid-dunya hasanah wa fil-akhirati hasanah wa qina 'adzaban-nar\" (Al-Qur'an 2:201).",
    ],
    quran: [
      {
        excerpt:
          "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka.",
      },
    ],
  },
  {
    title: "Dua rakaat dan Zamzam",
    summary: "Salat di belakang Maqam Ibrahim jika memungkinkan, lalu minum Zamzam.",
    body: [
      'Setelah tawaf, salat dua rakaat di belakang Maqam Ibrahim jika ada ruang, atau di tempat lain dalam masjid jika padat — sesuai firman Allah: "...Dan jadikanlah sebagian tempat berdiri Ibrahim sebagai tempat salat..." (Al-Qur\'an 2:125).',
      "Lalu minum air Zamzam. Riwayat Jabir tentang haji Nabi ﷺ mencakup minum Zamzam setelah tawaf; Nabi ﷺ bersabda Zamzam untuk apa pun niat minumnya (riwayat otentik dikumpulkan ulama mutakhir; anjurkan niat dan doa).",
    ],
    quran: [
      {
        excerpt: "...Dan jadikanlah sebagian tempat berdiri Ibrahim sebagai tempat salat...",
      },
    ],
  },
  {
    title: "Sa'i antara Safa dan Marwah",
    summary: "Tujuh kali perjalanan mengenang pencarian air Hajar.",
    body: [
      "Allah berfirman: \"Sesungguhnya Safa dan Marwah termasuk syi'ar-syi'ar Allah. Barangsiapa mengerjakan haji ke Baitullah atau umrah, maka tidak ada dosa baginya berjalan antara keduanya...\" (Al-Qur'an 2:158).",
      "Jalan tujuh kali antara Safa dan Marwah, mulai dari Safa. Di Safa, hadap Ka'bah, angkat tangan bertakbir dan berdoa seperti Nabi ﷺ. Laki-laki berlari kecil antara penanda hijau.",
    ],
    quran: [
      {
        excerpt:
          "Sesungguhnya Safa dan Marwah termasuk syi'ar-syi'ar Allah. Barangsiapa mengerjakan haji ke Baitullah atau umrah, maka tidak ada dosa baginya berjalan antara keduanya...",
      },
    ],
  },
  {
    title: "Halq atau taqsir — menyelesaikan Umrah",
    summary:
      "Laki-laki mencukur atau memotong; perempuan memotong sepanjang ujung jari — lalu ihram terangkat.",
    body: [
      "Laki-laki mencukur kepala (halq) — yang Nabi ﷺ doakan tiga kali — atau memotong rata (taqsir). Perempuan mengumpulkan rambut dan memotong kira-kira sepanjang ujung jari. Dengan ini, Umrah selesai dan larangan ihram terangkat.",
      "Abdullah ibn Umar meriwayatkan bahwa Rasulullah ﷺ bersabda: 'Ya Allah, rahmatilah yang mencukur kepalanya.' Mereka berkata: 'Dan yang memotong, ya Rasulullah?' Beliau bersabda: 'Ya Allah, rahmatilah yang mencukur kepalanya.' Mereka berkata: 'Dan yang memotong, ya Rasulullah?' Beliau bersabda ketiga kali: 'Dan yang memotong' (Shahih al-Bukhari 1727; Shahih Muslim 1301).",
    ],
    hadith: [
      {
        excerpt: "Ya Allah, rahmatilah yang mencukur kepalanya... Dan (ketiga kali) yang memotong.",
      },
      {
        excerpt:
          "Ya Allah, ampunilah yang mencukur kepalanya... lalu beliau bersabda ketiga kali: dan yang memotong rambut pendek.",
      },
    ],
  },
  {
    title: "8 Dzulhijjah — Hari Tarwiyah",
    summary: "Masuk ihram untuk Haji dan menghabiskan hari di Mina.",
    body: [
      "Bagi jemaah Tamattu': bentuk niat Haji dan masuk ihram lagi dari tempat tinggal di Makkah, perbarui talbiyah. Jemaah Ifrad dan Qiran sudah dalam ihram.",
      "Berangkat ke Mina dan salat Dhuhr, Asr, Maghrib, Isya, dan Fajr berikutnya, masing-masing dipendekkan dua rakaat pada waktunya, mengikuti amalan Nabi ﷺ dalam Haji Wada' sebagaimana diriwayatkan Jabir (Shahih Muslim 1218). Habiskan hari dan malam dalam ibadah, menanti Arafah.",
    ],
    hadith: [
      {
        excerpt:
          "Riwayat panjang Jabir tentang Haji Wada' Nabi ﷺ — termasuk tinggal di Mina dan urutan manasik.",
      },
    ],
    actions: ["Buka daftar periksa Haji pada pagi tanggal 8."],
    appLinks: [
      {
        label: "Daftar periksa Haji",
      },
    ],
  },
  {
    title: "9 Dzulhijjah — Hari Arafah",
    summary: "Wukuf di Arafah hingga matahari terbenam; lalu bergerak ke Muzdalifah.",
    body: [
      'Tetaplah dalam batas Arafah dari setelah zuhur hingga matahari terbenam dalam doa, dzikir, dan taubat. Nabi ﷺ bersabda "Haji adalah Arafah" (Sunan Abi Dawud 1949). Hadap kiblat, angkat tangan, dan mohon kepada Allah — termasuk waktu terbesar untuk doa.',
      "Salat Dhuhr dan Asr jamak dan qashar pada waktu Dhuhr (jam' taqdim), lalu isi sisa hari dengan doa bukan salat sunnah — mengikuti amalan Nabi ﷺ (Shahih Muslim 1218).",
      "Setelah matahari terbenam, berangkat tenang ke Muzdalifah. Jamak Maghrib dan Isya (Isya qashar), istirahat malam, dan kumpulkan kerikil untuk melempar. Orang lemah dan wanita boleh berangkat ke Mina setelah tengah malam menurut keringanan masyhur dalam sunnah.",
    ],
    hadith: [
      {
        excerpt: "Haji adalah Arafah.",
      },
      {
        excerpt:
          "Nabi ﷺ jamak Dhuhr dan Asr di Arafah, lalu berangkat setelah matahari terbenam ke Muzdalifah...",
      },
    ],
  },
  {
    title: "10 Dzulhijjah — Hari Nahr",
    summary: "Melempar, menyembelih, menggunting rambut, dan Tawaf Ifadhah.",
    body: [
      "Kembali menuju Mina dan lempar tujuh kerikil ke Jamrat al-Aqaba (tiang besar), ucapkan Allahu akbar setiap lemparan — manasik pertama hari itu dalam urutan Haji Wada'.",
      "Tunaikan kurban wajib Tamattu' dan Qiran (Al-Qur'an 2:196), atau atur melalui lembaga terpercaya. Daging dimakan dan diberikan kepada fakir miskin.",
      "Cukur (halq) atau potong (taqsir); perempuan potong sepanjang ujung jari. Setelah melempar dan cukur/potong, tahallul awwal berlaku — kebanyakan larangan ihram terangkat kecuali hubungan suami-isteri.",
      "Pergi ke Makkah untuk Tawaf Ifadhah — rukun Haji — dan sa'i bagi jemaah Tamattu' (Ifrad/Qiran yang sudah sa'i dengan tawaf kedatangan ikuti fatwa mazhabnya). Ini menyelesaikan pelepasan penuh dari ihram.",
    ],
    quran: [
      {
        excerpt:
          "...Barangsiapa ingin mengerjakan umrah sebelum haji, (hewan kurban) yang mudah didapat...",
      },
    ],
    madhhabNote:
      "Urutan manasik Hari Nahr memiliki fleksibilitas dalam sunnah; mazhab berbeda tentang urutan tepat dan kapan sa'i wajib untuk setiap jenis Haji. Ikuti pemandu rombongan Anda.",
  },
  {
    title: "11–13 Dzulhijjah — Hari Tasyriq",
    summary: "Malam di Mina, melempar tiga Jamrat setiap hari, lalu tawaf wada'.",
    body: [
      "Habiskan malam tanggal 11, 12 (dan 13 jika tidak pulang lebih awal) di Mina. Hari-hari makan, minum, dan mengingat Allah.",
      "Setiap sore setelah Dhuhr, lempar tujuh kerikil ke masing-masing tiga tiang secara berurutan — kecil, tengah, lalu besar — dengan takbir setiap lemparan. Siapa mempercepat boleh pulang setelah melempar tanggal 12 (Al-Qur'an 2:203).",
      "Sebelum meninggalkan Makkah, lakukan Tawaf Wada' agar amal terakhir dengan Baitullah adalah perpisahan. Ibn Abbas meriwayatkan umat diperintahkan agar manasik terakhir di Baitullah, kecuali dilonggarkan bagi wanita haid (Shahih al-Bukhari 1755; Shahih Muslim 1328).",
    ],
    quran: [
      {
        excerpt:
          "Dan berdzikirlah kepada Allah pada hari-hari yang tertentu. Barangsiapa mempercepat (kepulangan) dalam dua hari, maka tidak ada dosa baginya; dan barangsiapa menunda, maka tidak ada dosa baginya — bagi yang bertakwa...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Umat diperintahkan menunaikan tawaf wada' Ka'bah sebagai manasik terakhir, kecuali wanita haid yang dibebaskan.",
      },
      {
        excerpt:
          "Umat diperintahkan agar manasik terakhir di Baitullah, namun dilonggarkan bagi wanita yang sedang haid.",
      },
    ],
  },
  {
    title: "Rukun dan kewajiban",
    summary: "Apa yang membatalkan Haji jika ditinggalkan, dan apa yang ditetapkan dengan dam.",
    body: [
      "Rukun (arkan) adalah inti Haji. Jika rukun ditinggalkan, haji batal dan tidak bisa diperbaiki kurban saja — harus diqadha. Mayoritas biasanya mencantumkan: ihram (niat), wukuf di Arafah, Tawaf Ifadhah, dan sa'i.",
      "Kewajiban (wajibat) meliputi masuk ihram dari miqat, bermalam di Muzdalifah, melempar Jamrat, bermalam malam Tasyriq di Mina, dan Tawaf Wada'. Meninggalkan kewajiban tidak membatalkan Haji tetapi ditetapkan dam (kurban) menurut mazhab.",
    ],
    madhhabNote:
      "Daftar arkan dan wajibat tepat berbeda antar empat mazhab. Konfirmasi dengan pemandu berkompeten untuk mazhab Anda — terutama jika sesuatu terlewat karena tekanan keramaian.",
  },
  {
    title: "Adab dan keikhlasan",
    summary: "Jaga lidah dan anggota badan — penerimaan terkait dengan akhlak.",
    body: [
      "Hadits tentang kembali tanpa dosa (Bukhari 1521; Muslim 1350) menjelaskan haji rusak oleh kekejian (rafath), dosa (fusuq), dan pertengkaran. Sabar, lemah lembut, dan menolong sesama jemaah bagian dari ibadah.",
      "Jangan biarkan ponsel dan obrolan kosong mendominasi Arafah dan masjid. Beri jalan dalam tawaf; jangan mendorong ke Hajar Aswad. Haji mabrur teman Surga — usahakan akhlak mulia sepanjang perjalanan.",
    ],
    hadith: [
      {
        excerpt:
          "Barangsiapa menunaikan haji karena Allah dan tidak bercampur dengan isteri serta tidak berbuat dosa, maka ia kembali seperti pada hari ibunya melahirkannya.",
      },
    ],
    actions: ["Tetapkan niat harian: satu amal kebaikan dan satu doa ikhlas di atas keramaian."],
  },
  {
    title: "Visa dan pendaftaran",
    summary: "Gunakan saluran resmi — Nusuk dan otoritas Haji nasional Anda.",
    body: [
      "Nusuk (nusuk.sa) adalah platform resmi Arab Saudi untuk Haji dan Umrah — visa, akomodasi, transport, dan paket terdaftar. Calo tidak resmi sering menjadi sumber penipuan.",
      "Setiap negara menerima kuota haji tahunan; kebanyakan jemaah mendaftar melalui otoritas Haji nasional atau agen berlisensi. Umrah tidak berkuota dan dapat diatur sepanjang tahun melalui saluran resmi.",
    ],
    actions: [
      "Daftar lebih awal saat musim dibuka.",
      "Pesan hanya melalui agen terdaftar Nusuk atau otoritas nasional Anda.",
      "Verifikasi saluran pembayaran sebelum transfer uang.",
    ],
  },
  {
    title: "Barang bawaan",
    summary: "Ihram, perlengkapan mandi tanpa wangi, dokumen, dan kenyamanan berjalan.",
    body: [
      "Laki-laki: minimal dua set pakaian ihram tidak dijahit dan sabuk untuk dokumen. Perempuan: pakaian longgar sopan. Sandal terbuka yang mudah dipakai; tas kecil dan botol air.",
      "Bawa sabun tanpa wangi dan tabir surya — wewangian dilarang dalam ihram. Simpan paspor, cetakan visa, catatan vaksin, dan kontak darurat dalam kantong tipis. Power bank dan SIM lokal atau eSIM membantu di keramaian.",
    ],
    actions: [
      "Daftar periksa: ihram ×2, sandal, perlengkapan mandi tanpa wangi, kantong dokumen, obat, power bank.",
      "Bawa plester lecet — jemaah haji berjalan jauh.",
    ],
  },
  {
    title: "Tempat suci sekilas",
    summary: "Makkah, Madinah, Mina, Arafah, dan Muzdalifah — catatan praktis.",
    body: [
      "Masjid al-Haram mengelilingi Ka'bah — tempat tawaf dan sa'i; keramaian sangat padat. Masjid an-Nabawi di Madinah bukan bagian Haji sendiri tetapi kebanyakan jemaah berkunjung; masuk Rawdah dijadwalkan melalui aplikasi resmi.",
      "Mina adalah kota tenda untuk malam tanggal 8 dan 11–13 Dzulhijjah. Arafah adalah dataran terbuka — hidrasi dan teduh penting tanggal 9. Muzdalifah tempat jemaah istirahat di bawah langit terbuka dan mengumpulkan kerikil — fasilitas sengaja minimal.",
    ],
    actions: ["Pelajari peta sederhana Mina–Arafah–Muzdalifah sebelum berangkat."],
  },
  {
    title: "Sumber resmi",
    summary: "Nusuk, otoritas nasional Anda, dan Visit Saudi.",
    body: [
      "Mulai dari Nusuk untuk visa, paket, izin Rawdah, dan panduan keramaian. Gunakan kementerian Haji negara Anda untuk kuota dan aturan kesehatan. Visit Saudi menerbitkan panduan masuk dan perjalanan umum.",
      "Jika tawaran tampak sangat murah atau calo meminta pembayaran di luar saluran resmi, verifikasi langsung melalui portal kementerian sebelum membayar.",
    ],
    actions: [
      "Tandai nusuk.sa dan situs otoritas Haji nasional Anda.",
      "Simpan kontak darurat dari pemimpin rombongan.",
    ],
  },
];

export const HAJJ_CHECKLIST_ID: DeepPartial<PilgrimageChecklistItem>[] = [
  {
    title: "Masuk ihram untuk Haji",
    hint: "Niat Haji dan masuk ihram (dari Makkah untuk tamattu'); perbarui talbiyah.",
    day: "8 Dzulhijjah",
  },
  {
    title: "Berangkat ke Mina",
    hint: "Salat Dhuhr hingga Fajr di Mina, masing-masing qashar pada waktunya.",
    location: "Mina",
    day: "8 Dzulhijjah",
  },
  {
    title: "Wukuf di Arafah",
    hint: "Tetap di Arafah dari setelah zuhur hingga matahari terbenam dalam doa dan dzikir.",
    location: "Arafah",
    day: "9 Dzulhijjah",
  },
  {
    title: "Jamak Dhuhr & Asr",
    hint: "Salat Dhuhr dan Asr jamak qashar pada waktu Dhuhr, lalu fokus pada doa.",
    location: "Arafah",
    day: "9 Dzulhijjah",
  },
  {
    title: "Pindah ke Muzdalifah",
    hint: "Setelah matahari terbenam, jamak Maghrib dan Isya, istirahat, dan kumpulkan kerikil.",
    location: "Muzdalifah",
    day: "9 Dzulhijjah",
  },
  {
    title: "Melempar Jamrat al-Aqaba",
    hint: "Lemparkan tujuh kerikil ke tiang besar dengan takbir setiap lemparan.",
    location: "Mina",
    day: "10 Dzulhijjah",
  },
  {
    title: "Menyembelih kurban (hady)",
    hint: "Wajib tamattu' dan qiran — sembelih atau atur melalui lembaga terpercaya.",
    day: "10 Dzulhijjah",
  },
  {
    title: "Halq atau taqsir",
    hint: "Laki-laki cukur atau potong; perempuan potong sepanjang ujung jari (tahallul awwal).",
    day: "10 Dzulhijjah",
  },
  {
    title: "Tawaf Ifadhah",
    hint: "Tunaikan Tawaf Ifadhah dan sa'i untuk tamattu' — rukun Haji.",
    location: "Masjid al-Haram",
    day: "10 Dzulhijjah",
  },
  {
    title: "Bermalam di Mina",
    hint: "Habiskan malam tanggal 11, 12 (dan 13 jika tidak pulang lebih awal) di Mina.",
    location: "Mina",
    day: "11–13 Dzulhijjah",
  },
  {
    title: "Melempar tiga Jamrat",
    hint: "Setelah Dhuhr setiap hari, lempar kecil, tengah, lalu besar — tujuh masing-masing.",
    location: "Mina",
    day: "11–13 Dzulhijjah",
  },
  {
    title: "Tawaf Wada'",
    hint: "Tunaikan Tawaf Wada' sebelum meninggalkan Makkah (wanita haid dibebaskan).",
    location: "Masjid al-Haram",
    day: "Keberangkatan",
  },
];

export const UMRAH_CHECKLIST_ID: DeepPartial<PilgrimageChecklistItem>[] = [
  {
    title: "Masuk ihram",
    hint: "Di atau sebelum miqat: mandi, pakaian ihram, niat Umrah, talbiyah.",
    location: "Miqat",
  },
  {
    title: "Membaca talbiyah",
    hint: "Ulangi Labbayk… sering hingga tawaf dimulai.",
  },
  {
    title: "Tawaf Ka'bah",
    hint: "Tujuh putaran berlawanan arah jarum jam dari Hajar Aswad; laki-laki: raml dan idtiba'.",
    location: "Masjid al-Haram",
  },
  {
    title: "Salat dua rakaat",
    hint: "Di belakang Maqam Ibrahim jika memungkinkan, lalu minum Zamzam.",
    location: "Masjid al-Haram",
  },
  {
    title: "Sa'i antara Safa & Marwah",
    hint: "Tujuh kali perjalanan mulai dari Safa; laki-laki lari kecil antara penanda hijau.",
    location: "Masjid al-Haram",
  },
  {
    title: "Halq atau taqsir",
    hint: "Laki-laki cukur atau potong; perempuan potong sepanjang ujung jari — Umrah selesai.",
  },
];
