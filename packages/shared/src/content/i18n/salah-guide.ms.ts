import type {
  SalahGuidePhrase,
  SalahGuideQuizQuestion,
  SalahGuideTopic,
} from "../../types/salah-guide";
import type { DeepPartial } from "./localize";

// Malay translation overlay for the Learn Salah content. Mirrors SALAH_GUIDE_TOPICS /
// SALAH_GUIDE_PHRASES in ../salah-guide.ts & ../salah-guide-phrases.ts (index-aligned);
// untranslated entries fall back to English. Only human-readable text is translated.
// Arabic script fields (arabic/transliteration) are kept from the English source.

export const SALAH_GUIDE_TOPICS_MS: DeepPartial<SalahGuideTopic>[] = [
  {
    title: "Apakah itu solat?",
    summary: "Rukun Islam yang kedua — pertemuan harian anda yang telah ditetapkan dengan Allah.",
    body: [
      "Solat ialah ibadah khusus yang Allah fardukan ke atas setiap orang beriman: susunan perbuatan berdiri (qiyam), rukuk dan sujud yang tertib, digabungkan dengan lafaz pujian, bacaan Al-Quran dan doa yang tetap, ditunaikan pada lima waktu yang ditentukan setiap hari. Perkataan solat berasal daripada akar kata Arab yang bermaksud hubungan dan doa — ia talian langsung orang beriman kepada Penciptanya tanpa perantara, tanpa memerlukan paderi atau pengantara.",
      "Satu unit solat yang lengkap — dari berdiri hingga sujud kedua — dinamakan satu rakaat. Solat dikira mengikut rakaat: Subuh dua, Maghrib tiga, manakala Zohor, Asar dan Isyak empat. Solat yang wajib dinamakan fardu; solat tambahan yang sentiasa dikerjakan oleh Nabi ﷺ ialah sunat, dan solat pilihan yang dikerjakan secara sukarela ialah nafil.",
      "Berbeza daripada rukun-rukun yang lain, solat tidak diwahyukan melalui malaikat yang turun ke bumi, tetapi difardukan secara langsung kepada Nabi ﷺ ketika baginda diangkat menembusi langit dalam peristiwa Israk dan Mikraj. Pada mulanya lima puluh waktu solat difardukan, kemudian — melalui permohonan Nabi ﷺ berulang kali agar diringankan untuk umatnya — dikurangkan kepada lima waktu yang dikerjakan, namun pahalanya kekal seperti lima puluh.",
      "Inilah sebabnya solat berada di tengah-tengah kehidupan Islam: diulang lima kali sehari, ia menyelangi kerja, rehat dan masa lapang untuk menambat semula hati kepada Allah, dan ia amalan pertama yang akan dihisab daripada seorang hamba pada Hari Kiamat. Jika solatnya didapati baik, amalan-amalan lain biasanya turut baik.",
    ],
    appLinks: [
      {
        label: "Perjalanan ke Syurga",
      },
      {
        label: "Penjejak solat",
      },
    ],
  },
  {
    title: "Mengapa solat?",
    summary: "Buah rohani, akhlak, jiwa dan kekal abadi daripada solat lima waktu.",
    body: [
      "Solat ialah perbualan langsung dengan Allah. Ketika berdiri, anda berbicara kepada-Nya dengan kalam-Nya sendiri yang diwahyukan; ketika sujud — kedudukan paling merendah diri — anda paling hampir kepada-Nya dan paling berkemungkinan dimakbulkan. Tiada ibadah lain yang diulang sekerap dan semesra itu.",
      "Buah pertamanya ialah jiwa yang terkawal dan berdisiplin. Allah sendiri menyatakan tentang solat yang didirikan dengan sempurna: 'sesungguhnya sembahyang itu mencegah dari perbuatan yang keji dan mungkar' (29:45) — orang yang benar-benar berdiri di hadapan Allah lima kali sehari mendapati dosa lebih sukar didekati. Ia juga penyucian yang berulang — Nabi ﷺ mengumpamakan solat lima waktu seperti sungai yang mengalir, tempat seseorang mandi lima kali sehari sehingga tiada kotoran yang tertinggal.",
      "Buah keduanya ialah ketenangan jiwa. Al-Quran menjanjikan bahawa hati menjadi tenteram dengan mengingati Allah, dan Nabi ﷺ, ketika dilanda kerisauan, akan bersabda, 'Give us comfort by it, O Bilal' (makna dalam bahasa Inggeris), sambil menyeru agar solat didirikan. Baginda menyifatkan penyejuk mata baginda dijadikan di dalam solat.",
      "Buah sosial dan kekalnya melengkapkan gambaran ini: solat berjemaah menyamaratakan yang kaya dan yang miskin dalam satu saf serta membina persaudaraan, manakala menjaga solat termasuk jalan paling pasti menuju keampunan Allah dan Syurga. Nabi ﷺ menjanjikan Syurga kepada sesiapa yang memelihara dua solat waktu 'sejuk' (al-bardain), iaitu Subuh dan Asar.",
    ],
    actions: [
      "Tunaikan sekurang-kurangnya satu solat tepat pada waktunya hari ini — istiqamah, bukan kesempurnaan, ialah matlamat pertama.",
      "Baca makna Al-Fatihah sekali sebelum solat anda yang berikutnya supaya anda merasai bahawa doa anda sedang dijawab.",
      "Hidupkan peringatan azan supaya tiada waktu solat yang terlepas tanpa disedari.",
    ],
    appLinks: [
      {
        label: "Peringatan solat",
      },
      {
        label: "Jurnal khusyuk",
      },
    ],
  },
  {
    title: "Kedudukannya dalam Islam",
    summary: "Tiang agama — dan amalan paling berat untuk diabaikan.",
    body: [
      "Nabi ﷺ mengajarkan bahawa Islam dibina di atas lima rukun, dan solat ialah yang kedua, sejurus selepas dua kalimah syahadah. Syahadah memasukkan anda ke dalam Islam; solat pula bukti berterusan bahawa syahadah itu hidup di dalam hati anda. Inilah sebabnya para ulama menamakan solat 'tiang agama' — rumah tanpa tiang serinya akan runtuh.",
      "Beratnya kelihatan pada cara nas-nas menyebut tentang mengabaikannya. Al-Quran memberi amaran tentang satu generasi yang 'mencuaikan sembahyang serta menurut hawa nafsu' (19:59) dan mengkhabarkan kebinasaan mereka, manakala Nabi ﷺ menyifatkan solat sebagai perjanjian yang membezakan antara iman dan kufur.",
      "Tentang hukum orang yang meninggalkan solat, terdapat perbezaan pendapat yang masyhur dan saling menghormati dalam kalangan ulama Ahli Sunnah. Sebahagian berpendapat bahawa meninggalkannya sama sekali dengan sengaja — walaupun masih mengakui kewajipannya — adalah kufur besar yang mengeluarkan seseorang daripada Islam; majoriti (Hanafi, Maliki, Syafie) berpendapat orang itu kekal sebagai Muslim yang berdosa dan melakukan salah satu dosa besar yang paling berat, selagi dia tidak mengingkari kewajipannya. Semua bersepakat bahawa meninggalkan solat adalah malapetaka, dan sesiapa yang mengingkari kewajipannya telah keluar daripada Islam secara ijmak.",
      "Pengajaran praktikalnya sama menurut setiap pandangan: menjaga solat lima waktu bukan pilihan dan tidak boleh ditawar-tawar bagi orang beriman. Solat sukarela (sunat dan nafil) pula berperanan sebagai jaring keselamatan, menampung kekurangan dalam solat fardu pada Hari Pembalasan.",
    ],
    disclaimer:
      "Ulama berbeza pendapat tentang hukum sebenar bagi orang yang meninggalkan solat kerana malas (dosa besar menurut majoriti; kufur menurut sebahagian yang lain) berbanding orang yang mengingkari kewajipannya (kufur secara ijmak). Aplikasi ini tidak menjatuhkan hukum ke atas mana-mana individu — rujuklah ulama yang berkelayakan untuk kes peribadi.",
  },
  {
    title: "Siapakah yang wajib solat?",
    summary:
      "Setiap Muslim yang berakal dan baligh — dengan pengecualian dan kelonggaran yang jelas.",
    body: [
      "Solat menjadi wajib ke atas setiap Muslim yang berakal dan telah baligh. Tiga golongan diangkat sepenuhnya daripada tanggungjawab berdasarkan satu prinsip yang sahih: orang yang tidur sehingga dia bangun, kanak-kanak sehingga dia baligh, dan orang yang hilang akal sehingga akalnya pulih.",
      "Kanak-kanak belum diwajibkan, tetapi mereka dilatih secara beransur-ansur. Nabi ﷺ memerintahkan agar kanak-kanak disuruh solat sejak berumur tujuh tahun dan dididik dengan lembut jika mengabaikannya pada umur sepuluh tahun — supaya apabila baligh, solat sudah menjadi kebiasaan yang mantap, bukan beban yang tiba-tiba.",
      "Wanita yang sedang haid atau nifas tidak solat dalam tempoh itu; solat fardu yang tertinggal tidak perlu diqada selepasnya — satu rahmat dan hukum yang disepakati para ulama. (Puasa yang tertinggal pula, berbeza dengan solat, perlu diqada.) Seorang wanita kembali solat sebaik sahaja darahnya berhenti dan dia telah bersuci dengan mandi wajib.",
      "Ketidakmampuan yang sebenar membawa kelonggaran, bukan pembatalan: sakit yang teruk, tidak sedarkan diri dan ketakutan yang amat sangat boleh menjadi uzur bagi seseorang untuk satu tempoh, dan orang sakit solat mengikut kemampuannya — duduk, berbaring, atau dengan isyarat sekalipun. Musafir tidak menggugurkan solat tetapi meringankannya melalui qasar dan jamak, yang dihuraikan dalam panduan Solat Musafir.",
    ],
    appLinks: [
      {
        label: "Panduan haid",
      },
      {
        label: "Solat ketika sakit",
      },
      {
        label: "Solat musafir",
      },
    ],
  },
  {
    title: "Syarat sebelum solat",
    summary: "Sembilan syarat (syurut) yang mesti dipenuhi agar solat sah.",
    body: [
      "Sebelum solat boleh sah, beberapa syarat (syurut solat) mesti dipenuhi. Syarat berbeza daripada rukun: syarat ialah perkara yang mesti ada sebelum anda memulakan solat dan berterusan sepanjangnya, manakala rukun (arkan) ialah bahagian daripada solat itu sendiri. Jika syarat yang diwajibkan tidak dipenuhi, solat tidak diterima walau sebaik mana pun ia dikerjakan.",
      "Anggaplah sembilan perkara ini sebagai senarai semak sebelum berlepas. Kebanyakannya berkait dengan pelajaran yang lebih lengkap di bahagian lain panduan ini — ketik untuk mempelajari setiap satu dengan mendalam. Dua daripadanya (menghadap kiblat dan masuk waktu) boleh dimaafkan apabila benar-benar tidak mampu; selebihnya wajib dipenuhi selagi seseorang mampu.",
    ],
    steps: [
      {
        title: "Islam",
        body: "Solat ialah amalan seorang Muslim; ia tidak sah daripada — dan tidak diwajibkan ke atas — orang bukan Islam sehingga dia memeluk Islam.",
      },
      {
        title: "Berakal ('aql)",
        body: "Seseorang mesti waras akalnya. Orang yang hilang akal tidak dipertanggungjawabkan selama dia berada dalam keadaan itu.",
      },
      {
        title: "Mumaiyiz (tamyiz)",
        body: "Keupayaan untuk membezakan, yang dicapai sekitar umur tujuh tahun — umur kanak-kanak mula disuruh solat.",
      },
      {
        title: "Suci daripada hadas kecil & besar",
        body: "Berada dalam keadaan berwuduk, atau telah mandi wajib selepas hadas besar, atau bertayamum apabila air tidak dapat digunakan.",
      },
      {
        title: "Suci daripada najis",
        body: "Badan, pakaian dan tempat solat mesti bebas daripada najis seperti air kencing, darah dalam kuantiti yang banyak, dan bahan-bahan lain yang disenaraikan.",
      },
      {
        title: "Menutup aurat",
        body: "Bahagian yang wajib ditutup hendaklah ditutup dengan pakaian yang bersih dan tidak jarang — lihat pelajaran Pakaian & aurat.",
      },
      {
        title: "Telah masuk waktu solat",
        body: "Setiap solat mempunyai tempoh waktu yang ditetapkan; solat sebelum masuk waktunya tidak sah. Gunakan jadual dan peringatan anda.",
      },
      {
        title: "Menghadap kiblat",
        body: "Menghadap ke arah Kaabah setepat yang anda mampu tentukan — hanya dimaafkan apabila benar-benar tidak mampu.",
      },
      {
        title: "Niat",
        body: "Menetapkan di dalam hati solat mana yang hendak anda kerjakan. Ia amalan hati dan tidak dilafazkan dengan kuat.",
      },
    ],
    appLinks: [
      {
        label: "Bersuci (Taharah)",
      },
      {
        label: "Kompas kiblat",
      },
      {
        label: "Jadual solat",
      },
    ],
    disclaimer:
      "Mazhab-mazhab sedikit berbeza dalam menyebut dan mengira syarat-syarat ini (sebahagiannya memasukkan niat dalam rukun, bukan syarat). Intipatinya disepakati.",
  },
  {
    title: "Bersuci (Taharah)",
    summary: "Kesucian diri, pakaian dan tempat — pintu masuk bagi setiap solat.",
    body: [
      "Taharah bermaksud mengangkat hadas supaya anda dapat berdiri di hadapan Allah dalam keadaan suci. Allah mengasihi orang-orang yang menyucikan diri, dan Nabi ﷺ mengajarkan bahawa 'purification is half of faith' (makna dalam bahasa Inggeris). Tiada solat yang diterima tanpanya.",
      "Hadas terbahagi kepada dua. Hadas kecil — disebabkan perkara seperti membuang air atau terkentut — diangkat dengan wuduk. Hadas besar (janabah) — selepas bersetubuh, keluar mani, atau berakhirnya haid dan nifas — diangkat dengan mandi wajib.",
      "Selain keadaan hadas ini, najis yang nyata — seperti air kencing, tahi, darah yang mengalir dan seumpamanya — mesti dibersihkan secara fizikal daripada badan, pakaian dan tempat anda solat. Seseorang boleh sahaja mempunyai wuduk yang sah tetapi masih perlu membersihkan kesan najis pada pakaiannya sebelum solat.",
      "Air ialah alat bersuci yang utama. Apabila air benar-benar tiada, atau penggunaannya akan memudaratkan anda kerana sakit atau sejuk yang melampau, Islam membenarkan tayamum — bersuci tanpa air menggunakan tanah yang bersih — sebagai pengganti yang sempurna. Bersuci tidak sekali-kali bertujuan menyusahkan; ia jalan untuk mendekatkan diri.",
    ],
    actions: [
      "Pelajari wuduk langkah demi langkah sebelum solat anda yang berikutnya supaya setiap anggota dibasuh dengan betul.",
      "Sediakan sepasang pakaian bersih khas untuk solat jika anda bekerja di persekitaran yang kotor.",
      "Perhatikan tempat solat anda daripada najis yang kelihatan sebelum membentangkan sejadah.",
    ],
    appLinks: [
      {
        label: "Panduan bersuci lengkap",
      },
      {
        label: "Pelajaran wuduk",
      },
    ],
  },
  {
    title: "Wuduk",
    summary: "Basuhan tertib yang mengangkat hadas kecil dan menyediakan anda untuk solat.",
    body: [
      "Wuduk ialah basuhan ibadah yang mengangkat hadas kecil. Ia wajib sebelum setiap solat kecuali anda masih berwuduk daripada solat sebelumnya, dan — menurut majoriti ulama — sebelum menyentuh mushaf Al-Quran. Empat basuhan wajibnya disebut secara langsung dalam Al-Quran (5:6): muka, tangan hingga ke siku, menyapu kepala, dan kaki hingga ke buku lali.",
      "Nabi ﷺ berwuduk dengan tertib yang tetap, membasuh anggota tiga kali, dengan sempurna tetapi tanpa membazir air — baginda melarang pembaziran walaupun di sungai yang mengalir. Selain empat perbuatan wajib itu, berkumur, memasukkan air ke hidung, membasuh tangan terlebih dahulu dan bersugi ialah sunat-sunat yang sabit yang menyempurnakan dan mencantikkan wuduk.",
      "Ganjarannya amat besar: Nabi ﷺ mengajarkan bahawa apabila seorang mukmin membasuh setiap anggota, dosa yang dilakukan oleh anggota itu gugur bersama air — hingga dari bawah kuku — sehingga dia keluar dalam keadaan bersih. Maka wuduk bukan sekadar formaliti, tetapi satu bentuk keampunan kecil sebelum setiap solat.",
      "Wuduk batal dengan apa sahaja yang keluar dari qubul atau dubur (air kencing, najis, angin), tidur nyenyak yang menghilangkan kesedaran, dan hilang akal. Jika wuduk batal ketika solat, anda mesti berhenti, mengambil wuduk semula, dan memulakan solat dari awal.",
    ],
    steps: [
      {
        title: "Niat & Bismillah",
        body: "Niatkan wuduk di dalam hati dan mulakan dengan 'Bismillah'. Niat ialah perbuatan hati dan tidak perlu dilafazkan.",
        tip: "Bersugilah dengan miswak (siwak) terlebih dahulu jika boleh — sunnah yang dikasihi Nabi ﷺ dan hampir baginda wajibkan.",
      },
      {
        title: "Membasuh tangan",
        body: "Basuh kedua-dua tangan hingga ke pergelangan sebanyak tiga kali, sambil menyelati celah-celah jari dengan air.",
      },
      {
        title: "Berkumur",
        body: "Masukkan air ke dalam mulut, kumur-kumurkan, lalu buang — sebanyak tiga kali.",
      },
      {
        title: "Memasukkan air ke hidung",
        body: "Sedut air ke dalam lubang hidung dengan tangan kanan dan hembuskannya keluar dengan tangan kiri — sebanyak tiga kali.",
      },
      {
        title: "Membasuh muka (fardu)",
        body: "Basuh seluruh muka sekali hingga tiga kali, dari tempat tumbuh rambut hingga ke dagu dan dari telinga ke telinga; lelaki menyelati janggut yang tebal dengan jari yang basah.",
      },
      {
        title: "Membasuh tangan hingga siku (fardu)",
        body: "Basuh tangan kanan, kemudian tangan kiri, dari hujung jari hingga ke siku termasuk siku — tiga kali setiap satu.",
      },
      {
        title: "Menyapu kepala (fardu)",
        body: "Dengan tangan yang basah, sapu kepala sekali dari depan ke belakang dan kembali semula, kemudian sapu bahagian dalam dan belakang telinga dengan basahan yang sama.",
      },
      {
        title: "Membasuh kaki (fardu)",
        body: "Basuh kaki kanan, kemudian kaki kiri, hingga ke buku lali termasuk buku lali — tiga kali setiap satu, sambil menyelati celah-celah jari kaki.",
      },
      {
        title: "Syahadah",
        body: "Sempurnakan dengan doa: 'Ashhadu an la ilaha illallah…' — lapan pintu Syurga dibukakan bagi sesiapa yang membacanya selepas berwuduk.",
      },
    ],
    actions: [
      "Ambil wuduk perlahan-lahan sekali sambil membaca setiap langkah dengan kuat, dan pastikan siku dan tumit dibasuh.",
      "Hafal doa ringkas selepas wuduk — lihat Bacaan Solat.",
    ],
    appLinks: [
      {
        label: "Wuduk & doa berkaitan",
      },
      {
        label: "Bacaan solat",
      },
    ],
  },
  {
    title: "Tayamum — bersuci tanpa air",
    summary:
      "Apabila air tidak dapat digunakan, tanah yang bersih mengangkat hadas supaya solat tidak tertangguh.",
    body: [
      "Tayamum ialah cara bersuci tanpa air yang Allah syariatkan apabila air benar-benar tiada, atau apabila penggunaannya akan memudaratkan kerana sakit atau sejuk yang melampau. Ia bukan jalan pintas yang lebih rendah demi kemudahan — ia pengganti yang sempurna yang mengangkat hadas kecil atau besar untuk solat sehingga air dapat digunakan semula.",
      "Al-Quran menyebutnya dalam ayat yang sama dengan wuduk dan mandi wajib (5:6): sapulah muka dan tangan dengan tanah yang bersih selepas menepuknya. Nabi ﷺ mengajarkan kelonggaran ini kepada para sahabat sebagai rahmat, bukan sebagai helah untuk tidak mencari air apabila air boleh didapati dengan munasabah.",
      "Secara praktikal: niatkan tayamum, bacalah Bismillah, tepuk tanah yang bersih sekali (atau dua kali menurut sebahagian mazhab), sapu muka, kemudian sapu tangan hingga ke pergelangan (ramai ulama memasukkan hingga ke siku selaras dengan wuduk). Apa yang membatalkan wuduk atau mandi wajib turut membatalkan tayamum yang berkenaan; apabila air yang boleh digunakan ditemui, kelonggaran itu tamat dan anda kembali kepada cara bersuci yang biasa.",
      "Jika anda telah solat dengan sah menggunakan tayamum dan hanya menemui air selepas itu, majoriti ulama berpendapat solat yang telah selesai tidak perlu diulang. Jika air ditemui sebelum anda solat, anda wajib menggunakannya. Bagi simen tulang (plaster), luka dan penyakit, gabungkan sapuan di atas balutan dengan tayamum sebagaimana yang dinasihatkan oleh mazhab dan doktor anda — lihat panduan Taharah lengkap untuk perincian.",
    ],
    steps: [
      {
        title: "Pastikan keperluannya",
        body: "Carilah air yang boleh digunakan dengan munasabah, atau pastikan bahawa penggunaan air akan memudaratkan anda (sakit, sejuk yang melampau, nasihat perubatan).",
      },
      {
        title: "Niat & Bismillah",
        body: "Niatkan tayamum sebagai ganti wuduk atau mandi wajib, dan mulakan dengan Bismillah.",
      },
      {
        title: "Tepuk tanah yang bersih",
        body: "Tepuk tanah yang bersih (atau permukaan berdebu yang bersih) dengan kedua-dua tangan sekali — sebahagian mazhab menepuk dua kali.",
      },
      {
        title: "Sapu muka",
        body: "Sapu seluruh muka dengan debu yang tinggal pada tangan.",
      },
      {
        title: "Sapu tangan",
        body: "Sapu kedua-dua tangan — sekurang-kurangnya hingga ke pergelangan; ramai ulama menyapu hingga ke siku.",
      },
    ],
    actions: [
      "Ketahui bila tayamum dibenarkan sebelum bermusafir atau jatuh sakit supaya solat tidak pernah ditinggalkan kerana ketiadaan air.",
      "Buka pelajaran tayamum dalam panduan Taharah lengkap untuk perbezaan mazhab tentang cara menepuk dan menyapu.",
    ],
    appLinks: [
      {
        label: "Taharah lengkap — tayamum",
      },
      {
        label: "Gambaran keseluruhan bersuci",
      },
    ],
    disclaimer:
      "Mazhab-mazhab berbeza dalam perincian (sekali atau dua kali tepukan, hingga pergelangan atau siku, memperbaharui tayamum bagi setiap solat). Ini ringkasan pendidikan arus perdana — ikutilah ilmu ulama tempatan yang dipercayai dalam amalan anda.",
  },
  {
    title: "Pakaian & aurat",
    summary: "Tutuplah apa yang wajib ditutup — dengan bersih, sopan dan penuh hormat.",
    body: [
      "Menutup aurat — bahagian tubuh yang wajib ditutup — ialah syarat sah solat, diambil daripada perintah Allah: 'Pakailah pakaian kamu yang indah berhias pada tiap-tiap kali kamu ke tempat ibadat' (7:31). Pakaian mesti bersih daripada najis dan cukup tebal sehingga warna kulit tidak kelihatan.",
      "Bagi lelaki, aurat dalam solat sekurang-kurangnya ialah antara pusat dan lutut. Namun, solat tanpa baju sedangkan pakaian ada adalah makruh; Nabi ﷺ memerintahkan agar lelaki tidak solat dengan sehelai kain tanpa sebahagiannya menutupi bahu.",
      "Bagi wanita, seluruh tubuh ialah aurat dalam solat kecuali muka dan tapak tangan, menurut majoriti ulama; wanita menutup rambut, leher dan kaki, biasanya dengan pakaian longgar dan tudung (atau telekung). Ulama berbeza pendapat tentang kaki, sebahagian menganggapnya termasuk bahagian yang boleh didedahkan — solat dengan kaki bertutup lebih selamat dan merupakan amalan majoriti.",
      "Dua hukum pakaian turut terpakai di luar solat: sutera dan emas haram dipakai oleh lelaki (dibenarkan bagi wanita), dan pakaian tidak sepatutnya terlalu ketat, jarang atau menarik perhatian sehingga menghilangkan kesopanan yang dituntut oleh solat. Sebagai panduan mudah, solatlah dengan pakaian yang akan anda pakai untuk bertemu orang yang anda hormati — bukan pakaian tidur atau pakaian pantai.",
    ],
    actions: [
      "Sediakan sepasang pakaian yang bersih dan sopan atau pakaian khas untuk solat supaya anda sentiasa bersedia.",
      "Apabila tidak pasti sama ada sesuatu cukup menutup, tutuplah lebih banyak, bukan kurang.",
    ],
    disclaimer:
      "Perincian aurat (terutamanya kaki wanita) ialah perkara khilaf ulama yang saling menghormati. Ikutilah ilmu ulama tempatan yang dipercayai apabila terdapat perbezaan.",
  },
  {
    title: "Waktu solat",
    summary:
      "Lima tempoh waktu harian — setiap solat mempunyai awal, akhir dan saat yang paling afdal.",
    body: [
      "Allah menetapkan solat sebagai 'satu ketetapan yang diwajibkan atas orang-orang yang beriman, yang tertentu waktunya' (4:103), membahagikan siang dan malam kepada lima tempoh waktu yang berkait dengan pergerakan matahari. Solat sebelum masuk waktunya tidak sah; melewatkan solat melepasi waktunya tanpa uzur adalah dosa yang berat. Seboleh-bolehnya, solatlah di awal waktu — Nabi ﷺ menyebut solat pada awal waktunya antara amalan yang paling dicintai Allah.",
      "Lima tempoh waktu itu ialah: Subuh, dari terbit fajar sadiq hingga terbit matahari; Zohor, dari tergelincir matahari hingga bayang-bayang sesuatu objek sama panjang dengan objek itu; Asar, dari tamat waktu Zohor hingga terbenam matahari (paling baik dikerjakan sebelum matahari menguning); Maghrib, dari terbenam matahari hingga hilang syafak merah; dan Isyak, dari hilang syafak hingga terbit fajar sadiq (paling baik dikerjakan sebelum tengah malam).",
      "Terdapat tiga tempoh singkat yang dilarang mengerjakan solat sunat, supaya ibadah tidak sekali-kali menyerupai penyembahan matahari: ketika matahari sedang terbit hingga ia naik sepenuhnya, ketika ia tegak tepat di atas kepala pada tengah hari, dan ketika ia sedang terbenam hingga terbenam sepenuhnya. Mengqada solat fardu yang tertinggal dikecualikan daripada larangan ini.",
      "Waktu jam yang tepat berubah setiap hari mengikut latitud dan musim anda, sebab itulah Nabi ﷺ mengaitkannya dengan tanda-tanda alam, bukan jam yang tetap. Aplikasi ini mengira waktu-waktu itu untuk lokasi anda — tetapi mengetahui tanda-tanda asasnya membuatkan anda tetap berpijak apabila teknologi tiada.",
    ],
    steps: [
      {
        title: "Subuh — 2 rakaat fardu",
        body: "Dari fajar sadiq hingga terbit matahari. Didahului oleh solat sunat 2 rakaat yang sangat dituntut.",
      },
      {
        title: "Zohor — 4 rakaat fardu",
        body: "Selepas matahari tergelincir hingga masuk waktu Asar. Sunat 4 rakaat sebelum dan 2 rakaat selepas.",
      },
      {
        title: "Asar — 4 rakaat fardu",
        body: "Dari tamat waktu Zohor hingga terbenam matahari; kerjakanlah sebelum matahari menguning. Sering dikenal pasti sebagai 'sembahyang Wusta' dalam ayat 2:238.",
      },
      {
        title: "Maghrib — 3 rakaat fardu",
        body: "Dari terbenam matahari hingga hilang syafak; segerakanlah. Sunat 2 rakaat selepas.",
      },
      {
        title: "Isyak — 4 rakaat fardu",
        body: "Dari hilang syafak hingga terbit fajar; paling baik sebelum tengah malam. Diikuti oleh solat Witir.",
      },
    ],
    appLinks: [
      {
        label: "Jadual solat",
      },
      {
        label: "Tetapan peringatan",
      },
    ],
    disclaimer:
      "Awal waktu Asar mempunyai dua pendapat yang diriwayatkan (bayang-bayang sama panjang, atau dua kali panjang objek). Kedua-duanya sah; ikutilah kiraan dan amalan masyarakat tempatan anda.",
  },
  {
    title: "Menghadap kiblat",
    summary: "Menghadap ke arah Baitullah di Makkah — arah yang menyatukan umat.",
    body: [
      "Kiblat ialah arah Kaabah di dalam Masjidil Haram di Makkah. Menghadapnya ialah syarat sah solat. Pada awal Islam, umat Islam solat menghadap Baitulmaqdis; kemudian Allah menurunkan perintah supaya berpaling ke arah Masjidil Haram, dan sejak itu satu arah telah menyatukan umat yang beribadah di seluruh dunia — gambaran fizikal setiap hari tentang satu umat yang menghadap satu Tuhan.",
      "Anda wajib menghadap kiblat setepat yang dapat anda tentukan dengan munasabah — menggunakan kompas, mihrab masjid, aplikasi yang dipercayai, atau matahari dan bintang ketika bermusafir. Penyimpangan kecil yang tidak dapat dielakkan dimaafkan; yang penting ialah usaha bersungguh-sungguh ke arah yang betul.",
      "Jika anda benar-benar tidak dapat menentukan arah — sesat di laut, dalam cuaca berawan, di tempat asing pada waktu malam — anda berusaha (berijtihad) untuk menentukannya, kemudian solat ke arah yang paling kuat pada sangkaan anda; solat itu sah walaupun kemudian didapati sedikit tersasar. Dalam kenderaan atau pesawat yang sedang bergerak di mana menghadap kiblat untuk solat fardu tidak mungkin dilakukan, anda menghadap mana-mana arah yang mampu, kerana Allah tidak membebani seseorang melainkan sesuai dengan kemampuannya.",
    ],
    appLinks: [
      {
        label: "Kompas kiblat",
      },
    ],
  },
  {
    title: "Azan — seruan solat",
    summary: "Lafaz-lafaz yang menyeru umat, maknanya, dan cara menjawabnya.",
    body: [
      "Azan ialah seruan yang memaklumkan bahawa waktu solat telah masuk. Ia sunat kifayah bagi solat lima waktu (bukan bagi solat Hari Raya atau solat jenazah), dilaungkan dari tempat yang tinggi supaya masyarakat berkumpul untuk beribadah. Sejurus sebelum solat bermula, ia diikuti oleh seruan kedua yang lebih ringkas — iqamah.",
      "Apabila anda mendengar azan, sunnahnya ialah mengulangi setiap lafaz selepas muazin — kecuali pada 'Hayya 'ala as-salah' dan 'Hayya 'ala al-falah', yang mana anda sebaliknya menyebut 'La hawla wa la quwwata illa billah' (tiada daya dan tiada kekuatan melainkan dengan Allah). Dalam azan Subuh, muazin menambah 'As-salatu khayrun min an-nawm' (solat itu lebih baik daripada tidur).",
      "Selepas azan selesai, berselawatlah ke atas Nabi ﷺ, kemudian bacalah doa yang sabit memohon Allah mengurniakan baginda kedudukan yang terpuji (al-wasilah) — Nabi ﷺ menjanjikan syafaatnya kepada sesiapa yang membacanya. Saat antara azan dan iqamah ialah waktu doa tidak ditolak, maka berdoalah sebanyak-banyaknya.",
    ],
    steps: [
      {
        title: "Allahu Akbar (×4)",
        body: "Allah Maha Besar — lebih besar daripada apa sahaja yang mungkin melalaikan anda.",
      },
      {
        title: "Ashhadu an la ilaha illallah (×2)",
        body: "Aku bersaksi bahawa tiada tuhan melainkan Allah.",
      },
      {
        title: "Ashhadu anna Muhammadan rasulullah (×2)",
        body: "Aku bersaksi bahawa Muhammad ialah Pesuruh Allah.",
      },
      {
        title: "Hayya 'ala as-salah (×2)",
        body: "Marilah menunaikan solat. Jawablah dengan: La hawla wa la quwwata illa billah.",
      },
      {
        title: "Hayya 'ala al-falah (×2)",
        body: "Marilah menuju kejayaan. Jawablah dengan: La hawla wa la quwwata illa billah.",
      },
      {
        title: "Allahu Akbar (×2)",
        body: "Allah Maha Besar.",
      },
      {
        title: "La ilaha illallah",
        body: "Tiada tuhan melainkan Allah — seruan ini ditutup dengan kalimah yang sama yang menjadi tujuannya sejak awal.",
      },
    ],
    appLinks: [
      {
        label: "Dengar azan",
      },
      {
        label: "Azan & doa solat",
      },
    ],
  },
  {
    title: "Solat langkah demi langkah",
    summary: "Turutan lengkap satu rakaat — setiap bacaan, berserta hukumnya.",
    body: [
      "Setiap solat dibina daripada satu unit yang berulang — rakaat: anda berdiri dan membaca, rukuk, bangkit, sujud dua kali, dan (pada akhir solat) duduk untuk tasyahud lalu memberi salam. Kuasai satu rakaat dengan baik dan anda boleh menunaikan apa sahaja solat, kerana solat yang lebih panjang hanya mengulangi unit ini. Langkah-langkah di bawah memberikan setiap perbuatan mengikut tertib, lafaz Arab yang tepat untuk dibaca berserta maknanya, dan tanda kecil yang menunjukkan sama ada perbuatan itu rukun, perbuatan wajib, atau perbuatan sunat.",
      "Ulama membahagikan perbuatan solat kepada tiga peringkat. Fardu (rukun) ialah perkara asas: jika ditinggalkan — walaupun tersilap — solat itu, atau rakaat itu, tidak sah sehingga ia dilaksanakan. Wajib (perbuatan yang dituntut) adalah wajib, tetapi jika anda terlupa salah satunya, anda memperbaiki solat dengan sujud sahwi tanpa perlu mengulanginya. Sunat pula dianjurkan dan diberi pahala, dan solat tetap sempurna dan sah tanpanya. Apabila mazhab-mazhab fiqh meletakkan sesuatu perbuatan dalam kategori yang berbeza, tip-tip akan menyatakannya — sempadan tiga peringkat ini sendiri merupakan salah satu bidang klasik perbezaan pendapat ulama.",
      "Sepanjang solat, satu sifat yang tidak boleh hilang sama sekali ialah tamakninah — ketenangan: menetap sepenuhnya dalam setiap kedudukan, dengan anggota dalam keadaan diam, sebelum berpindah. Nabi ﷺ menyuruh seorang lelaki yang solat dengan tergesa-gesa mengulangi solatnya sebanyak tiga kali sambil bersabda, 'Go back and pray, for you have not prayed' (makna dalam bahasa Inggeris), kemudian mengajarnya agar tenang dalam setiap kedudukan. Berpindahlah antara kedudukan dengan takbir 'Allahu Akbar', dan pandanglah ke tempat sujud.",
      "Bilangan rakaat dan tempat duduk: solat dua rakaat (Subuh dan Jumaat) mempunyai satu duduk sahaja — tasyahud akhir selepas rakaat kedua — kemudian salam. Solat tiga rakaat (Maghrib) dan solat empat rakaat (Zohor, Asar, Isyak) duduk untuk tasyahud awal yang lebih pendek selepas rakaat kedua, kemudian bangun untuk baki rakaat — dengan membaca Al-Fatihah sahaja tanpa surah tambahan — dan duduk semula untuk tasyahud akhir dan salam.",
      "Kuat atau perlahan: Al-Fatihah dan surah dibaca dengan kuat (jahar) dalam solat Subuh, Jumaat, dan dua rakaat pertama Maghrib dan Isyak; ia dibaca dengan perlahan (sir) dalam Zohor dan Asar, rakaat ketiga Maghrib, dan rakaat ketiga dan keempat Isyak. Setiap bacaan lain dalam solat — tasbih rukuk dan sujud, tasyahud dan sebagainya — dibaca dengan perlahan. Orang yang solat bersendirian boleh membaca dengan kuat dalam solat jahar atau merendahkan suara; makmum di belakang imam hanya mendengar ketika imam membaca dengan kuat.",
      "Sebahagian tambahan khusus bagi solat atau waktu tertentu. Dalam solat Witir, ramai yang membaca Qunut pada rakaat terakhir — mengangkat tangan berdoa memohon petunjuk dan perlindungan (lafaz yang masyhur bermula dengan 'Allahumma-hdini fiman hadayt…'). Pada masa kesusahan, Qunut Nazilah boleh ditambah dalam solat fardu, dan mazhab-mazhab berbeza pendapat tentang Qunut yang tetap dalam solat Subuh. Jika anda menyertai jemaah lewat (masbuq), apa sahaja yang anda sempat bersama imam dikira, dan anda menyempurnakan rakaat yang tertinggal selepas imam memberi salam. Dan jika anda tertambah atau tertinggal sesuatu kerana terlupa, lihat panduan sujud sahwi.",
    ],
    steps: [
      {
        title: "1. Niat & berdiri (qiyam)",
        body: "Menghadap kiblat dan berdiri tegak — berdiri ialah rukun setiap solat fardu bagi sesiapa yang mampu. Tetapkan di dalam hati solat khusus yang hendak anda kerjakan; niat ialah azam di dalam hati, bukan ayat yang dilafazkan dengan kuat.",
        tip: "Tumpukan pandangan ke tempat sujud dan kekalkan di situ. Sesiapa yang benar-benar tidak mampu berdiri, solatlah sambil duduk, kemudian berbaring — solat itu sendiri tidak sekali-kali gugur.",
      },
      {
        title: "2. Takbiratul ihram",
        body: "Angkat kedua-dua tangan hingga paras bahu atau cuping telinga dan ucapkan takbir, kemudian letakkan tangan kanan di atas tangan kiri di dada. Dengan ini solat bermula, dan percakapan serta pergerakan biasa kini dilarang sehingga salam.",
        tip: "Mengangkat tangan (raf' al-yadayn) ketika takbir ialah sunat yang sabit, bukan rukun.",
      },
      {
        title: "3. Doa iftitah (doa pembukaan)",
        body: "Bacalah dengan perlahan doa pembukaan yang ringkas untuk menenangkan hati sebelum membaca kalam Allah. Beberapa lafaz yang sahih telah diriwayatkan; inilah salah satu yang paling lazim.",
      },
      {
        title: "4. Taawuz & basmalah",
        body: "Mohon perlindungan kepada Allah daripada syaitan, kemudian mulakan dengan basmalah, sebelum Al-Fatihah. Kedua-duanya dibaca dengan perlahan, walaupun dalam solat jahar.",
      },
      {
        title: "5. Membaca Al-Fatihah",
        body: "Bacalah Fatihatul Kitab dalam setiap rakaat — 'There is no prayer for the one who does not recite the Opening of the Book.' (makna dalam bahasa Inggeris). Imam dan orang yang solat bersendirian membacanya dengan kuat dalam solat jahar; selain itu ia dibaca dengan perlahan.",
        tip: "Ucapkan 'Amin' selepasnya (dengan kuat dalam solat jahar). Mazhab Hanafi menganggap membaca sebahagian Al-Quran sebagai rukun dan Al-Fatihah secara khusus sebagai wajib; majoriti berpendapat Al-Fatihah itu sendiri ialah rukun dalam setiap rakaat.",
      },
      {
        title: "6. Membaca surah atau beberapa ayat",
        body: "Dalam dua rakaat pertama sahaja, ikuti Al-Fatihah dengan surah pendek atau beberapa ayat — contohnya Surah Al-Ikhlas ('Qul huwa Allahu ahad…'). Dalam rakaat ketiga dan keempat, bacalah Al-Fatihah sahaja.",
        tip: "Dianjurkan bagi orang yang solat bersendirian dan imam; makmum mendengar. Mazhab Hanafi berpendapat menambah surah dalam dua rakaat pertama adalah wajib.",
      },
      {
        title: "7. Rukuk",
        body: "Ucapkan 'Allahu Akbar' dan rukuk dengan belakang yang rata dan lurus, tangan menggenggam lutut, dan bertasbihlah memuji Tuhanmu tiga kali atau lebih, tanpa tergesa-gesa.",
        tip: "Rukuk itu sendiri, dengan tamakninah, ialah rukun; tasbih yang dibaca di dalamnya ialah sunat (wajib menurut sebahagian mazhab).",
      },
      {
        title: "8. Bangkit dari rukuk (iktidal)",
        body: "Bangkitlah hingga berdiri tegak sepenuhnya — imam dan orang yang solat bersendirian membaca tasmi', dan semua membaca tahmid — dan berdirilah dengan tenang sepenuhnya sebelum turun.",
        tip: "Berdiri semula dengan lurus dan tenang ialah rukun — jangan terus turun sujud sehingga anda benar-benar menetap di sini.",
      },
      {
        title: "9. Sujud",
        body: "Ucapkan 'Allahu Akbar' dan sujudlah di atas tujuh anggota — dahi bersama hidung, kedua-dua tapak tangan, kedua-dua lutut, dan hujung jari kedua-dua kaki — sambil bertasbih memuji Yang Maha Tinggi tiga kali atau lebih. Inilah kedudukan yang paling hampir kepada Allah, maka curahkanlah doa selepas tasbih.",
        tip: "Angkat lengan dari lantai dan jauhkan dari sisi badan, serta jarakkan perut dari peha.",
      },
      {
        title: "10. Duduk antara dua sujud",
        body: "Bangkit dari sujud pertama sambil mengucapkan 'Allahu Akbar', duduk dengan tenang dan tegak, dan mohonlah keampunan Tuhanmu sebelum sujud semula.",
        tip: "Duduklah sehingga anda tenang — duduk yang singkat ini, dengan tamakninah, ialah rukun tersendiri.",
      },
      {
        title: "11. Sujud kedua",
        body: "Ucapkan 'Allahu Akbar' dan sujud kali kedua sama seperti yang pertama, dengan tasbih yang sama dan tamakninah yang sama. Ini melengkapkan satu rakaat penuh.",
      },
      {
        title: "12. Bangun untuk rakaat seterusnya",
        body: "Ucapkan 'Allahu Akbar' dan bangun berdiri, kemudian ulangi dari Al-Fatihah. Dalam rakaat ketiga dan keempat, bacalah Al-Fatihah sahaja tanpa surah tambahan.",
        tip: "Dalam solat dua rakaat, anda tidak bangun lagi selepas rakaat kedua — anda kekal duduk untuk tasyahud akhir.",
      },
      {
        title: "13. Tasyahud awal (dalam solat 3 dan 4 rakaat)",
        body: "Selepas rakaat kedua Maghrib, Zohor, Asar atau Isyak, duduklah dan bacalah At-Tahiyyat, kemudian bangun untuk baki rakaat. Solat dua rakaat tidak mempunyai tasyahud awal.",
        tip: "Angkat jari telunjuk kanan ketika duduk. Jika anda terlupa tasyahud awal dan telah mula berdiri, teruskan dan lakukan sujud sahwi sebelum salam — jangan duduk semula.",
      },
      {
        title: "14. Tasyahud akhir",
        body: "Pada duduk terakhir setiap solat, bacalah At-Tahiyyat yang sama seperti di atas. Duduk untuk tasyahud akhir, dan membacanya, ialah rukun solat.",
      },
      {
        title: "15. Berselawat ke atas Nabi ﷺ",
        body: "Selepas At-Tahiyyat terakhir, berselawatlah ke atas Nabi ﷺ dengan lafaz yang baginda sendiri ajarkan kepada para sahabat.",
        tip: "Mazhab Syafie dan Hanbali menganggap selawat pada duduk terakhir sebagai wajib.",
      },
      {
        title: "16. Berdoa sebelum salam",
        body: "Sebelum mengakhiri solat, mohonlah perlindungan kepada Allah daripada empat fitnah — kemudian berdoalah apa sahaja yang anda kehendaki, untuk dunia dan akhirat, dalam bahasa Arab atau bahasa anda sendiri.",
      },
      {
        title: "17. Salam penutup",
        body: "Akhiri solat dengan berpaling muka ke kanan, kemudian ke kiri, sambil memberi salam setiap kali. Dengan salam, solat selesai.",
        tip: "Salam pertama (ke kanan) ialah rukun; salam kedua (ke kiri) ialah sunat menurut sebahagian mazhab.",
      },
    ],
    appLinks: [
      {
        label: "Bacaan & makna",
      },
      {
        label: "Bacaan kuat & perlahan",
      },
      {
        label: "Setiap kedudukan",
      },
      {
        label: "Jika anda tersilap (sujud sahwi)",
      },
      {
        label: "Penjejak latihan",
      },
    ],
  },
  {
    title: "Bacaan kuat & perlahan",
    summary:
      "Rakaat mana yang imam baca dengan kuat, mana yang perlahan, dan apa yang patut anda lakukan di belakangnya atau ketika solat bersendirian.",
    body: [
      "Salah satu soalan yang paling lazim — bagi saudara baru dan juga mereka yang telah lama beriman — menjadi mudah sebaik sahaja anda memahami dua prinsip: sebahagian solat dibaca dengan kuat (jahar) dan sebahagian lagi dengan perlahan (sir). Nabi ﷺ solat dengan kedua-dua cara; para sahabat meriwayatkan coraknya, dan ia direkodkan dalam kitab-kitab hadis utama.",
      "Dalam setiap solat, dua rakaat pertama ialah rakaat 'panjang': Al-Fatihah ditambah surah lain (atau beberapa ayat). Dalam baki rakaat solat tiga atau empat rakaat, Nabi ﷺ lazimnya hanya membaca Al-Fatihah. Itulah sebabnya bacaan kuat berhenti selepas rakaat kedua dalam Maghrib dan Isyak, manakala Zohor dan Asar kekal perlahan sepanjang solat.",
      "Allah tidak menyatakan sebab yang jelas mengapa sesuatu solat dibaca kuat atau perlahan. Ulama menyebut beberapa hikmah — solat malam sesuai dengan bacaan yang didengari; solat siang berlaku di tengah-tengah kesibukan kerja dan kehidupan awam; corak itu membezakan antara solat-solat — tetapi umat Islam mengikutinya terutamanya kerana ia Sunnah. Allah berfirman: 'adalah bagi kamu pada diri Rasulullah itu contoh ikutan yang baik' (33:21).",
      "Di belakang imam, peraturan yang disepakati dalam solat jahar ialah mendengar dengan teliti dan tidak membaca surah lain dengan kuat. Sama ada anda turut membaca Al-Fatihah secara perlahan ketika imam membaca ialah salah satu perbezaan yang paling terkenal antara empat mazhab Ahli Sunnah — semuanya pendapat yang sah yang dipegang oleh ulama yang muktabar. Dalam solat sir, imam membaca secara perlahan, maka setiap makmum membaca untuk dirinya sendiri mengikut ajaran mazhabnya.",
      "Solat bersendirian: bacalah Al-Fatihah dalam setiap rakaat; tambahlah surah dalam dua rakaat pertama setiap solat; dalam rakaat terakhir bacalah Al-Fatihah sahaja. Dalam solat jahar, sunat membaca dengan suara yang didengari ketika bersendirian, walaupun membaca perlahan tetap sah.",
    ],
    steps: [
      {
        title: "Subuh — kuat dalam kedua-dua rakaat",
        body: "Imam membaca dengan kuat dalam kedua-dua rakaat. Di belakangnya: dengar dengan teliti; jangan membaca surah lain dengan kuat. Al-Fatihah — lihat langkah mazhab di bawah.",
      },
      {
        title: "Zohor — perlahan dalam keempat-empat rakaat",
        body: "Imam membaca dengan perlahan dalam setiap rakaat. Di belakangnya: bacalah Al-Fatihah dan surah secara perlahan untuk diri sendiri mengikut mazhab anda.",
      },
      {
        title: "Asar — perlahan dalam keempat-empat rakaat",
        body: "Sama seperti Zohor — bacaan imam sepenuhnya perlahan; setiap makmum membaca dengan perlahan di belakangnya.",
      },
      {
        title: "Maghrib — kuat kemudian perlahan",
        body: "Kuat dalam rakaat pertama dan kedua; perlahan dalam rakaat ketiga. Di belakangnya: dengar dalam dua rakaat pertama; dalam rakaat ketiga bacalah untuk diri sendiri mengikut mazhab anda.",
      },
      {
        title: "Isyak — kuat kemudian perlahan",
        body: "Kuat dalam rakaat pertama dan kedua; perlahan dalam rakaat ketiga dan keempat. Di belakangnya: dengar dalam dua rakaat pertama; dalam dua rakaat terakhir bacalah untuk diri sendiri mengikut mazhab anda.",
      },
      {
        title: "Mengapa hanya dua rakaat pertama?",
        body: "Abu Qatadah r.a. meriwayatkan bahawa Nabi ﷺ membaca Al-Fatihah dan surah lain dalam dua rakaat pertama Zohor dan Asar, dan dalam dua rakaat terakhir hanya membaca Al-Fatihah. Corak ini menjelaskan struktur rakaat panjang/pendek dalam setiap solat yang lebih daripada dua rakaat.",
      },
      {
        title: "Di belakang imam dalam solat jahar — semua bersepakat",
        body: "Dengarlah dengan teliti apabila Al-Quran dibaca dengan kuat. Jangan bersaing dengan imam atau membaca surah lain dengan kuat. Allah berfirman: 'apabila Al-Quran itu dibacakan, maka dengarlah akan dia serta diamlah … supaya kamu beroleh rahmat' (7:204).",
      },
      {
        title: "Al-Fatihah di belakang imam — empat mazhab",
        body: "Hanafi: jangan membaca Al-Fatihah dalam solat jahar; dengarlah. Maliki: umumnya mendengar ketika bacaan kuat. Syafie: bacalah Al-Fatihah dalam setiap rakaat, walaupun di belakang imam. Hanbali: dua pendapat; ramai ulama Hanbali menganjurkan membaca Al-Fatihah ketika imam berhenti seketika atau apabila berpeluang. Keempat-empatnya pendapat Ahli Sunnah yang diiktiraf.",
        tip: "Ikutilah ajaran mazhab yang anda pelajari daripada guru yang dipercayai. Tiada mazhab yang membenarkan membaca surah lain dengan kuat mengatasi suara imam.",
      },
      {
        title: "Di belakang imam dalam solat sir",
        body: "Hanafi (pendapat muktamad): bacalah doa iftitah (thana) dan zikir secara perlahan tetapi bukan Al-Fatihah — bacaan imam sudah memadai. Maliki: berzikir secara perlahan; amalan berbeza-beza. Syafie & Hanbali: bacalah sendiri Al-Fatihah secara perlahan dalam setiap rakaat.",
      },
      {
        title: "Solat bersendirian",
        body: "Tiada perbezaan pada apa yang anda baca — hanya sama ada anda menguatkan suara. Setiap rakaat: Al-Fatihah. Dua rakaat pertama: tambah surah. Rakaat terakhir: Al-Fatihah sahaja. Dalam Subuh, Maghrib dan Isyak sunat membaca dengan kuat; Zohor dan Asar dibaca dengan perlahan.",
      },
    ],
    actions: [
      "Dalam solat berjemaah anda yang berikutnya, perhatikan rakaat mana yang imam baca dengan kuat.",
      "Tanyalah guru daripada mazhab anda sama ada anda membaca Al-Fatihah di belakang imam dalam solat jahar.",
      "Ketika solat bersendirian, cubalah membaca dengan kuat dalam solat Subuh untuk merasai sunnah bacaan jahar.",
    ],
    appLinks: [
      {
        label: "Solat langkah demi langkah",
      },
      {
        label: "Solat berjemaah",
      },
      {
        label: "Bacaan & makna",
      },
    ],
    disclaimer:
      "Empat mazhab Ahli Sunnah berbeza pendapat tentang membaca Al-Fatihah di belakang imam dalam solat jahar dan sir. Pelajaran ini membentangkan pendapat muktamad setiap mazhab tanpa mengisytiharkan salah satunya sebagai satu-satunya pandangan yang betul. Pelajarilah perincian mazhab anda daripada guru yang bertauliah.",
  },
  {
    title: "Setiap kedudukan",
    summary: "Cara meletakkan tubuh dengan betul dalam setiap kedudukan solat.",
    body: [
      "Setiap kedudukan dalam solat mempunyai bentuk tubuh yang ditunjukkan oleh Nabi ﷺ dan dipelihara oleh para sahabat baginda. Mempelajari bentuk yang betul melindungi solat anda daripada kesilapan fizikal yang lazim dan membantu tubuh menyokong kerendahan hati, bukan mengganggunya.",
      "Kedekatan ketika sujud wajar diberi perhatian khusus: Nabi ﷺ bersabda, 'The nearest a servant comes to his Lord is when he is prostrating, so make much supplication then.' (makna dalam bahasa Inggeris). Sujud yang dilakukan dengan tenang dan ikhlas ialah antara saat paling berkuasa dalam hari seorang mukmin.",
    ],
    steps: [
      {
        title: "Berdiri (qiyam)",
        body: "Tegak, kaki direnggangkan kira-kira selebar bahu, berat badan seimbang, pandangan ke tempat sujud, tangan kanan di atas tangan kiri di dada.",
      },
      {
        title: "Mengangkat tangan (raf' al-yadayn)",
        body: "Tapak tangan menghadap kiblat, separas bahu atau cuping telinga — ketika takbiratul ihram, dan (menurut majoriti) juga ketika hendak rukuk dan bangkit daripadanya.",
      },
      {
        title: "Rukuk",
        body: "Belakang rata dan lurus, kepala tidak didongakkan dan tidak ditundukkan, jari-jari direnggangkan menggenggam lutut, lengan dijauhkan dari sisi badan.",
      },
      {
        title: "Sujud",
        body: "Dahi dan hidung di atas lantai, tapak tangan rata berhampiran bahu atau telinga, siku diangkat dari lantai, lutut di lantai, jari-jari kaki ditekuk menghadap kiblat.",
      },
      {
        title: "Duduk iftirasy",
        body: "Antara dua sujud dan dalam tasyahud awal: duduk di atas kaki kiri yang dihamparkan dengan kaki kanan ditegakkan, tangan diletakkan di atas peha.",
      },
      {
        title: "Duduk akhir (tawarruk)",
        body: "Dalam tasyahud akhir solat 3 atau 4 rakaat (sunat menurut mazhab Syafie dan Hanbali): keluarkan kaki kiri ke bawah kaki kanan dan duduk di atas lantai.",
      },
      {
        title: "Berpaling untuk salam",
        body: "Palingkan muka sepenuhnya ke kanan, kemudian ke kiri, dengan ucapan salam — mengakhiri solat sambil memberi salam kepada malaikat di setiap bahu.",
      },
    ],
    disclaimer:
      "Perbezaan kecil dalam kedudukan tangan, cara duduk dan mengangkat tangan semuanya berasaskan riwayat yang sahih; setiap mazhab mengikut riwayat yang sah. Tiada satu pun yang membatalkan solat orang lain.",
  },
  {
    title: "Kesilapan lazim",
    summary: "Kesilapan yang diam-diam melemahkan solat — dan cara membetulkan setiap satunya.",
    body: [
      "Kebanyakan kesilapan dalam solat bukan dosa hati tetapi tabiat tergesa-gesa dan lalai. Mengenal pasti kesilapan ialah langkah pertama untuk membetulkannya; Nabi ﷺ sendiri membetulkan solat seorang sahabat dengan sabar dan secara langsung, yang mengajar kita bahawa kesilapan ini lazim dan boleh diperbaiki.",
      "Yang paling berat ialah tergesa-gesa — mematuk ketika rukuk dan sujud tanpa tamakninah. Tamakninah (ketenangan yang menetap) ialah rukun solat menurut majoriti ulama, maka solat yang tergesa-gesa bukan sekadar tidak sempurna malah boleh menjadi tidak sah. Perbaikilah senarai di bawah satu tabiat pada satu masa.",
    ],
    steps: [
      {
        title: "Solat terlalu laju",
        body: "Hampir tidak berhenti ketika rukuk atau sujud. Kekallah sehingga tubuh anda tenang dan anda dapat membaca zikir sekurang-kurangnya tiga kali tanpa tergesa-gesa.",
      },
      {
        title: "Wuduk tidak sempurna",
        body: "Bahagian yang kering pada tumit, buku lali, siku, atau celah-celah jari. Nabi ﷺ memberi amaran, 'Woe to the heels from the Fire.' (makna dalam bahasa Inggeris). Basuhlah perlahan-lahan dan dengan sempurna.",
      },
      {
        title: "Belakang bengkok ketika rukuk, terhenyak ketika sujud",
        body: "Rukuk dengan belakang yang membongkok, atau meletakkan dahi tanpa hidung, atau membiarkan lengan terhampar rata di lantai. Pastikan belakang lurus dan siku diangkat.",
      },
      {
        title: "Mata dan hati yang melayang",
        body: "Menoleh ke sana sini, atau memeriksa telefon. Pandanglah ke tempat sujud dan senyapkan atau jauhkan telefon anda sebelum takbir.",
      },
      {
        title: "Mendahului imam",
        body: "Dalam solat berjemaah, bergerak ke rukuk atau sujud sebelum imam. Ikutilah imam — jangan sekali-kali mendahuluinya — dan bergeraklah hanya selepas dia bergerak.",
      },
      {
        title: "Bercakap, makan atau ketawa",
        body: "Sebarang percakapan, makan, minum atau ketawa berbunyi yang disengajakan membatalkan solat. Solat ialah perbualan dengan Allah semata-mata.",
      },
      {
        title: "Membaca Al-Fatihah dengan salah",
        body: "Tertinggal perkataan, atau melakukan kesalahan yang mengubah makna. Pelajarilah dengan sempurna setiap hurufnya — seluruh solat bergantung padanya.",
      },
    ],
    actions: [
      "Tunaikan satu solat hari ini pada separuh kelajuan biasa anda dan perhatikan betapa berbezanya rasanya.",
      "Senyapkan telefon anda atau tinggalkannya di bilik lain sebelum anda mengucapkan takbiratul ihram.",
      "Mintalah seseorang yang berilmu memerhatikan salah satu solat anda dan membetulkan kedudukan anda.",
    ],
    appLinks: [
      {
        label: "Belajar membaca Al-Fatihah",
      },
    ],
  },
  {
    title: "Amalan sunat",
    summary:
      "Amalan yang dianjurkan oleh Nabi ﷺ yang mencantikkan solat dan menggandakan pahalanya.",
    body: [
      "Selain perbuatan yang wajib, Nabi ﷺ menunjukkan contoh banyak amalan sunat (sunan) di sekitar solat. Ia tidak diwajibkan, maka meninggalkan salah satunya tidak membatalkan solat — tetapi setiap satunya mendekatkan anda kepada Allah, menambah pahala, dan menampung kekurangan dalam solat fardu.",
      "Yang paling utama ialah solat sunat rawatib yang dikerjakan sebelum dan selepas solat fardu. Tidak semua solat sunat mempunyai kedudukan yang sama: ulama membezakan antara sunat muakkad (yang ditekankan, sentiasa dikerjakan oleh Nabi ﷺ), sunat ghairu muakkad (dianjurkan tetapi kurang ditekankan), dan nafil umum (pilihan, tanpa bilangan yang tetap). Mengetahui perbezaannya membantu anda mengutamakan apa yang perlu dijaga setiap hari.",
      "Jadual harian yang paling jelas dengan dalil yang paling kuat ialah dua belas rawatib: dua sebelum Subuh, empat sebelum Zohor, dua selepas Zohor, dua selepas Maghrib, dan dua selepas Isyak — dua belas rakaat yang ganjarannya sebuah rumah yang dibina di Syurga. Lihat pelajaran Jenis-jenis solat untuk pecahan lengkap bagi setiap solat berserta dalilnya.",
    ],
    actions: [
      "Bersugilah dengan miswak (siwak) sebelum wuduk dan solat — Nabi ﷺ hampir mewajibkannya.",
      "Berjalanlah ke masjid dengan tenang dan awal — setiap langkah mengangkat satu darjat dan menghapuskan satu dosa.",
      "Jagalah dua belas rakaat sunat rawatib untuk rumah yang dijanjikan di Syurga.",
      "Masuklah ke masjid dengan kaki kanan dan keluar dengan kaki kiri, masing-masing dengan doanya.",
      "Bacalah zikir yang sabit selepas setiap solat — lihat Selepas Solat.",
    ],
    appLinks: [
      {
        label: "Jenis-jenis solat — panduan rawatib",
      },
      {
        label: "Zikir sunat & selepas solat",
      },
      {
        label: "Doa masjid",
      },
    ],
  },
  {
    title: "Khusyuk — kehadiran hati",
    summary: "Matlamat seluruh perjalanan ini: solat seolah-olah anda melihat Allah.",
    body: [
      "Khusyuk ialah kerendahan hati, tumpuan dan kesedaran bahawa anda benar-benar sedang berdiri di hadapan Allah. Ia yang mengubah pergerakan fizikal solat menjadi ibadah yang sebenar. Nabi ﷺ mentakrifkan ihsan sebagai 'to worship Allah as though you see Him, for though you do not see Him, He surely sees you' (makna dalam bahasa Inggeris) — dan tiada tempat yang lebih langsung untuk mengamalkannya selain di dalam solat.",
      "Allah memulakan sifat orang-orang beriman yang berjaya dengannya: 'mereka yang khusyuk dalam sembahyangnya' (23:1–2). Dan Dia memberi amaran keras terhadap lawannya — 'kecelakaan besar bagi orang-orang Ahli Sembahyang … mereka yang berkeadaan lalai daripada menyempurnakan sembahyangnya' (107:4–5) — teguran yang ditujukan kepada mereka yang tubuhnya bergerak sedangkan hatinya tidak hadir.",
      "Khusyuk dibina, bukan sekadar diangan-angankan. Pelajarilah makna apa yang anda baca supaya kata-kata itu menyentuh hati anda. Singkirkan gangguan sebelum takbir. Perlahankan solat dan berikan setiap kedudukan tamakninahnya. Renungkan kebesaran Zat yang anda sedang berbicara dengan-Nya dan hakikat bahawa solat ini mungkin solat terakhir anda. Solatlah setiap solat seperti solat perpisahan, sebagaimana yang dinasihatkan oleh Nabi ﷺ.",
      "Janganlah berputus asa kerana fikiran yang melayang — para sahabat juga bergelut dengannya. Usaha untuk mengembalikan tumpuan anda, berulang kali, itu sendiri sebahagian daripada ibadah. Khusyuk tumbuh sepanjang hayat; istiqamah yang menyuburkannya.",
    ],
    actions: [
      "Bacalah makna satu bacaan daripada Bacaan Solat sebelum setiap solat minggu ini.",
      "Berhentilah selama tiga saat dengan tenang dalam setiap kedudukan sebelum berpindah.",
      "Catatkan tahap tumpuan anda dalam jurnal selepas solat dan perhatikan coraknya berubah.",
    ],
    appLinks: [
      {
        label: "Jurnal khusyuk",
      },
      {
        label: "Bacaan & makna",
      },
    ],
  },
  {
    title: "Rukun & perkara yang membatalkan",
    summary: "Apa yang tanpanya solat tidak wujud — dan apa yang membatalkannya.",
    body: [
      "Perbuatan solat terbahagi kepada tiga peringkat. Rukun (arkan) ialah bahagian asas: meninggalkan salah satunya dengan sengaja membatalkan solat, dan meninggalkannya kerana terlupa mesti diperbetulkan dengan kembali melakukannya. Perbuatan wajib (wajibat) dituntut, tetapi jika terlupa, ia diperbaiki dengan sujud sahwi. Perbuatan sunat menyempurnakan dan mencantikkan solat, dan meninggalkannya tidak membawa sebarang hukuman.",
      "Mengetahui susunan ini melindungi anda daripada dua keterlaluan: menganggap kekurangan kecil sebagai membinasakan, atau menganggap rukun yang sebenar sebagai pilihan. Apabila ragu-ragu tentang sesuatu rukun, solat tidak sempurna sehingga rukun itu dipenuhi.",
      "Secara berasingan, perkara-perkara tertentu membatalkan solat serta-merta sebaik sahaja ia berlaku — kerana ia bercanggah dengan keadaan solat itu sendiri. Yang lain membatalkan wuduk, yang seterusnya menamatkan solat. Berjaga-jagalah terhadap kedua-duanya supaya anda tidak sekali-kali solat dalam keadaan tidak sah tanpa menyedarinya.",
    ],
    steps: [
      {
        title: "Rukun (arkan)",
        body: "Berdiri bagi yang mampu, takbiratul ihram, membaca Al-Fatihah, rukuk, bangkit daripadanya, dua sujud, duduk antara keduanya, duduk akhir, tasyahud, salam, tamakninah dalam setiap satunya, dan menjaga tertib yang betul.",
      },
      {
        title: "Perbuatan wajib (wajibat)",
        body: "Seperti takbir-takbir yang lain, lafaz zikir dalam rukuk dan sujud, dan tasyahud awal — diperbaiki dengan sujud sahwi jika terlupa (menurut perincian mazhab Hanbali; mazhab-mazhab berbeza).",
      },
      {
        title: "Perkara yang membatalkan wuduk",
        body: "Apa sahaja yang keluar dari qubul atau dubur, tidur nyenyak, hilang akal — dan, menurut sebahagian ulama, menyentuh kemaluan secara langsung. Mana-mana daripadanya menamatkan solat.",
      },
      {
        title: "Perkara yang membatalkan solat itu sendiri",
        body: "Bercakap dengan sengaja, makan atau minum dengan sengaja, banyak pergerakan berturut-turut yang tidak perlu, ketawa berbunyi, sengaja memalingkan dada dari kiblat, dan terdedah aurat.",
      },
    ],
    appLinks: [
      {
        label: "Sujud sahwi",
      },
    ],
    disclaimer:
      "Empat mazhab mengklasifikasikan sebahagian perbuatan secara berbeza — contohnya sama ada tasyahud awal itu wajib atau sunat, atau senarai tepat perkara yang menuntut sujud sahwi. Pelajarilah perincian mazhab anda daripada guru yang bertauliah.",
  },
  {
    title: "Sujud sahwi — memperbaiki kesilapan",
    summary: "Sujud kerana lupa yang menampal kesilapan kecil dalam solat.",
    body: [
      "Tiada sesiapa yang terlepas daripada lupa dalam solat — Nabi ﷺ sendiri pernah terlupa, lalu bersabda, 'I am only a human being like you; I forget as you forget, so when I forget, remind me.' (makna dalam bahasa Inggeris). Daripada contoh baginda sendiri datang satu penawar yang sedia ada: dua sujud tambahan, dinamakan sujud sahwi (sujud kerana lupa), yang menampal kesilapan kecil supaya solat tidak perlu diulang.",
      "Ia dituntut dalam tiga keadaan umum: penambahan (tertambah satu rakaat atau satu kedudukan kerana tersilap), pengurangan (tertinggal perkara wajib seperti tasyahud awal), atau keraguan (tidak pasti berapa rakaat yang telah dikerjakan). Ia tidak diperlukan kerana meninggalkan perkara sunat, dan tidak juga bagi kesilapan yang disengajakan — kedua-duanya mempunyai hukum tersendiri.",
      "Apabila anda benar-benar ragu, prinsip panduannya ialah: buang keraguan itu, binalah atas apa yang anda yakini (bilangan yang lebih sedikit), sempurnakan solat, kemudian lakukan dua sujud. Ini mengubah kekeliruan menjadi solat yang tenang dan sah, bukan tekaan yang penuh kebimbangan.",
      "Secara praktikal: lakukan dua sujud sama seperti sujud biasa anda, dengan takbir sebelum dan selepasnya, kemudian salam. Ulama berbeza pendapat sama ada ia dilakukan sebelum atau selepas salam bergantung pada jenis kesilapan — kedua-duanya diriwayatkan secara sahih, maka mana-mana satu boleh diterima dan tiada yang membatalkan solat.",
    ],
    actions: [
      "Hafalkan kaedah ketika ragu: binalah atas bilangan yang lebih sedikit, sempurnakan, kemudian sujud dua kali.",
      "Jika anda sedar di tengah solat bahawa anda tertinggal tasyahud awal, teruskan dan lakukan sujud sahwi di akhir solat.",
    ],
    appLinks: [
      {
        label: "Rukun & perkara yang membatalkan",
      },
    ],
    disclaimer:
      "Sama ada dua sujud itu dilakukan sebelum atau selepas salam bergantung pada jenis kesilapan, dan mazhab-mazhab berbeza pendapat. Kedua-duanya daripada Sunnah; jangan biarkan ketidakpastian ini menghalang anda daripada solat.",
  },
  {
    title: "Jenis-jenis solat",
    summary:
      "Fardu, sunat muakkad, sunat ghairu muakkad, Witir, dan nafil umum — berserta dalil sahih bagi setiap satu.",
    body: [
      "Solat diperingkatkan mengikut tahap kewajipannya. Solat lima waktu ialah fardu — kewajipan yang tegas ke atas setiap Muslim yang mukalaf. Di sekelilingnya terdapat dunia solat sunat yang kaya, yang melaluinya Nabi ﷺ semakin mendekatkan diri kepada Allah, dan kita juga boleh berbuat demikian.",
      "Untuk pembelajaran yang tepat, bezakan empat kategori solat sunat yang berasaskan nas-nas yang sahih: sunat muakkad (rawatib yang ditekankan dan jarang ditinggalkan oleh Nabi ﷺ), sunat ghairu muakkad (dianjurkan tetapi kurang ditekankan), Witir (diletakkan dalam kategori tersendiri kerana mazhab Hanafi menganggapnya wajib manakala majoriti menganggapnya sunat muakkad), dan nafil umum (solat pilihan tanpa bilangan yang tetap dan disepakati). Apabila ulama berbeza pendapat tentang sesuatu bilangan yang tetap — seperti enam rakaat selepas Maghrib sebagai solat Awwabin — kami membentangkan galakan umumnya tanpa menganggap bilangan yang dipertikaikan itu sebagai sunnah yang sabit.",
      "Solat sunat penting kerana dua sebab: ia amalan yang dicintai yang mengangkat darjat seorang mukmin, dan ia menampung solat fardu, kerana sebarang kekurangan dalam solat fardu akan disempurnakan daripada solat sunat seseorang pada Hari Pembalasan.",
      "Dua belas rawatib di bawah ialah jadual sunat harian yang paling jelas dengan kesepakatan yang paling kukuh. Jadual rakaat di hab Belajar Solat menjejak dua belas rakaat yang ditekankan ini; nafil pilihan sebelum Asar, sebelum Maghrib, atau selepas Isyak digalakkan apabila ada dalilnya tetapi tidak dimasukkan ke dalam bilangan tetap itu.",
    ],
    steps: [
      {
        title: "Lima solat fardu harian",
        body: "Subuh, Zohor, Asar, Maghrib, Isyak — asas yang wajib, tidak boleh ditinggalkan sama sekali.",
      },
      {
        title: "Subuh — 2 sebelum (sunat muakkad)",
        body: "Dua rakaat sebelum solat fardu Subuh ialah sunat muakkad — Nabi ﷺ tidak pernah meninggalkannya. Tiada sunat rawatib yang sahih selepas Subuh; solat sunat secara umumnya dilarang selepas Subuh hingga terbit matahari.",
      },
      {
        title: "Zohor — 4 sebelum & 2 selepas (sunat muakkad)",
        body: "Empat rakaat sebelum Zohor dan dua selepasnya termasuk dalam dua belas rawatib (sunat muakkad). Secara berasingan, Ummu Habibah meriwayatkan bahawa sesiapa yang solat empat rakaat sebelum Zohor dan empat selepasnya, Allah mengharamkannya daripada Neraka — maka dua rakaat tambahan selepas dua rawatib yang biasa ialah nafil yang dianjurkan, dan sebahagian ulama juga menganjurkan dua rakaat tambahan sebelumnya sehingga berjumlah enam.",
      },
      {
        title: "Asar — 4 sebelum (sunat ghairu muakkad)",
        body: "Empat rakaat sebelum Asar dianjurkan secara meluas (sunat ghairu muakkad). Tiada sunat rawatib yang sahih selepas Asar; solat sunat secara umumnya dilarang selepas Asar hingga terbenam matahari.",
      },
      {
        title: "Maghrib — 2 sebelum & 2 selepas",
        body: "Dua rakaat selepas Maghrib ialah sunat muakkad (termasuk dalam dua belas rawatib). Sebelum Maghrib, Nabi ﷺ bersabda 'Pray before Maghrib' (makna dalam bahasa Inggeris) dua kali, kemudian menambah 'for whoever wishes' (makna dalam bahasa Inggeris) — maka dua rakaat sebelumnya ialah nafil pilihan, bukan rawatib yang tetap. Solat sunat umum selepas Maghrib digalakkan, tetapi penetapan masyhur enam rakaat sebagai solat Awwabin dipertikaikan kesahihannya; jangan bentangkan enam rakaat yang tetap sebagai sunnah yang sabit.",
      },
      {
        title: "Isyak — 2 selepas & pilihan sebelum",
        body: "Dua rakaat selepas Isyak ialah sunat muakkad (termasuk dalam dua belas rawatib). Sebelum Isyak, hadis 'Between every two calls there is a prayer' (makna dalam bahasa Inggeris) membenarkan dua atau empat rakaat antara azan dan iqamah — nafil umum, bukan sunat rawatib. Solat sunat tambahan selepas Isyak adalah harus, tetapi tiada sunnah tetap yang sahih yang menentukan dua rakaat tambahan selain rawatib yang biasa.",
      },
      {
        title: "Witir — kategori tersendiri",
        body: "Witir dikerjakan selepas Isyak dengan bilangan ganjil (1, 3, 5, 7, 9, 11…). Banyak hadis sahih memerintahkan dan menggalakkannya. Mazhab Hanafi menganggapnya wajib; majoriti menganggapnya sunat muakkad. Ia diasingkan daripada dua belas rawatib kerana perbezaan pendapat tentang hukumnya ini.",
      },
      {
        title: "Dua belas rawatib — jadual yang disepakati",
        body: "Sebelum Subuh: 2. Sebelum Zohor: 4. Selepas Zohor: 2. Selepas Maghrib: 2. Selepas Isyak: 2. Jumlah: 12 rakaat. Sesiapa yang tetap mengerjakannya, Allah membina untuknya sebuah rumah di Syurga.",
      },
      {
        title: "Nafil yang dianjurkan — bukan rawatib tetap",
        body: "Sebelum Asar: 4 (hasan). Sebelum Maghrib: 2 pilihan (sahih). Sebelum Isyak: 2 atau 4 antara azan dan iqamah (sahih). Tambahan sebelum Zohor: 2 dianjurkan. Tambahan selepas Zohor: 2 (hasan/sahih). Selepas Maghrib & Isyak: nafil umum digalakkan — tanpa bilangan tetap yang dipertikaikan.",
      },
      {
        title: "Tahajud (qiyamullail)",
        body: "Solat malam pada sepertiga malam yang terakhir — solat sunat yang paling utama, dan amalan orang-orang soleh.",
      },
      {
        title: "Dhuha",
        body: "Solat waktu pagi (2–8 rakaat) — sedekah yang ditanggung bagi setiap sendi tubuh pada setiap hari.",
      },
      {
        title: "Tarawih",
        body: "Solat malam berjemaah pada bulan Ramadan — menghidupkan malam-malam bulan yang penuh berkat.",
      },
      {
        title: "Dua Hari Raya",
        body: "Dua rakaat solat Aidilfitri dan Aidiladha, diikuti oleh khutbah.",
      },
      {
        title: "Istikharah",
        body: "Solat dua rakaat untuk memohon petunjuk Allah sebelum membuat keputusan.",
      },
      {
        title: "Jenazah",
        body: "Solat jenazah — fardu kifayah yang dikerjakan sambil berdiri, tanpa rukuk dan sujud.",
      },
    ],
    actions: [
      "Mulakan dengan dua belas rawatib — bina tabiatnya sebelum menambah nafil pilihan.",
      "Gunakan jadual rakaat di hab ini untuk menjejak sunat yang ditekankan di sekitar setiap solat fardu.",
      "Bacalah kad dalil di bawah dan tandakan hadis yang ingin anda baca semula.",
    ],
    appLinks: [
      {
        label: "Amalan sunat",
      },
      {
        label: "Panduan Tahajud",
      },
      {
        label: "Jadual rakaat",
      },
    ],
    disclaimer:
      "Hukum Witir (wajib atau sunat muakkad), bilangan tepat rakaat pilihan sebelum Isyak, dan solat Awwabin selepas Maghrib ialah perkara khilaf ulama. Pelajaran ini hanya membentangkan apa yang mempunyai asas nas yang sahih dan menyatakan perbezaan pendapat apabila ada.",
  },
  {
    title: "Jumaat — solat hari Jumaat",
    summary:
      "Kewajipan mingguan yang menghimpunkan masyarakat dan menggantikan Zohor pada hari Jumaat.",
    body: [
      "Solat Jumaat ialah solat berjemaah yang diadakan selepas tengah hari setiap Jumaat, dan ia kewajipan tersendiri yang diperintahkan dengan namanya dalam Al-Quran: 'Apabila diserukan azan (bang) untuk mengerjakan sembahyang pada hari Jumaat, maka segeralah kamu pergi (ke masjid) untuk mengingati Allah … dan tinggalkanlah berjual-beli' (62:9). Ia terdiri daripada khutbah dua bahagian diikuti dua rakaat yang dibaca dengan kuat di belakang imam, dan ia menggantikan Zohor bagi mereka yang menghadirinya.",
      "Ia fardu ain ke atas setiap lelaki Muslim yang merdeka, baligh, bermastautin dan berkemampuan. Nabi ﷺ menjelaskan bahawa ia 'a duty upon every Muslim in congregation, except four: a slave, a woman, a child, or one who is ill.' (makna dalam bahasa Inggeris). Wanita, musafir dan orang sakit dikecualikan dan menunaikan Zohor sebagai gantinya, walaupun mereka boleh menghadirinya jika mahu.",
      "Mengabaikannya adalah bahaya yang besar: Nabi ﷺ memberi amaran bahawa sesiapa yang meninggalkan tiga kali solat Jumaat kerana lalai, Allah akan mengunci mati hatinya. Namun ganjarannya juga sama besar — Jumaat ialah hari terbaik yang padanya matahari terbit, dan padanya terdapat satu saat yang doa dimakbulkan.",
      "Bersiaplah untuknya sebagaimana Nabi ﷺ bersiap: mandi sunat Jumaat, memakai pakaian terbaik yang bersih, memakai wangian, pergi awal, dan mendengar khutbah dengan senyap dan penuh perhatian (bercakap kosong ketika khutbah menghilangkan pahala). Membaca Surah al-Kahfi pada hari Jumaat mendatangkan cahaya antara dua Jumaat.",
    ],
    actions: [
      "Mandilah, pakailah pakaian yang bersih dan wangian, dan datanglah awal — mereka yang paling awal hadir memperoleh ganjaran yang paling besar.",
      "Bacalah Surah al-Kahfi pada bila-bila masa pada hari Jumaat untuk mendapat cahaya antara dua Jumaat.",
      "Diamlah sepenuhnya dan berilah perhatian ketika khutbah; jauhkan telefon.",
    ],
    appLinks: [
      {
        label: "Baca Surah al-Kahfi",
      },
    ],
    disclaimer:
      "Bilangan minimum jemaah yang hadir, dan sama ada mandi Jumaat itu wajib atau sunat yang sangat dituntut, ialah perkara khilaf ulama. Ikutilah amalan masyarakat tempatan anda yang dipercayai.",
  },
  {
    title: "Solat berjemaah",
    summary: "Solat di belakang imam — pahala digandakan dua puluh tujuh kali.",
    body: [
      "Menunaikan solat lima waktu secara berjemaah sangat dituntut, terutamanya bagi lelaki, dan ia ciri masyarakat Islam yang hidup. Nabi ﷺ mengajarkan bahawa solat berjemaah dua puluh tujuh kali ganda lebih besar pahalanya berbanding solat bersendirian — gandaan yang tidak dapat ditandingi oleh usaha individu.",
      "Jemaah berdiri dalam saf yang lurus dan rapat tanpa celah, bahu ke bahu, mengikut imam dengan tepat: anda memulakan setiap pergerakan hanya selepas imam, tidak sekali-kali sebelumnya, dan tidak pada saat yang sama. Meluruskan saf itu sendiri sebahagian daripada kesempurnaan solat.",
      "Jika anda tiba selepas imam memulakan solat (orang yang lewat dinamakan masbuq), sertailah segera dalam apa jua kedudukan anda dapati imam — bahagian itu tetap dikira sebagai solat bersamanya. Apabila imam memberi salam akhir, bangunlah dan sempurnakan rakaat yang tertinggal secara sendirian, kemudian selesaikan solat.",
      "Jemaah bukan hanya di masjid: dua orang yang solat bersama sudah membentuk jemaah, maka seorang bapa bersama anaknya, atau dua sahabat yang bermusafir, boleh memperoleh pahalanya. Wanita boleh solat berjemaah dan menghadiri masjid apabila terdapat kemudahan yang sesuai, walaupun solat mereka di rumah juga diberi ganjaran yang besar.",
    ],
    actions: [
      "Tunaikan sekurang-kurangnya satu solat di masjid hari ini, atau himpunkan ahli keluarga anda dalam satu saf di rumah.",
      "Pelajari apa yang perlu dilakukan sebagai masbuq: sertai segera, kemudian sempurnakan rakaat yang tertinggal selepas imam memberi salam.",
    ],
    appLinks: [
      {
        label: "Bacaan kuat & perlahan",
      },
      {
        label: "Solat langkah demi langkah",
      },
    ],
  },
  {
    title: "Solat qada (yang tertinggal)",
    summary: "Menggantikan apa yang tertinggal — pintu rahmat Allah sentiasa terbuka.",
    body: [
      "Jika solat fardu tertinggal — kerana tertidur, terlupa, atau (semoga Allah melindungi kita) cuai — kewajipannya tidak hilang begitu sahaja. Ia mesti diqada, dan Nabi ﷺ menjelaskan hukumnya: 'Whoever forgets a prayer or sleeps through it, its expiation is to pray it when he remembers.' (makna dalam bahasa Inggeris). Tiada tebusan lain baginya selain mengerjakannya.",
      "Solat qada dikerjakan dalam bentuk yang sama seperti solat asal: Zohor empat rakaat yang tertinggal dikerjakan empat rakaat walaupun anda mengqadanya pada waktu malam atau ketika bermusafir. Orang yang tertinggal solat kerana uzur yang sebenar (seperti tidur nyenyak) tidak berdosa atas kelewatan itu; orang yang meninggalkannya dengan sengaja mesti mengqadanya bersama taubat yang ikhlas dan segera.",
      "Ulama menggalakkan agar solat yang tertinggal diqada dengan segera dan mengikut tertib apabila boleh, tanpa membiarkannya bertimbun — kerana bebannya menjadi semakin berat dengan masa dan penangguhan. Jika banyak solat tertinggal selama bertahun-tahun, hadapilah dengan rancangan harian yang realistik dan bukan dengan berputus asa; pintu taubat Allah sentiasa terbuka.",
    ],
    actions: [
      "Anggarkan dengan jujur berapa banyak solat yang perlu anda qada dan tetapkan sasaran qada harian yang realistik.",
      "Iringi setiap solat fardu dengan satu solat qada sehingga semua tunggakan selesai.",
      "Jangan sekali-kali melewatkan solat yang sedang tiba waktunya untuk mengqada solat lama — kekalkan solat hari ini tepat pada waktunya.",
    ],
    appLinks: [
      {
        label: "Penjejak qada",
      },
      {
        label: "Sejarah qada",
      },
    ],
  },
  {
    title: "Selepas solat",
    summary: "Zikir dan doa yang memeterai pahala setiap solat.",
    body: [
      "Nabi ﷺ tidak pernah bangun dengan tergesa-gesa selepas solat. Baginda akan kekal duduk, memohon keampunan Allah dan berzikir — dan baginda mengajarkan bahawa saat sejurus selepas solat fardu ialah antara waktu doa paling mudah dimakbulkan. Beredar serta-merta bermakna kehilangan sebahagian daripada buah solat yang paling besar.",
      "Amalan selepas solat yang sabit adalah mudah tetapi besar nilainya: ucapkan 'Astaghfirullah' tiga kali; kemudian kalimah tauhid dan pujian; kemudian 'SubhanAllah', 'Alhamdulillah' dan 'Allahu Akbar' tiga puluh tiga kali setiap satu, dan menyempurnakan yang keseratus dengan 'La ilaha illallah…' — sesiapa yang melakukannya, dosa-dosanya diampunkan walaupun sebanyak buih di lautan.",
      "Membaca Ayat Kursi selepas setiap solat fardu menjadikan tiada lagi penghalang antara seseorang dan Syurga melainkan kematian, sebagaimana yang dijanjikan oleh Nabi ﷺ. Ikutinya dengan tiga Qul (Al-Ikhlas, Al-Falaq, An-Nas), dan tambahkan zikir pagi selepas Subuh dan zikir petang selepas Asar atau Maghrib apabila berkenaan.",
    ],
    actions: [
      "Hafalkan tasbih selepas solat (33 / 33 / 33 + tahlil) minggu ini.",
      "Bacalah Ayat Kursi dan tiga Qul sebelum anda bangun.",
      "Kekal duduk selama seminit untuk berdoa sendiri selepas setiap solat fardu.",
    ],
    appLinks: [
      {
        label: "Zikir selepas solat",
      },
      {
        label: "Pembilang tasbih",
      },
    ],
  },
];

