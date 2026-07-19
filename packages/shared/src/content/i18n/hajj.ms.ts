import type { PilgrimageChecklistItem } from "../../types/hajj-guide";
import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// MS overlay for Hajj & Umrah Learn topics + rite checklists.
// Index-aligned with English sources; untranslated entries fall back to English.
// Only human-readable text is translated — ids, routes, citations stay English.

export const HAJJ_GUIDE_TOPICS_MS: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Ganjaran Haji yang diterima (mabrur)",
    summary: "Haji mabrur menghapuskan dosa dan ganjaran akhirnya Syurga.",
    body: [
      "Abu Hurairah meriwayatkan bahawa Rasulullah ﷺ bersabda: 'Sesiapa menunaikan haji kerana Allah dan tidak bercampur dengan isteri serta tidak berbuat dosa, maka ia kembali seperti pada hari ibunya melahirkannya' (Sahih al-Bukhari 1521; Sahih Muslim 1350).",
      "Beliau juga bersabda: 'Haji mabrur tiada balasannya melainkan Syurga' (Sahih al-Bukhari 1773; Sahih Muslim 1349). Penerimaan haji berkait dengan keikhlasan dan menjaga ibadah haji daripada kekejian dan perbuatan dosa — bukan sekadar menyelesaikan langkah zahir.",
    ],
    hadith: [
      {
        excerpt:
          "Sesiapa menunaikan haji kerana Allah dan tidak bercampur dengan isteri serta tidak berbuat dosa, maka ia kembali seperti pada hari ibunya melahirkannya.",
      },
      {
        excerpt:
          "Sesiapa menunaikan haji kerana Allah dan tidak bercampur dengan isteri serta tidak berbuat dosa, maka ia kembali seperti pada hari ibunya melahirkannya.",
      },
      {
        excerpt: "Haji mabrur tiada balasannya melainkan Syurga.",
      },
      {
        excerpt: "Haji mabrur tiada balasannya melainkan Syurga.",
      },
    ],
    actions: [
      "Niatkan haji semata-mata kerana Allah — jagalah lidah dan akhlak sepanjang perjalanan.",
      "Gunakan senarai semak Haji dalam aplikasi hanya sebagai peringatan; kekalkan hati fokus pada penerimaan.",
    ],
    appLinks: [
      {
        label: "Senarai semak manasik Haji",
      },
    ],
  },
  {
    title: "Keutamaan Umrah",
    summary: "Umrah ke Umrah menghapuskan dosa di antaranya.",
    body: [
      "Abu Hurairah meriwayatkan bahawa Nabi ﷺ bersabda: 'Umrah ke Umrah menjadi penghapus dosa di antaranya, dan haji mabrur tiada balasannya melainkan Syurga' (Sahih al-Bukhari 1773; Sahih Muslim 1349).",
      "Umrah boleh dilaksanakan pada bila-bila masa sepanjang tahun. Lebih ringkas daripada Haji tetapi tetap ibadah besar: ihram, tawaf, sa'i, dan mencukur atau memotong rambut.",
    ],
    hadith: [
      {
        excerpt:
          "Umrah ke Umrah menjadi penghapus dosa di antaranya, dan haji mabrur tiada balasannya melainkan Syurga.",
      },
      {
        excerpt:
          "Umrah ke Umrah menjadi penghapus dosa di antaranya, dan haji mabrur tiada balasannya melainkan Syurga.",
      },
    ],
    actions: ["Buka senarai semak Umrah apabila anda bersedia menjalani manasik mengikut turutan."],
    appLinks: [
      {
        label: "Senarai semak manasik Umrah",
      },
    ],
  },
  {
    title: "Hari Arafah",
    summary: "Wukuf di Arafah adalah inti Haji — dan hari yang agung untuk doa.",
    body: [
      "Abd ar-Rahman ibn Ya'mar meriwayatkan bahawa Nabi ﷺ bersabda: 'Haji adalah Arafah' (Sunan Abi Dawud 1949; Jami' at-Tirmidhi 889). Sesiapa terlepas wukuf dalam batas Arafah pada waktunya, telah terlepas haji tahun itu.",
      "Bagi yang tidak sedang berhaji, berpuasa pada Hari Arafah adalah amalan yang sangat digalakkan: Abu Qatadah meriwayatkan bahawa puasa Arafah menghapuskan dosa setahun yang lalu dan setahun yang akan datang (Sahih Muslim 1162). Jemaah haji sendiri tidak berpuasa supaya dapat mengisi hari itu dengan doa.",
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
          "Puasa pada Hari Arafah, aku berharap daripada Allah, menghapuskan dosa setahun sebelumnya dan setahun selepasnya.",
      },
    ],
  },
  {
    title: "Haji — rukun kelima",
    summary: "Wajib sekali seumur hidup bagi setiap Muslim yang mampu.",
    body: [
      'Allah berfirman: "Dan (kewajiban) manusia terhadap Allah ialah mengerjakan haji ke Baitullah — bagi orang yang mampu mengadakan perjalanan ke sana. Barangsiapa kafir, maka sesungguhnya Allah Maha Kaya (dari segala sesuatu) daripada seluruh alam" (Al-Qur\'an 3:97).',
      'Seruan itu disampaikan kepada seluruh manusia: "Dan serulah manusia untuk mengerjakan haji, niscaya mereka akan datang kepadamu dengan berjalan kaki dan menunggang unta yang kurus; mereka datang dari segenap penjuru yang jauh" (Al-Qur\'an 22:27).',
      "Ibn Umar meriwayatkan bahawa Nabi ﷺ bersabda Islam dibina atas lima perkara: syahadat, solat, zakat, puasa Ramadan, dan haji ke Baitullah bagi yang mampu (Sahih al-Bukhari 8; Sahih Muslim 16). Ulama sepakat haji wajib sekali seumur hidup apabila syarat terpenuhi; mengulanginya adalah keutamaan sunnah.",
    ],
    quran: [
      {
        excerpt:
          "Dan (kewajiban) manusia terhadap Allah ialah mengerjakan haji ke Baitullah — bagi orang yang mampu mengadakan perjalanan ke sana...",
      },
      {
        excerpt:
          "Dan serulah manusia untuk mengerjakan haji, niscaya mereka akan datang kepadamu dengan berjalan kaki dan menunggang unta yang kurus...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Islam dibina atas lima: syahadat bahawa tiada ilah melainkan Allah dan Muhammad adalah utusan Allah, mendirikan solat, menunaikan zakat, puasa Ramadan, dan haji ke Baitullah bagi yang mampu.",
      },
      {
        excerpt:
          "Islam dibina atas lima... dan haji ke Baitullah bagi yang mampu mengadakan perjalanan ke sana.",
      },
    ],
  },
  {
    title: "Kemampuan (istita'ah)",
    summary: "Kesihatan, harta halal, dan laluan selamat — tanpa ini, Haji belum wajib.",
    body: [
      "Syarat dalam Al-Qur'an 3:97 ialah kemampuan (istita'ah). Ulama klasik merumuskannya sebagai: kesihatan fizikal untuk perjalanan, harta halal yang cukup menampung perjalanan dan keperluan tanggungan semasa pergi, serta laluan yang selamat dan terbuka.",
      "Sesiapa tidak mempunyai sarana ini tahun ini tidak berdosa menangguhkan sehingga mampu. Kemampuan dinilai mengikut kes — sakit, hutang wajib dibayar, atau perjalanan tidak selamat boleh mengangkat kewajiban serta-merta. Tanya ulama yang berkompeten jika situasi anda tidak jelas.",
    ],
    quran: [
      {
        excerpt: "...bagi orang yang mampu mengadakan perjalanan ke sana.",
      },
    ],
    actions: [
      "Selesaikan hutang wajib dan atur nafkah tanggungan sebelum membuat tempahan.",
      "Sahkan pakej hanya melalui saluran rasmi (lihat topik Persediaan).",
    ],
  },
  {
    title: "Perjalanan wanita untuk ibadah haji",
    summary:
      "Majoriti mensyaratkan mahram; beberapa pandangan mutakhir membenarkan rombongan selamat yang dipercayai.",
    body: [
      "Ibn Abbas meriwayatkan bahawa Nabi ﷺ bersabda wanita tidak boleh bertravel kecuali bersama mahram, dan lelaki tidak boleh masuk menemuinya kecuali ada mahram (Sahih al-Bukhari 1862; Sahih Muslim 1341). Ramai ulama memperkatakannya pada perjalanan Haji dan Umrah.",
      "Sebahagian ulama mutakhir — mempertimbangkan keselamatan, keperluan, dan perjalanan kontemporari — membenarkan wanita bertravel untuk haji wajib dalam rombongan dipercayai apabila tiada mahram. Ini kekal persoalan fiqh yang diperdebatkan.",
    ],
    hadith: [
      {
        excerpt:
          "Wanita tidak boleh bertravel kecuali bersama mahram, dan lelaki tidak boleh masuk menemuinya kecuali ada mahram bersamanya.",
      },
      {
        excerpt:
          "Tidak halal bagi wanita yang beriman kepada Allah dan hari Akhirat bertravel sehari semalam kecuali bersama mahram.",
      },
    ],
    madhhabNote:
      "Majoriti berpendapat wanita memerlukan mahram untuk perjalanan ibadah haji. Sebahagian ulama mutakhir membenarkan perjalanan dalam rombongan wanita yang selamat untuk haji wajib. Ikuti ulama yang anda percaya dan peraturan pihak berkuasa Haji anda.",
  },
  {
    title: "Tiga jenis Haji",
    summary: "Ifrad, Qiran, dan Tamattu' — tentukan sebelum masuk ihram.",
    body: [
      "Ifrad: masuk ihram untuk Haji sahaja, tanpa Umrah berasingan dalam ihram itu, dan tidak wajib korban kerana menggabungkan manasik.",
      "Qiran: menggabungkan Umrah dan Haji dalam satu ihram, kekal dalam ihram sehingga Haji selesai. Wajib korban (hady).",
      "Tamattu': menunaikan Umrah penuh dalam bulan-bulan haji, keluar ihram, kemudian masuk ihram semula untuk Haji pada 8 Zulhijjah. Inilah yang dilakukan kebanyakan jemaah hari ini; juga wajib hady.",
      'Allah berfirman tentang yang menggabungkan manasik: "...Barangsiapa ingin mengerjakan umrah sebelum haji, (hewan korban) yang mudah didapat..." dan yang tidak mampu berpuasa tiga hari dalam haji dan tujuh selepas pulang (Al-Qur\'an 2:196).',
    ],
    quran: [
      {
        excerpt:
          "Dan sempurnakanlah haji dan umrah kerana Allah... Barangsiapa ingin mengerjakan umrah sebelum haji, (hewan korban) yang mudah didapat. Barangsiapa tidak menemui (hewan korban) — maka puasa tiga hari dalam haji dan tujuh selepas pulang...",
      },
    ],
    actions: [
      "Tentukan jenis haji anda dengan ketua rombongan sebelum miqat.",
      "Jika Tamattu', selesaikan Umrah penuh sebelum masuk ihram semula untuk Haji.",
    ],
    appLinks: [
      {
        label: "Senarai semak Umrah",
      },
      {
        label: "Senarai semak Haji",
      },
    ],
  },
  {
    title: "Lima miqat",
    summary: "Jangan melepasi miqat menuju Makkah tanpa masuk ihram untuk Haji atau Umrah.",
    body: [
      "Ibn Abbas meriwayatkan bahawa Nabi ﷺ menetapkan miqat bagi umat: Dzulhulaifah untuk Madinah, Al-Juhfah untuk Syam, Qarn al-Manazil untuk Najd, dan Yalamlam untuk Yaman; serta Dhat 'Irq bagi yang dari Iraq. Beliau bersabda ini untuk mereka dan sesiapa yang melepasinya berniat Haji atau Umrah; dan sesiapa tinggal di dalamnya masuk ihram dari tempat berlepas, termasuk penduduk Makkah dari Makkah (Sahih al-Bukhari 1524; Sahih Muslim 1181).",
      "Lapangan terbang dan pelabuhan moden mempunyai titik ihram yang sepadan atau prosedur yang diumumkan — ikuti panduan syarikat penerbangan dan Kementerian Haji dan Umrah supaya tidak melepasi sempadan tanpa ihram.",
    ],
    hadith: [
      {
        excerpt:
          "Rasulullah ﷺ menetapkan Dzulhulaifah bagi penduduk Madinah, Al-Juhfah bagi penduduk Syam, Qarn al-Manazil bagi penduduk Najd, dan Yalamlam bagi penduduk Yaman... Miqat-miqat ini untuk penduduk tempat-tempat itu, dan bagi yang melepasinya berniat Haji atau Umrah...",
      },
      {
        excerpt:
          "Rasulullah ﷺ menetapkan miqat-miqat... Sesiapa tinggal di dalam sempadan ini hendaklah masuk ihram dari tempat berlepas...",
      },
    ],
  },
  {
    title: "Masuk ihram",
    summary: "Mandi, pakaian, niat, dan talbiyah memulakan keadaan suci.",
    body: [
      "Ihram ialah keadaan suci yang dimasuki dengan niat Haji atau Umrah. Nabi ﷺ menggalakkan mandi sebelum ihram. Lelaki memakai dua kain putih tidak dijahit; perempuan memakai pakaian sopan biasa tanpa menutup muka atau tangan dengan sarung tangan sebagai pakaian ihram (butiran niqab dan sarung tangan dibincang dalam fiqh).",
      "Lelaki boleh memakai wangian pada tubuh sebelum ihram, bukan pada pakaian ihram selepas masuk keadaan suci (Sahih al-Bukhari 1539). Kemudian bentuk niat dan mulakan talbiyah.",
      'Talbiyah yang diajar Nabi ﷺ: "Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, inna al-hamda wan-ni\'mata laka wal-mulk, la sharika lak" — diucapkan sehingga tawaf dimulakan untuk Umrah, atau sehingga melontar Jamrat al-Aqaba untuk Haji menurut amalan yang masyhur (Sahih al-Bukhari 1549; Sahih Muslim 1184).',
    ],
    hadith: [
      {
        excerpt:
          "Aisyah berkata: Aku biasa memakaikan wangian pada Rasulullah ﷺ untuk ihramnya sebelum beliau masuk ihram...",
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
      "Bawa sekurang-kurangnya dua set ihram untuk lelaki; sediakan keperluan mandi tanpa wangian.",
      "Latih talbiyah sebelum berlepas supaya lancar dalam perjalanan.",
    ],
  },
  {
    title: "Larangan ihram",
    summary: "Apa yang mesti dielakkan muhrim sehingga keluar dari keadaan suci.",
    body: [
      "Dalam ihram, elakkan: bagi lelaki — pakaian dijahit/menutup badan dan menutup kepala; wangian; memotong rambut atau kuku; memburu haiwan darat; akad atau melaksanakan nikah; dan hubungan suami-isteri. Perempuan elakkan wangian dan larangan lain yang sama sambil memakai pakaian sopan.",
      "Melanggar larangan boleh memerlukan fidyah — biasanya puasa, memberi makan fakir miskin, atau korban — bergantung pada perbuatan. Mazhab mengklasifikasikan butirannya berbeza. Patuhi larangan dengan berhati-hati dan tanya pemandu yang berkompeten jika sesuatu berlaku di luar jangkaan.",
    ],
    actions: ["Jauhkan wangian, pemotong kuku, dan gunting dari jangkauan mudah semasa ihram."],
    madhhabNote:
      "Senarai pelanggaran dan fidyahnya berbeza antara mazhab. Anggap ini senarai amaran praktikal, kemudian sahkan butiran dengan mazhab atau pemandu Haji anda.",
  },
  {
    title: "Umrah — ihram dan talbiyah",
    summary: "Masuk keadaan suci di atau sebelum miqat, kemudian membalas panggilan Allah.",
    body: [
      "Di atau sebelum miqat, mandi jika mampu, pakai pakaian ihram, bentuk niat Umrah, dan mulakan talbiyah. Keadaan suci bermula dengan niat itu.",
      "Ulangi talbiyah kerap semasa menuju Makkah sehingga tawaf dimulakan. Ia pernyataan bahawa anda membalas panggilan Allah semata-mata.",
    ],
    actions: ["Gunakan senarai semak Umrah untuk menandakan setiap manasik apabila selesai."],
    appLinks: [
      {
        label: "Senarai semak Umrah",
      },
    ],
  },
  {
    title: "Tawaf Ka'bah",
    summary: "Tujuh kali mengelilingi lawan arah jam, bermula dari Hajar Aswad.",
    body: [
      "Kelilingi Ka'bah tujuh kali lawan arah jam, bermula dan berakhir di sudut Hajar Aswad. Cium, sentuh, atau arahkan ke sana sambil bertakbir jika sesak — mengikut amalan Nabi ﷺ tanpa mencederakan orang lain.",
      "Lelaki melakukan raml (langkah pantas) pada tiga pusingan pertama dan idtiba' (membuka bahu kanan) dalam tawaf ketibaan Umrah ini, menurut sunnah yang masyhur.",
      "Antara Rukun Yamani dan Hajar Aswad digalakkan membaca: \"Rabbana atina fid-dunya hasanah wa fil-akhirati hasanah wa qina 'adzaban-nar\" (Al-Qur'an 2:201).",
    ],
    quran: [
      {
        excerpt:
          "Wahai Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka.",
      },
    ],
  },
  {
    title: "Dua rakaat dan Zamzam",
    summary: "Solat di belakang Maqam Ibrahim jika boleh, kemudian minum Zamzam.",
    body: [
      'Selepas tawaf, solat dua rakaat di belakang Maqam Ibrahim jika ada ruang, atau di tempat lain dalam masjid jika sesak — selaras firman Allah: "...Dan jadikanlah sebahagian tempat berdiri Ibrahim sebagai tempat solat..." (Al-Qur\'an 2:125).',
      "Kemudian minum air Zamzam. Riwayat Jabir tentang haji Nabi ﷺ termasuk minum Zamzam selepas tawaf; Nabi ﷺ bersabda Zamzam untuk apa jua niat minumnya (riwayat sahih dikumpulkan ulama mutakhir; galakkan niat dan doa).",
    ],
    quran: [
      {
        excerpt: "...Dan jadikanlah sebahagian tempat berdiri Ibrahim sebagai tempat solat...",
      },
    ],
  },
  {
    title: "Sa'i antara Safa dan Marwah",
    summary: "Tujuh kali perjalanan mengenang pencarian air Hajar.",
    body: [
      "Allah berfirman: \"Sesungguhnya Safa dan Marwah termasuk syi'ar-syi'ar Allah. Barangsiapa mengerjakan haji ke Baitullah atau umrah, maka tiada dosa baginya berjalan di antaranya...\" (Al-Qur'an 2:158).",
      "Berjalan tujuh kali antara Safa dan Marwah, bermula dari Safa. Di Safa, hadap Ka'bah, angkat tangan bertakbir dan berdoa seperti Nabi ﷺ. Lelaki berlari kecil antara penanda hijau.",
    ],
    quran: [
      {
        excerpt:
          "Sesungguhnya Safa dan Marwah termasuk syi'ar-syi'ar Allah. Barangsiapa mengerjakan haji ke Baitullah atau umrah, maka tiada dosa baginya berjalan di antaranya...",
      },
    ],
  },
  {
    title: "Halq atau taqsir — menyelesaikan Umrah",
    summary:
      "Lelaki mencukur atau memotong; perempuan memotong panjang hujung jari — lalu ihram terangkat.",
    body: [
      "Lelaki mencukur kepala (halq) — yang Nabi ﷺ doakan tiga kali — atau memotong rata (taqsir). Perempuan mengumpulkan rambut dan memotong kira-kira panjang hujung jari. Dengan ini, Umrah selesai dan larangan ihram terangkat.",
      "Abdullah ibn Umar meriwayatkan bahawa Rasulullah ﷺ bersabda: 'Ya Allah, rahmatilah yang mencukur kepalanya.' Mereka berkata: 'Dan yang memotong, ya Rasulullah?' Beliau bersabda: 'Ya Allah, rahmatilah yang mencukur kepalanya.' Mereka berkata: 'Dan yang memotong, ya Rasulullah?' Beliau bersabda kali ketiga: 'Dan yang memotong' (Sahih al-Bukhari 1727; Sahih Muslim 1301).",
    ],
    hadith: [
      {
        excerpt: "Ya Allah, rahmatilah yang mencukur kepalanya... Dan (kali ketiga) yang memotong.",
      },
      {
        excerpt:
          "Ya Allah, ampunilah yang mencukur kepalanya... kemudian beliau bersabda kali ketiga: dan yang memotong rambut pendek.",
      },
    ],
  },
  {
    title: "8 Zulhijjah — Hari Tarwiyah",
    summary: "Masuk ihram untuk Haji dan menghabiskan hari di Mina.",
    body: [
      "Bagi jemaah Tamattu': bentuk niat Haji dan masuk ihram semula dari tempat tinggal di Makkah, perbaharui talbiyah. Jemaah Ifrad dan Qiran sudah dalam ihram.",
      "Berlepas ke Mina dan solat Zohor, Asar, Maghrib, Isyak, dan Subuh berikutnya, masing-masing dipendekkan dua rakaat pada waktunya, mengikut amalan Nabi ﷺ dalam Haji Wada' sebagaimana diriwayatkan Jabir (Sahih Muslim 1218). Habiskan hari dan malam dalam ibadah, menanti Arafah.",
    ],
    hadith: [
      {
        excerpt:
          "Riwayat panjang Jabir tentang Haji Wada' Nabi ﷺ — termasuk tinggal di Mina dan turutan manasik.",
      },
    ],
    actions: ["Buka senarai semak Haji pada pagi 8 haribulan."],
    appLinks: [
      {
        label: "Senarai semak Haji",
      },
    ],
  },
  {
    title: "9 Zulhijjah — Hari Arafah",
    summary: "Wukuf di Arafah sehingga matahari terbenam; kemudian bergerak ke Muzdalifah.",
    body: [
      'Kekal dalam batas Arafah dari selepas zohor sehingga matahari terbenam dalam doa, zikir, dan taubat. Nabi ﷺ bersabda "Haji adalah Arafah" (Sunan Abi Dawud 1949). Hadap kiblat, angkat tangan, dan mohon kepada Allah — termasuk masa terbesar untuk doa.',
      "Solat Zohor dan Asar jamak dan qasar pada waktu Zohor (jam' taqdim), kemudian isi baki hari dengan doa bukan solat sunat — mengikut amalan Nabi ﷺ (Sahih Muslim 1218).",
      "Selepas matahari terbenam, berlepas dengan tenang ke Muzdalifah. Jamak Maghrib dan Isyak (Isyak qasar), rehat malam, dan kumpulkan kerikil untuk melontar. Orang lemah dan wanita boleh berlepas ke Mina selepas tengah malam menurut kelonggaran masyhur dalam sunnah.",
    ],
    hadith: [
      {
        excerpt: "Haji adalah Arafah.",
      },
      {
        excerpt:
          "Nabi ﷺ jamak Zohor dan Asar di Arafah, kemudian berlepas selepas matahari terbenam ke Muzdalifah...",
      },
    ],
  },
  {
    title: "10 Zulhijjah — Hari Nahr",
    summary: "Melontar, menyembelih, memotong rambut, dan Tawaf Ifadhah.",
    body: [
      "Kembali menuju Mina dan lontar tujuh kerikil ke Jamrat al-Aqaba (tiang besar), ucapkan Allahu akbar setiap lontaran — manasik pertama hari itu dalam turutan Haji Wada'.",
      "Tunaikan korban wajib Tamattu' dan Qiran (Al-Qur'an 2:196), atau atur melalui agensi dipercayai. Daging dimakan dan diberikan kepada fakir miskin.",
      "Cukur (halq) atau potong (taqsir); perempuan potong panjang hujung jari. Selepas melontar dan cukur/potong, tahallul awwal terpakai — kebanyakan larangan ihram terangkat kecuali hubungan suami-isteri.",
      "Pergi ke Makkah untuk Tawaf Ifadhah — rukun Haji — dan sa'i bagi jemaah Tamattu' (Ifrad/Qiran yang sudah sa'i dengan tawaf ketibaan ikuti fatwa mazhabnya). Ini melengkapkan pelepasan penuh dari ihram.",
    ],
    quran: [
      {
        excerpt:
          "...Barangsiapa ingin mengerjakan umrah sebelum haji, (hewan korban) yang mudah didapat...",
      },
    ],
    madhhabNote:
      "Turutan manasik Hari Nahr mempunyai fleksibiliti dalam sunnah; mazhab berbeza tentang turutan tepat dan bila sa'i wajib untuk setiap jenis Haji. Ikuti pemandu rombongan anda.",
  },
  {
    title: "11–13 Zulhijjah — Hari Tasyriq",
    summary: "Malam di Mina, melontar tiga Jamrat setiap hari, kemudian tawaf wada'.",
    body: [
      "Habiskan malam 11, 12 (dan 13 jika tidak pulang lebih awal) di Mina. Hari-hari makan, minum, dan mengingati Allah.",
      "Setiap petang selepas Zohor, lontar tujuh kerikil ke masing-masing tiga tiang mengikut turutan — kecil, tengah, kemudian besar — dengan takbir setiap lontaran. Sesiapa mempercepatkan boleh pulang selepas melontar pada 12 (Al-Qur'an 2:203).",
      "Sebelum meninggalkan Makkah, lakukan Tawaf Wada' supaya amal terakhir dengan Baitullah ialah perpisahan. Ibn Abbas meriwayatkan umat diperintahkan agar manasik terakhir di Baitullah, kecuali dilonggarkan bagi wanita haid (Sahih al-Bukhari 1755; Sahih Muslim 1328).",
    ],
    quran: [
      {
        excerpt:
          "Dan berzikirlah kepada Allah pada hari-hari yang tertentu. Barangsiapa mempercepatkan (kepulangan) dalam dua hari, maka tiada dosa baginya; dan barangsiapa menangguhkan, maka tiada dosa baginya — bagi yang bertakwa...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Umat diperintahkan menunaikan tawaf wada' Ka'bah sebagai manasik terakhir, kecuali wanita haid yang dikecualikan.",
      },
      {
        excerpt:
          "Umat diperintahkan agar manasik terakhir di Baitullah, namun dilonggarkan bagi wanita yang sedang haid.",
      },
    ],
  },
  {
    title: "Rukun dan kewajipan",
    summary: "Apa yang membatalkan Haji jika terlepas, dan apa yang ditetapkan dengan dam.",
    body: [
      "Rukun (arkan) ialah inti Haji. Jika rukun terlepas, haji batal dan tidak boleh diperbaiki dengan korban sahaja — mesti diqadha. Majoriti biasanya menyenaraikan: ihram (niat), wukuf di Arafah, Tawaf Ifadhah, dan sa'i.",
      "Kewajipan (wajibat) termasuk masuk ihram dari miqat, bermalam di Muzdalifah, melontar Jamrat, bermalam malam Tasyriq di Mina, dan Tawaf Wada'. Meninggalkan kewajipan tidak membatalkan Haji tetapi ditetapkan dam (korban) menurut mazhab.",
    ],
    madhhabNote:
      "Senarai arkan dan wajibat tepat berbeza antara empat mazhab. Sahkan dengan pemandu berkompeten untuk mazhab anda — terutamanya jika sesuatu terlepas kerana tekanan keramaian.",
  },
  {
    title: "Adab dan keikhlasan",
    summary: "Jaga lidah dan anggota badan — penerimaan berkait dengan akhlak.",
    body: [
      "Hadis tentang kembali tanpa dosa (Bukhari 1521; Muslim 1350) menjelaskan haji rosak oleh kekejian (rafath), dosa (fusuq), dan pertengkaran. Sabar, lemah lembut, dan menolong sesama jemaah sebahagian ibadah.",
      "Jangan biarkan telefon dan sembang kosong mendominasi Arafah dan masjid. Beri laluan dalam tawaf; jangan tolak ke Hajar Aswad. Haji mabrur teman Syurga — usahakan akhlak mulia sepanjang perjalanan.",
    ],
    hadith: [
      {
        excerpt:
          "Sesiapa menunaikan haji kerana Allah dan tidak bercampur dengan isteri serta tidak berbuat dosa, maka ia kembali seperti pada hari ibunya melahirkannya.",
      },
    ],
    actions: ["Tetapkan niat harian: satu amal kebaikan dan satu doa ikhlas di atas keramaian."],
  },
  {
    title: "Visa dan pendaftaran",
    summary: "Gunakan saluran rasmi — Nusuk dan pihak berkuasa Haji kebangsaan anda.",
    body: [
      "Nusuk (nusuk.sa) ialah platform rasmi Arab Saudi untuk Haji dan Umrah — visa, penginapan, pengangkutan, dan pakej berdaftar. Ejen tidak rasmi sering menjadi sumber penipuan.",
      "Setiap negara menerima kuota haji tahunan; kebanyakan jemaah memohon melalui pihak berkuasa Haji kebangsaan atau ejen berlesen. Umrah tidak berkuota dan boleh diatur sepanjang tahun melalui saluran rasmi.",
    ],
    actions: [
      "Daftar lebih awal apabila musim dibuka.",
      "Tempah hanya melalui agensi berdaftar Nusuk atau pihak berkuasa kebangsaan anda.",
      "Sahkan saluran pembayaran sebelum memindahkan wang.",
    ],
  },
  {
    title: "Barang bawaan",
    summary: "Ihram, keperluan mandi tanpa wangian, dokumen, dan keselesaan berjalan.",
    body: [
      "Lelaki: sekurang-kurangnya dua set pakaian ihram tidak dijahit dan tali pinggang untuk dokumen. Perempuan: pakaian longgar sopan. Sandal terbuka yang mudah dipakai; beg kecil dan botol air.",
      "Bawa sabun tanpa wangian dan pelindung matahari — wangian dilarang dalam ihram. Simpan pasport, cetakan visa, rekod vaksin, dan kenalan kecemasan dalam beg nipis. Power bank dan SIM tempatan atau eSIM membantu dalam keramaian.",
    ],
    actions: [
      "Senarai semak: ihram ×2, sandal, keperluan mandi tanpa wangian, beg dokumen, ubat, power bank.",
      "Bawa plaster lepuh — jemaah haji berjalan jauh.",
    ],
  },
  {
    title: "Tempat suci sekilas",
    summary: "Makkah, Madinah, Mina, Arafah, dan Muzdalifah — nota praktikal.",
    body: [
      "Masjid al-Haram mengelilingi Ka'bah — tempat tawaf dan sa'i; keramaian sangat sesak. Masjid an-Nabawi di Madinah bukan sebahagian Haji sendiri tetapi kebanyakan jemaah berkunjung; kemasukan Rawdah dijadualkan melalui aplikasi rasmi.",
      "Mina ialah bandar khemah untuk malam 8 dan 11–13 Zulhijjah. Arafah ialah dataran terbuka — hidrasi dan teduhan penting pada 9 haribulan. Muzdalifah tempat jemaah berehat di bawah langit terbuka dan mengumpulkan kerikil — kemudahan sengaja minimal.",
    ],
    actions: ["Kaji peta ringkas Mina–Arafah–Muzdalifah sebelum berlepas."],
  },
  {
    title: "Sumber rasmi",
    summary: "Nusuk, pihak berkuasa kebangsaan anda, dan Visit Saudi.",
    body: [
      "Mulakan dengan Nusuk untuk visa, pakej, permit Rawdah, dan panduan keramaian. Gunakan kementerian Haji negara anda untuk kuota dan peraturan kesihatan. Visit Saudi menerbitkan panduan kemasukan dan perjalanan umum.",
      "Jika tawaran kelihatan terlalu murah atau ejen meminta bayaran di luar saluran rasmi, sahkan terus melalui portal kementerian sebelum membayar.",
    ],
    actions: [
      "Tandakan nusuk.sa dan laman pihak berkuasa Haji kebangsaan anda.",
      "Simpan kenalan kecemasan daripada ketua rombongan.",
    ],
  },
];