export const SALAH_GUIDE_PHRASES_MS: DeepPartial<SalahGuidePhrase>[] = [
  {
    title: "Selepas selesai berwuduk",
    when: "Sejurus selepas selesai berwuduk, sebelum solat.",
    meaning:
      "Memperbaharui syahadah ketika tubuh anda baru sahaja disucikan. Nabi ﷺ menjanjikan bahawa sesiapa yang membacanya selepas berwuduk, lapan pintu Syurga dibukakan untuknya dan dia boleh masuk melalui mana-mana pintu yang dikehendakinya.",
  },
  {
    title: "Takbiratul ihram",
    when: "Pada permulaan solat, dan ketika berpindah antara kedudukan.",
    meaning:
      "Solat bermula di sini — 'al-ihram' bermaksud ia mengharamkan ke atas anda perkara-perkara dunia (bercakap, makan, berpaling). Anda mengisytiharkan bahawa Allah lebih besar daripada apa sahaja yang boleh melalaikan anda, lalu melangkah sepenuhnya ke hadrat-Nya. Setiap takbir selepasnya memperbaharui penyerahan diri itu.",
  },
  {
    title: "Doa iftitah (doa pembukaan)",
    when: "Secara perlahan selepas takbiratul ihram, sebelum Al-Fatihah.",
    meaning:
      "Anda membuka perbualan dengan bertasbih dan memuji Allah serta mengakui keesaan-Nya, menenangkan hati sebelum membaca kalam-Nya. Terdapat beberapa doa iftitah yang sahih — inilah salah satu yang paling banyak diamalkan.",
  },
  {
    title: "Surah Al-Fatihah",
    when: "Ketika berdiri dalam setiap rakaat — rukun yang tanpanya rakaat itu tidak sah.",
    meaning:
      "'Ummul Kitab' (Ibu Kitab): separuh pujian kepada Allah dan separuh permohonan petunjuk, dengan 'Engkaulah sahaja (Ya Allah) Yang Kami sembah' (1:5) sebagai engsel antara keduanya. Allah berfirman bahawa Dia membahagikan surah ini antara Diri-Nya dan hamba-Nya — setiap kali anda membaca satu ayat, Dia menjawab. Nabi ﷺ bersabda bahawa tiada solat bagi orang yang tidak membacanya.",
  },
  {
    title: "Zikir ketika rukuk",
    when: "Ketika rukuk, dengan belakang yang rata dan tenang.",
    meaning:
      "Rukuk ialah kedudukan penghormatan, maka anda memuji keagungan Allah — dibaca tiga kali atau lebih, tanpa tergesa-gesa. Nabi ﷺ mengajarkan bahawa dalam rukuk kita mengagungkan Tuhan, maka berharaplah agar doa anda dimakbulkan.",
  },
  {
    title: "Bangkit dari rukuk",
    when: "Berdiri tegak sepenuhnya selepas rukuk.",
    meaning:
      "Anda mengakui bahawa Allah benar-benar mendengar orang yang memuji-Nya, kemudian mengembalikan segala pujian kepada-Nya. Nabi ﷺ bersabda bahawa apabila imam mengucapkannya dan jemaah menjawab, sesiapa yang ucapannya bertepatan dengan ucapan para malaikat, diampunkan dosa-dosanya yang lalu.",
  },
  {
    title: "Zikir ketika sujud",
    when: "Ketika sujud — kedudukan yang paling hampir kepada Allah.",
    meaning:
      "Pada titik fizikal yang paling rendah, anda memuji Yang Maha Tinggi — paradoks di jantung ibadah. Nabi ﷺ bersabda bahawa seorang hamba paling hampir kepada Tuhannya ketika sujud, maka curahkanlah doa di sini selepas zikir.",
  },
  {
    title: "Antara dua sujud",
    when: "Duduk dengan tenang antara sujud pertama dan kedua dalam setiap rakaat.",
    meaning:
      "Permohonan ampun yang ringkas tetapi langsung dalam setiap rakaat — peringatan bahawa walaupun di tengah solat, kita sentiasa memerlukan keampunan Allah. Duduklah sehingga anda tenang sebelum sujud kedua.",
  },
  {
    title: "At-Tahiyyat (Tasyahud)",
    when: "Pada duduk pertengahan dan duduk akhir solat.",
    meaning:
      "Jantung solat dalam keadaan duduk: anda mempersembahkan segala bentuk ibadah kepada Allah semata-mata, mengucapkan salam ke atas Nabi ﷺ dan orang-orang soleh, dan mengisytiharkan semula dua kalimah syahadah. Ibnu Mas'ud mempelajarinya daripada Nabi ﷺ kalimah demi kalimah, sebagaimana seseorang mempelajari sebuah surah.",
  },
  {
    title: "Selawat Ibrahimiyyah",
    when: "Dalam tasyahud akhir, selepas At-Tahiyyat.",
    meaning:
      "Apabila para sahabat bertanya bagaimana untuk berselawat ke atas baginda, Nabi ﷺ mengajarkan kepada mereka lafaz yang tepat ini — selawat yang paling sahih dalam Sunnah. Anda memuliakan Rasulullah ﷺ sebagaimana yang Allah perintahkan, menyempurnakan solat anda dengan rasa cinta kepada baginda yang mengajar anda solat.",
  },
  {
    title: "Memohon perlindungan sebelum salam",
    when: "Selepas tasyahud akhir dan selawat, sejurus sebelum mengakhiri solat.",
    meaning:
      "Nabi ﷺ memerintahkan agar selepas tasyahud akhir seseorang memohon perlindungan daripada empat bahaya ini sebelum memberi salam — permohonan terakhir dalam solat ini merangkumi kehidupan dunia, kubur, Neraka, dan fitnah paling besar yang akan datang.",
  },
  {
    title: "Salam (penutup solat)",
    when: "Mengakhiri solat — berpaling muka ke kanan, kemudian ke kiri.",
    meaning:
      "Anda meninggalkan solat sebagaimana anda meninggalkan majlis orang yang dimuliakan — dengan ucapan salam kepada malaikat pencatat di setiap bahu dan kepada mereka yang solat di sebelah anda. Salam ialah rukun; dengannya solat menjadi sempurna.",
  },
];