export const HAJJ_CHECKLIST_MS: DeepPartial<PilgrimageChecklistItem>[] = [
  {
    title: "Masuk ihram untuk Haji",
    hint: "Niat Haji dan masuk ihram (dari Makkah untuk tamattu'); perbaharui talbiyah.",
    day: "8 Zulhijjah",
  },
  {
    title: "Berlepas ke Mina",
    hint: "Solat Zohor hingga Subuh di Mina, masing-masing qasar pada waktunya.",
    location: "Mina",
    day: "8 Zulhijjah",
  },
  {
    title: "Wukuf di Arafah",
    hint: "Kekal di Arafah dari selepas zohor sehingga matahari terbenam dalam doa dan zikir.",
    location: "Arafah",
    day: "9 Zulhijjah",
  },
  {
    title: "Jamak Zohor & Asar",
    hint: "Solat Zohor dan Asar jamak qasar pada waktu Zohor, kemudian fokus pada doa.",
    location: "Arafah",
    day: "9 Zulhijjah",
  },
  {
    title: "Pindah ke Muzdalifah",
    hint: "Selepas matahari terbenam, jamak Maghrib dan Isyak, rehat, dan kumpulkan kerikil.",
    location: "Muzdalifah",
    day: "9 Zulhijjah",
  },
  {
    title: "Melontar Jamrat al-Aqaba",
    hint: "Lontarkan tujuh kerikil ke tiang besar dengan takbir setiap lontaran.",
    location: "Mina",
    day: "10 Zulhijjah",
  },
  {
    title: "Menyembelih korban (hady)",
    hint: "Wajib tamattu' dan qiran — sembelih atau atur melalui agensi dipercayai.",
    day: "10 Zulhijjah",
  },
  {
    title: "Halq atau taqsir",
    hint: "Lelaki cukur atau potong; perempuan potong panjang hujung jari (tahallul awwal).",
    day: "10 Zulhijjah",
  },
  {
    title: "Tawaf Ifadhah",
    hint: "Tunaikan Tawaf Ifadhah dan sa'i untuk tamattu' — rukun Haji.",
    location: "Masjid al-Haram",
    day: "10 Zulhijjah",
  },
  {
    title: "Bermalam di Mina",
    hint: "Habiskan malam 11, 12 (dan 13 jika tidak pulang lebih awal) di Mina.",
    location: "Mina",
    day: "11–13 Zulhijjah",
  },
  {
    title: "Melontar tiga Jamrat",
    hint: "Selepas Zohor setiap hari, lontar kecil, tengah, kemudian besar — tujuh setiap satu.",
    location: "Mina",
    day: "11–13 Zulhijjah",
  },
  {
    title: "Tawaf Wada'",
    hint: "Tunaikan Tawaf Wada' sebelum meninggalkan Makkah (wanita haid dikecualikan).",
    location: "Masjid al-Haram",
    day: "Berlepas",
  },
];

export const UMRAH_CHECKLIST_MS: DeepPartial<PilgrimageChecklistItem>[] = [
  {
    title: "Masuk ihram",
    hint: "Di atau sebelum miqat: mandi, pakaian ihram, niat Umrah, talbiyah.",
    location: "Miqat",
  },
  {
    title: "Membaca talbiyah",
    hint: "Ulangi Labbayk… kerap sehingga tawaf dimulakan.",
  },
  {
    title: "Tawaf Ka'bah",
    hint: "Tujuh pusingan lawan arah jam dari Hajar Aswad; lelaki: raml dan idtiba'.",
    location: "Masjid al-Haram",
  },
  {
    title: "Solat dua rakaat",
    hint: "Di belakang Maqam Ibrahim jika boleh, kemudian minum Zamzam.",
    location: "Masjid al-Haram",
  },
  {
    title: "Sa'i antara Safa & Marwah",
    hint: "Tujuh kali perjalanan bermula dari Safa; lelaki berlari kecil antara penanda hijau.",
    location: "Masjid al-Haram",
  },
  {
    title: "Halq atau taqsir",
    hint: "Lelaki cukur atau potong; perempuan potong panjang hujung jari — Umrah selesai.",
  },
];