export const SALAH_GUIDE_QUIZ_MS: DeepPartial<SalahGuideQuizQuestion>[] = [
  {
    prompt: "Berapakah rakaat sunat rawatib harian yang disebut dalam hadis Ummu Habibah?",
    options: ["8", "10", "12", "14"],
    explanation:
      "Hadis Ummu Habibah menjanjikan sebuah rumah di Syurga bagi dua belas rakaat sunat sehari semalam (Sahih Muslim 728); Jami' at-Tirmizi 415 memperincikannya: 2 sebelum Subuh, 4 sebelum Zohor, 2 selepas Zohor, 2 selepas Maghrib dan 2 selepas Isyak.",
  },
  {
    prompt: "Sebelum Subuh, sunat yang ditekankan (muakkad) ialah:",
    options: ["Tiada", "2 rakaat", "4 rakaat", "Hanya 2 rakaat selepasnya"],
    explanation:
      "Dua rakaat sebelum Subuh ialah sunat muakkad — Nabi ﷺ tidak pernah meninggalkannya (Sahih al-Bukhari 1169; Sahih Muslim 724).",
  },
  {
    prompt: "Dalam hadis Ummu Habibah (Jami' at-Tirmizi 415), rawatib di sekitar Zohor ialah:",
    options: [
      "2 sebelum, 2 selepas",
      "4 sebelum, 2 selepas",
      "4 sebelum, 4 selepas",
      "Hanya 2 sebelum",
    ],
    explanation:
      "Hadis Ummu Habibah menyebut empat sebelum Zohor dan dua selepasnya. Riwayat Ibnu Umar (Sahih al-Bukhari 1180) menyebut dua sebelumnya, maka mazhab-mazhab berbeza tentang set mana yang dikira sebagai rawatib yang ditekankan; rakaat selebihnya ialah nafil.",
  },
  {
    prompt:
      "Betul atau salah: Empat rakaat sebelum Asar termasuk dalam dua belas rawatib harian yang tetap.",
    options: ["Betul", "Salah"],
    explanation:
      "Empat rakaat sebelum Asar ialah sunat ghairu muakkad (dianjurkan secara meluas) tetapi tidak dikira dalam dua belas rawatib (Jami' at-Tirmizi 430).",
  },
  {
    prompt: "Mengapakah Witir diletakkan dalam kategori tersendiri dalam penjejak solat?",
    options: [
      "Ia tidak disebut dalam hadis",
      "Mazhab Hanafi menganggapnya wajib manakala majoriti menganggapnya sunat muakkad",
      "Ia sentiasa dikerjakan sebelum Isyak",
      "Ia tiada bilangan rakaat yang ditetapkan",
    ],
    explanation:
      "Witir sangat kukuh pensyariatannya, tetapi ulama berbeza pendapat sama ada ia wajib atau sunat muakkad — maka ia dijejak berasingan daripada dua belas rawatib.",
  },
  {
    prompt: "Dalam solat Subuh berjemaah, imam membaca:",
    options: [
      "Secara perlahan dalam kedua-dua rakaat",
      "Dengan kuat dalam kedua-dua rakaat",
      "Dengan kuat dalam rakaat pertama sahaja",
      "Perlahan dalam rakaat pertama, kuat dalam rakaat kedua",
    ],
    explanation:
      "Subuh dibaca dengan kuat (jahar) dalam kedua-dua rakaat. Di belakang imam, anda mendengar dengan teliti.",
  },
  {
    prompt: "Zohor dan Asar secara berjemaah dibaca:",
    options: [
      "Dengan kuat dalam semua rakaat",
      "Secara perlahan dalam semua rakaat",
      "Kuat dalam dua rakaat pertama, perlahan selepasnya",
      "Perlahan dalam dua rakaat pertama, kuat selepasnya",
    ],
    explanation:
      "Zohor dan Asar dibaca secara sir (perlahan) sepanjang solat — imam membaca secara perlahan dan setiap makmum membaca untuk dirinya sendiri.",
  },
  {
    prompt: "Dalam solat Maghrib, imam membaca dengan kuat dalam:",
    options: [
      "Ketiga-tiga rakaat",
      "Dua rakaat pertama sahaja",
      "Rakaat ketiga sahaja",
      "Tiada — Maghrib sepenuhnya perlahan",
    ],
    explanation:
      "Maghrib dibaca secara jahar dalam rakaat pertama dan kedua serta secara sir dalam rakaat ketiga — corak panjang/pendek yang sama seperti solat-solat lain.",
  },
  {
    prompt: "Dalam solat Isyak, bilakah bacaan kuat berhenti?",
    options: [
      "Selepas rakaat pertama",
      "Selepas rakaat kedua",
      "Selepas rakaat ketiga",
      "Tidak pernah — keempat-empat rakaat dibaca kuat",
    ],
    explanation:
      "Isyak dibaca dengan kuat dalam dua rakaat pertama dan secara perlahan dalam rakaat ketiga dan keempat.",
  },
  {
    prompt: "Dalam solat jahar di belakang imam, semua ulama bersepakat bahawa anda patut:",
    options: [
      "Membaca surah lain dengan kuat bersama imam",
      "Mendengar dengan teliti dan tidak membaca surah lain dengan kuat",
      "Meninggalkan solat selepas Al-Fatihah",
      "Membaca hanya dalam rakaat terakhir",
    ],
    explanation:
      "Allah berfirman: 'apabila Al-Quran itu dibacakan, maka dengarlah akan dia serta diamlah' (Al-Quran 7:204).",
  },
  {
    prompt: "Menurut mazhab Syafie, di belakang imam dalam solat jahar, anda:",
    options: [
      "Tidak membaca Al-Fatihah langsung",
      "Membaca Al-Fatihah dalam setiap rakaat",
      "Membaca hanya dalam rakaat yang perlahan",
      "Membaca dengan kuat bersama imam",
    ],
    explanation:
      "Mazhab Syafie berpendapat bahawa membaca Al-Fatihah wajib bagi setiap orang yang solat dalam setiap rakaat, berdalilkan 'There is no prayer for the one who does not recite the Opening of the Book' (makna dalam bahasa Inggeris) (Sahih al-Bukhari 756).",
  },
  {
    prompt: "Menurut mazhab Hanafi, dalam solat jahar di belakang imam, anda:",
    options: [
      "Membaca Al-Fatihah secara perlahan dalam setiap rakaat",
      "Mendengar dengan teliti dan tidak membaca Al-Fatihah",
      "Membaca hanya surah selepas Al-Fatihah",
      "Mesti membaca Al-Fatihah dengan kuat",
    ],
    explanation:
      "Pendapat muktamad mazhab Hanafi ialah mendengar dalam solat jahar; bacaan imam sudah memadai. Keempat-empat mazhab Ahli Sunnah ialah pendapat yang sah.",
  },
  {
    prompt: "Dalam dua rakaat pertama Zohor, Nabi ﷺ lazimnya membaca:",
    options: [
      "Al-Fatihah sahaja",
      "Al-Fatihah dan surah lain",
      "Tiada — ia sepenuhnya senyap",
      "Tasbih sahaja",
    ],
    explanation:
      "Abu Qatadah meriwayatkan bahawa Nabi ﷺ membaca Al-Fatihah dan surah lain dalam dua rakaat pertama Zohor dan Asar, dan hanya Al-Fatihah dalam dua rakaat terakhir (Sahih al-Bukhari 776; Sahih Muslim 451).",
  },
  {
    prompt: "Ketika solat Subuh bersendirian, sunatnya ialah:",
    options: [
      "Membaca secara perlahan sahaja",
      "Membaca dengan kuat (walaupun perlahan tetap sah)",
      "Meninggalkan surah selepas Al-Fatihah",
      "Solat satu rakaat sahaja",
    ],
    explanation:
      "Ketika bersendirian, anda membaca kandungan yang sama seperti dalam solat berjemaah; dalam Subuh, Maghrib dan Isyak sunat membaca dengan kuat.",
  },
  {
    prompt:
      "Betul atau salah: Enam rakaat tetap selepas Maghrib sebagai solat Awwabin ialah sunnah yang sabit dengan kesepakatan sebulat suara.",
    options: ["Betul", "Salah"],
    explanation:
      "Nafil umum selepas Maghrib digalakkan, tetapi penetapan masyhur tepat enam rakaat sebagai Awwabin dipertikaikan kesahihannya — ia tidak sepatutnya dibentangkan sebagai sunnah tetap yang sabit.",
  },
];
