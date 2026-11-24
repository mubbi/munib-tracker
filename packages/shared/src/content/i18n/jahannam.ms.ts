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

// Malay translation overlay for the Learn Jahannam content. Each overlay mirrors
// the order of its English array in ../jahannam*.ts (index-aligned); untranslated
// entries fall back to English. Only human-readable text is translated.

export const JAHANNAM_CORE_TOPICS_MS: DeepPartial<JahannamTopic>[] = [
  {
    title: "Pengenalan",
    summary: "Allah memberitahu kita tentang Jahannam sebagai petunjuk — bukan untuk berputus asa.",
    body: [
      "Jahannam — yang sering diterjemahkan sebagai neraka atau Api — ialah tempat azab di akhirat yang Allah gambarkan dalam al-Quran dan melalui Rasul-Nya ﷺ. Dia mengkhabarkannya bukan untuk menghancurkan hati dengan ketakutan, tetapi supaya hati tersedar, kembali, dan memilih jalan rahmat selagi pintunya masih terbuka.",
      "Ada baiknya kita memahami mengapa Tuhan Yang Maha Penyayang berbicara tentang Neraka. Amaran itu sendiri ialah rahmat: seseorang yang diberitahu bahawa ada gaung di hadapannya dalam kegelapan sebenarnya telah diberi hadiah, bukan ugutan. Setiap ayat tentang Jahannam ialah seruan Allah, dengan kasih sayang-Nya, memanggil hamba-hamba-Nya kembali sebelum berlalu masa untuk kembali.",
      "Oleh sebab itu, amaran-amaran tersebut sentiasa digandingkan dalam wahyu dengan seruan kepada taubat, keampunan, dan harapan kepada rahmat Allah yang luas. Al-Quran jarang menyebut Neraka tanpa menyebut, di dekatnya, Syurga, pintu taubat yang terbuka, dan kasih Allah kepada mereka yang kembali. Tujuannya ialah rasa bertanggungjawab yang membawa kepada kebaikan — bukan sekali-kali putus asa.",
      "Beriman kepada Jahannam ialah sebahagian daripada beriman kepada perkara ghaib (al-ghayb), kepada keadilan Ilahi, dan kepada hakikat Hari Akhirat. Iman ini memberi nilai kepada pilihan-pilihan kita dan mengimbangi harapan kepada Syurga dengan kesungguhan terhadap dosa, supaya seorang mukmin berjalan di antara harap dan takut — berharap kepada rahmat Allah, berwaspada terhadap kekurangan dirinya sendiri.",
      "Satu perkara yang menenangkan, yang menjadi teras akidah Ahli Sunnah, terdapat di sepanjang modul ini: mereka yang mati dalam keadaan beriman kepada Allah Yang Esa, walaupun dibebani dosa, tidak akan kekal selama-lamanya di dalam Neraka. Dengan rahmat Allah dan syafaat yang diizinkan-Nya, orang mukmin yang berdosa akhirnya akan dikeluarkan; hanya mereka yang mati dalam keadaan menolak iman akan kekal. Maka bagi seorang mukmin, mempelajari Jahannam pada hakikatnya ialah mempelajari cara untuk mencapai rahmat.",
      "Modul ini membentangkan apa yang dinyatakan dengan jelas oleh nas, mencatat dengan jujur perkara yang diperselisihkan oleh ulama, hanya memetik dalil yang sahih, dan sentiasa mengarahkan anda kepada taubat, amal soleh, dan tawakal kepada Allah.",
    ],
    appLinks: [{ label: "Harapan kepada rahmat Allah" }, { label: "Perjalanan ke Jannah" }],
  },
  {
    title: "Mengapa Allah Mencipta Jahannam",
    summary: "Keadilan Ilahi, pertanggungjawaban, dan akibat daripada kebebasan memilih.",
    body: [
      "Jahannam wujud sebagai manifestasi keadilan Allah yang sempurna ('adl). Alam yang padanya orang zalim dan orang yang dizalimi, orang yang ikhlas dan orang yang khianat, semuanya menemui pengakhiran yang sama bukanlah alam yang adil. Oleh kerana Allah Maha Adil dengan sempurna, mesti ada perhitungan terakhir yang padanya setiap kesalahan dibalas dan setiap kebaikan dihargai.",
      "Teras kepada semua ini ialah Allah tidak menzalimi sesiapa pun. Setiap jiwa yang memasuki Neraka memasukinya kerana pilihan-pilihannya sendiri yang telah tetap dan tidak ditaubati — bukan sekali-kali kerana ketetapan yang sewenang-wenang. Al-Quran menegaskan: 'Sesungguhnya Allah tidak menganiaya manusia sedikitpun, akan tetapi manusia jualah yang menganiaya diri mereka sendiri' (10:44). Tiada sesiapa dihukum atas perkara yang tidak dilakukannya, dan tidak juga melebihi apa yang sepatutnya.",
      "Manusia tidak dibiarkan dalam kegelapan. Allah mengurniakan mereka akal, mengutus para rasul, dan menurunkan petunjuk yang jelas, kemudian memuliakan mereka dengan kebebasan sebenar untuk menerima atau menolaknya: 'sesiapa yang mahu beriman, hendaklah ia beriman; dan sesiapa yang mahu kufur ingkar, biarlah dia mengingkarinya' (18:29). Berterusan menolak kebenaran, melakukan kezaliman, atau melakukan dosa besar tanpa taubat membawa akibat di akhirat, justeru kerana pilihan itu benar-benar pilihan diri sendiri.",
      "Namun, di sini pun rahmat menaungi keadilan. Allah memberi amaran sebelum Dia menghakimi, menangguhkan perhitungan untuk memberi ruang bagi kembali, mengampunkan dengan segera apabila dipohon, dan membalas satu kebaikan dengan berlipat kali ganda sedangkan satu kejahatan dicatat sebagai satu sahaja. Keadilan-Nya tidak pernah terpisah daripada rahmat-Nya.",
      "Oleh itu, merenungkan mengapa Jahannam wujud sepatutnya menambahkan takwa (kesedaran tentang Allah) dan memperdalam rasa syukur atas setiap hari kehidupan yang masih menjadi peluang untuk bertaubat. Ia bertujuan menjadikan hati bersungguh-sungguh dan penuh harapan pada masa yang sama — bukan sekali-kali melumpuhkannya dengan rasa putus asa.",
    ],
    appLinks: [{ label: "Belajar Akidah — keadilan Ilahi" }],
  },
  {
    title: "Hakikat Akhirat",
    summary:
      "Dari kematian hingga penghakiman — setiap peringkat adalah benar dan berkait dengan akidah.",
    body: [
      "Untuk memahami Jahannam dengan betul, ada baiknya kita melihat kedudukannya dalam perjalanan yang lebih besar. Islam mengajarkan urutan yang jelas selepas kematian: roh meninggalkan jasad, kemudian bermulanya alam barzakh (kehidupan pertengahan di alam kubur), kemudian Kebangkitan apabila jasad dibangkitkan, Perhimpunan seluruh makhluk, Penghakiman yang padanya amalan diperiksa, penimbangan amalan di atas Neraca (al-Mizan), penyeberangan Titian (as-Sirat), dan akhirnya penempatan setiap jiwa di Syurga atau Neraka — semuanya dengan ketetapan, keadilan, dan rahmat Allah.",
      "Setiap peringkat ini ditetapkan dalam akidah arus perdana Ahli Sunnah berdasarkan al-Quran dan Sunnah yang sahih. Urutan ini bukan simbol atau cerita; ia ialah hakikat yang wajib diimani sebagai sebahagian daripada beriman kepada Hari Akhirat, dan mengingkarinya dengan sedar ialah persoalan akidah, bukan sekadar persoalan amalan.",
      "Melihat keseluruhan jalan ini juga memberi kefahaman baharu tentang Neraka. Ia ialah salah satu destinasi yang mungkin di penghujung perjalanan yang sedang ditempuh oleh setiap jiwa — ini bermakna pilihan-pilihan hari ini bukanlah perkara abstrak. Semuanya ialah langkah di sepanjang jalan itu, dan kita masih berpeluang menentukan arahnya.",
      "Mengetahui urutan ini membantu seorang mukmin bersiap sedia, bukan sekadar takut: hidup dengan mengingati mati (zikr al-mawt) secara sihat, membetulkan kesalahan sebelum ia dibawa ke Perhimpunan, dan memenuhkan catatan amal soleh selagi pintu untuk beramal masih terbuka. Kematian menutup pintu itu; tiada apa yang boleh ditambah selepasnya.",
    ],
    actions: [
      "Pelajari setiap peringkat dalam Belajar Akidah dan kaitkan keimanan dengan pilihan harian.",
      "Perbanyakkan mengingati mati (zikr al-mawt) tanpa mengabaikan harapan kepada rahmat.",
    ],
    appLinks: [
      { label: "Akidah — Hari Akhirat" },
      { label: "Kebangkitan" },
      { label: "Hari Penghakiman" },
      { label: "Neraca & Titian Sirat" },
      { label: "Neraka dalam Akidah" },
      { label: "Syurga dalam Akidah" },
    ],
  },
  {
    title: "Nama-Nama Neraka",
    summary:
      "Nama-nama dalam al-Quran beserta maknanya — ulama berbeza pendapat sama ada setiap nama ialah tingkatan yang tersendiri.",
    body: [
      "Al-Quran menyebut neraka dengan beberapa nama, dan ini bukan sekadar pengulangan. Dalam bahasa Arab, sesuatu nama sering membawa gambaran yang jelas di dalamnya, maka setiap nama mengajarkan sesuatu tentang hakikat yang ditunjukkannya. Antaranya ialah Jahannam, Jahim, Saqar, Sa'ir, al-Hutamah, al-Hawiyah, dan Laza.",
      "Setiap nama membuka jendela kepada aspek kedahsyatan yang berbeza. Jahim dan Sa'ir menggambarkan api yang marak menyala dan dinyalakan; Saqar, api yang membakar hangus dan tidak meninggalkan apa-apa; al-Hutamah, penghancur yang meremukkan apa sahaja yang dicampakkan ke dalamnya; al-Hawiyah, jurang dalam yang ke dalamnya seseorang terjatuh; dan Laza, nyalaan api yang menyiat. Membaca nama-nama ini bersama-sama membina gambaran yang menginsafkan yang tidak mudah diabaikan oleh hati.",
      "Ulama tafsir klasik — seperti Ibnu Kathir dan al-Tabari — menjelaskan nama-nama ini berdasarkan akar katanya dalam bahasa Arab dan membincangkan setiap satu dalam konteks ayat tempat ia disebut, bukannya menganggapnya sebagai senarai teknikal yang tetap.",
      "Perlu ada sedikit peringatan di sini. Sebahagian penulis terkemudian membentangkan setiap nama sebagai 'tingkatan' neraka yang tersendiri dan bertingkat-tingkat, kadangkala dengan rajah yang terperinci. Itu ialah tafsiran ulama, bukan senarai jelas yang dinyatakan dalam al-Quran atau dalam hadis yang disepakati. Pendekatan yang seimbang ialah mempelajari makna yang benar-benar diberikan oleh nas dan mengelak daripada membentangkan peta spekulatif sebagai satu kepastian.",
      "Tujuan mempelajari nama-nama ini bukan untuk memuaskan rasa ingin tahu, tetapi untuk melembutkan hati dan menggerakkannya ke arah rahmat yang sentiasa ditunjukkan oleh modul ini. Lihat koleksi penuh nama-nama untuk mengetahui tempat setiap nama disebut dalam al-Quran, konteksnya, dan ringkasan tafsirnya.",
    ],
    appLinks: [{ label: "Lihat semua nama" }],
  },
  {
    title: "Tingkatan Neraka",
    summary:
      "Darjat azab yang berbeza-beza — struktur tepatnya tidak diperincikan sepenuhnya dalam nas.",
    body: [
      "Satu prinsip yang dinyatakan dengan jelas oleh al-Quran ialah azab itu setimpal: tidak semua penghuni Neraka merasainya dengan kadar yang sama. 'Dan bagi tiap-tiap seorang (dari manusia atau jin), beberapa darjat (tingkatan balasan) disebabkan (amal baik atau jahat) yang mereka telah kerjakan' (6:132). Ini sendiri ialah gambaran keadilan — orang yang sedikit kezalimannya tidak dilayan sama seperti orang yang banyak kezalimannya.",
      "Sunnah yang sahih menggambarkan prinsip yang sama. Nabi ﷺ menggambarkan penghuni Neraka yang paling ringan azabnya sebagai seseorang yang diletakkan dua bara api di bawah kedua-dua tapak kakinya sehingga otaknya mendidih kerananya — namun dialah yang paling ringan azabnya antara seluruh penghuninya (Sahih al-Bukhari 6562). Jika itu yang paling ringan, akal dapat memahami betapa beratnya darjat-darjat yang lebih tinggi, dan betapa banyak sebab untuk kembali hari ini.",
      "Pada masa yang sama, wahyu tidak memberikan kepada orang mukmin peta struktur neraka yang lengkap dan bernombor yang wajib dihafal. Ulama telah membincangkan tingkatan, kedalaman, dan kategori yang diambil daripada pelbagai ayat dan riwayat, tetapi kebanyakannya kekal sebagai tafsiran, bukan nas yang jelas dan disepakati.",
      "Namun, dua perkara adalah pasti. Pertama, kezaliman (zulm), syirik, dan dosa besar yang berterusan tanpa taubat membawa amaran yang berat. Kedua — dan ini tidak boleh dilupakan — rahmat dan keampunan Allah tetap terbuka sehingga saat kematian bagi sesiapa yang kembali kepada-Nya dengan ikhlas. Tujuan mempelajari darjat-darjat ini ialah untuk memilih jalan yang lebih ringan selagi pilihan masih ada.",
      "Secara praktikal, ini bermakna menganggap senarai terperinci 'tujuh tingkatan' atau skema yang seumpamanya sebagai pendapat ulama, bukan doktrin yang muktamad, dan terus memberi tumpuan kepada perkara yang benar-benar melindungi: iman, taubat, dan amal soleh.",
    ],
    disclaimer:
      "Rajah tingkatan neraka yang terdapat dalam sesetengah buku mencerminkan tafsiran ulama, bukan kesepakatan sebulat suara.",
  },
  {
    title: "Pintu-Pintu Neraka",
    summary: "Tujuh pintu — apa yang dinyatakan oleh al-Quran dan di mana tafsiran berbeza.",
    body: [
      "Satu perincian tentang Jahannam dinyatakan dengan jelas dan tegas dalam al-Quran: 'Ia mempunyai tujuh pintu; bagi tiap-tiap sebuah pintu ada bahagian yang tertentu dari mereka' (15:44). Oleh itu, kepercayaan kepada tujuh pintu bersandarkan wahyu yang jelas, bukan spekulasi.",
      "Ayat ini menegaskan dua perkara: bahawa ada tujuh pintu, dan bahawa mereka yang memasukinya dibahagikan kepada pintu-pintu itu. Ulama tafsir klasik membincangkan maksud pembahagian ini — sama ada ia merujuk kepada golongan manusia, kepada darjat azab yang setimpal dengan amalan, atau kedua-duanya. Hikmah di sebalik pembahagian ini milik Allah, yang dengan keadilan-Nya menempatkan setiap jiwa tepat di tempat yang sepatutnya.",
      "Penting untuk menyedari di mana kepastian berakhir. Sesetengah karya terkemudian mengaitkan setiap pintu tertentu dengan dosa atau golongan tertentu. Kaitan-kaitan khusus ini tidak ditetapkan secara seragam dalam sumber-sumber terawal, maka sebaiknya ia dibentangkan sebagai pandangan ulama secara individu, bukan sebagai penjelasan daripada Nabi ﷺ.",
      "Seperti tingkatan, pengajaran tentang pintu-pintu ini bukan soal seni bina tetapi soal akhlak: ada banyak pintu yang membawa ke arah Neraka, dan cara untuk selamat daripada semuanya adalah sama — iman yang ikhlas, menjauhi dosa besar, dan segera bertaubat apabila tergelincir.",
    ],
    appLinks: [{ label: "Perincian pintu-pintu" }],
  },
  {
    title: "Gambaran Jahannam",
    summary:
      "Api, kepanasan, rantai, penyesalan — dibentangkan dengan penuh hormat, bukan sensasi.",
    body: [
      "Al-Quran dan Sunnah yang sahih menggambarkan Jahannam dengan bahasa yang jelas dan nyata, dan ada sebabnya: hati manusia lebih tersentuh oleh gambaran yang dapat dibayangkan berbanding idea yang abstrak. Gambaran-gambaran ini — api yang dahsyat, kepanasan yang tidak tertanggung, makanan dan minuman yang terhad, rantai, kegelapan, dan penyesalan yang mendalam — bertujuan menjadikan bahaya itu cukup nyata untuk memalingkan kita daripadanya.",
      "Antara gambaran tersebut ialah air mendidih yang diberi minum, pokok zaqqum yang pahit sebagai makanan, pakaian yang dipotong daripada api, dan terpisah daripada setiap keselesaan yang pernah diharapkan oleh seseorang. Nabi ﷺ menyampaikan betapa jauhnya kepanasan ini melebihi apa sahaja yang kita ketahui; baginda bersabda bahawa api yang kita nyalakan di dunia ini hanyalah satu bahagian daripada tujuh puluh bahagian api akhirat (Sahih al-Bukhari 3265).",
      "Gambaran-gambaran ini ialah amaran yang benar, bukan sekadar kiasan yang mengosongkan akhirat daripada akibat. Ulama Ahli Sunnah menetapkan hakikatnya sambil menyerahkan bentuk sebenar perkara ghaib ini kepada ilmu Allah; tugas seorang mukmin ialah menghayati amaran itu, bukan membedahnya.",
      "Ada adab dalam membaca petikan seperti ini. Ia didekati dengan rendah diri, rasa gerun kepada Allah, dan dorongan segera untuk bertaubat dan memohon perlindungan — bukan dengan minat yang tidak sihat, dan bukan sekali-kali dengan rasa putus asa, kerana seluruh tujuan amaran itu ialah kita masih mempunyai masa untuk mengelakkannya.",
      "Barangkali tema yang paling berat dalam gambaran-gambaran ini ialah penyesalan. 'Alangkah baiknya jika dahulu aku…' akan diucapkan apabila masa untuk beramal telah pun tertutup. Rahmat dalam mendengar tentang penyesalan itu sekarang ialah kita boleh bertindak atas 'alangkah baiknya' itu hari ini, selagi ia masih boleh mengubah pengakhiran kita.",
    ],
    appLinks: [{ label: "Perlindungan daripada Neraka" }],
  },
  {
    title: "Siapakah yang Diberi Amaran?",
    summary: "Golongan dalam al-Quran dan Sunnah — bukan penghakiman terhadap individu.",
    body: [
      "Pembaca al-Quran yang teliti akan menyedari bahawa amarannya ditujukan kepada perbuatan dan sikap, bukan kepada individu yang disebut namanya. Ia memberi amaran kepada mereka yang berterusan dalam kekufuran selepas kebenaran jelas kepada mereka, orang munafik yang mengaku beriman secara zahir sedangkan menolaknya dalam batin, orang zalim yang mencabuli hak orang lain, orang sombong yang terlalu angkuh untuk tunduk, dan mereka yang mati dalam dosa besar tanpa pernah bertaubat.",
      "Tumpuan kepada golongan dan bukan kepada individu ini disengajakan dan penuh rahmat. Pintu untuk kembali sentiasa terbuka bagi setiap orang yang masih hidup, walau apa pun masa lalunya, kerana catatan amalan seseorang tidak ditutup sehingga dia mati. Amaran itu menggambarkan jalannya, supaya sesiapa yang masih menempuhnya boleh keluar daripadanya.",
      "Oleh sebab itu, Islam tidak membenarkan kita mengisytiharkan nasib akhir mana-mana individu tertentu — mengatakan 'orang ini di dalam Neraka' — kecuali dalam kes-kes yang jarang berlaku apabila Allah atau Rasul-Nya ﷺ menyatakannya dengan jelas dalam wahyu yang sahih. Menghakimi hati dan pengakhiran seseorang hanyalah hak Allah semata-mata; tugas kita ialah menghisab diri sendiri.",
      "Maka cara yang betul membaca setiap amaran ialah menghalakannya ke dalam diri: bukan 'siapakah yang digambarkan ini?' tetapi 'adakah mana-mana bahagian ini menggambarkan diriku, dan apakah yang akan aku ubah hari ini?' Siapa pun anda, jemputan untuk kembali kepada Allah terbuka sekarang juga — dan hari esok tidak dijanjikan kepada sesiapa pun.",
    ],
    appLinks: [{ label: "Dosa-dosa besar" }],
  },
  {
    title: "Dosa-Dosa Besar",
    summary: "Kaba'ir — dosa-dosa berat yang menuntut taubat yang ikhlas.",
    body: [
      "Ulama membahagikan dosa kepada dua kategori, dan memahami perbezaannya membawa kesungguhan dan juga kelegaan. Dosa besar (al-kaba'ir) ialah dosa yang Allah atau Rasul-Nya ﷺ kaitkan dengan akibat berat yang khusus — ancaman Neraka, laknat, kemurkaan Allah, atau hukuman yang ditetapkan — seperti syirik, membunuh, dan memakan riba. Dosa kecil (al-sagha'ir) ialah kesilapan-kesilapan kecil yang tidak sampai ke tahap itu.",
      "Kelegaannya terletak pada kaitan antara kedua-duanya. Allah berjanji bahawa jika seorang mukmin menjauhi dosa-dosa besar, dosa-dosa kecil akan dihapuskan oleh ibadat-ibadat biasa: 'Jika kamu menjauhkan dosa-dosa besar yang dilarang kamu melakukannya, Kami akan ampunkan kesalahan-kesalahan (dosa kecil) kamu' (4:31). Solat ke solat, Jumaat ke Jumaat, dan Ramadan ke Ramadan menghapuskan dosa-dosa di antaranya, selagi dosa-dosa besar dijauhi.",
      "Inilah sebabnya dosa-dosa besar wajar diberi perhatian khusus: dosa-dosa inilah yang tidak terhapus begitu sahaja dalam aliran ibadat harian, tetapi menuntut taubat yang disengajakan dan ikhlas. Jika diteruskan tanpa berpaling daripadanya, ia membahayakan jiwa; jika ditinggalkan dan ditaubati, ia diampunkan.",
      "Dan inilah ufuk yang menaungi semuanya: kecuali mati dalam keadaan syirik, setiap dosa — besar atau kecil — berada di bawah keampunan Allah jika Dia menghendaki. 'Sesungguhnya Allah tidak akan mengampunkan dosa syirik mempersekutukanNya (dengan sesuatu apajua), dan akan mengampunkan dosa yang lain dari itu bagi sesiapa yang dikehendakiNya' (4:48). Tiada seorang mukmin pun patut menyimpulkan bahawa dosa-dosa besarnya meletakkannya di luar jangkauan rahmat.",
      "Setiap topik dosa besar dalam modul ini memberikan takrifnya, dalilnya, sebab ia berat, dan jalan konkrit untuk bertaubat dan menjauhinya — sentiasa berakhir di pintu terbuka yang sama. Untuk senarai tujuh dosa yang membinasakan (al-mūbiqāt) daripada Nabi ﷺ dan jawapan baginda tentang 'dosa yang paling besar' mengikut urutan, lihat Dosa-Dosa yang Membinasakan.",
    ],
    appLinks: [
      { label: "Senarai dosa-dosa besar" },
      { label: "Dosa-dosa yang membinasakan" },
      { label: "Taubat" },
    ],
  },
  {
    title: "Dosa-Dosa Lidah",
    summary: "Mengumpat, berdusta, mengejek — dosa yang mudah dilakukan tetapi sukar diperbaiki.",
    body: [
      "Lidah itu kecil tetapi akibatnya amat besar; dengan beberapa patah kata seseorang boleh membina kepercayaan atau memusnahkan maruah, menenangkan hati atau melukainya dengan dalam. Inilah sebabnya al-Quran dan Sunnah sering kembali menyebut dosa-dosa percakapan: mengumpat (ghibah), memfitnah (buhtan), mengadu domba (namimah), berdusta, mengejek, dan sumpah palsu.",
      "Mengumpat bermaksud menyebut tentang saudara atau saudari anda sesuatu yang tidak disukainya, walaupun perkara itu benar — kerana jika ia tidak benar, ia menjadi dosa fitnah yang lebih berat. Al-Quran memberikan salah satu perumpamaannya yang paling menyentuh: ia menyamakannya dengan memakan daging saudara sendiri yang telah mati (49:12). Apabila dilihat begitu, dosa itu tidak lagi kelihatan remeh.",
      "Apa yang menjadikan dosa-dosa ini begitu berbahaya ialah betapa mudah dan biasanya ia dilakukan. Orang terjerumus ke dalamnya dalam perbualan harian tanpa berfikir panjang; sebab itulah Nabi ﷺ mengaitkan iman itu sendiri dengan menjaga percakapan: 'Whoever believes in Allah and the Last Day, let him speak good or remain silent' (maksud dalam bahasa Inggeris). Berhenti sejenak sebelum bercakap ialah satu ibadat yang sebenar.",
      "Taubat daripada dosa lidah mengikut syarat-syarat biasa — berhenti, menyesal, berazam untuk tidak mengulanginya — dengan dimensi tambahan apabila melibatkan hak orang lain. Jika membersihkan nama baiknya atau memohon kemaafannya boleh dilakukan tanpa menimbulkan kemudaratan yang lebih besar, itu sebahagian daripada taubat; jika memberitahunya hanya akan memperdalam luka, ulama menasihatkan supaya sebaliknya bercakap baik tentangnya, membelanya ketika dia tiada, dan mendoakan keampunan baginya.",
    ],
    actions: [
      "Sebelum bercakap, tanya diri: Adakah ia benar? Adakah ia perlu? Adakah ia baik?",
      "Jika anda pernah mengumpat seseorang, doakanlah dia dan mohonlah kemaafannya jika boleh.",
    ],
    appLinks: [
      { label: "Renungan harian" },
      { label: "Jannah — akhlak mulia" },
      { label: "Dosa-dosa yang membinasakan" },
      { label: "Taubat" },
    ],
  },
  {
    title: "Dosa terhadap Orang Lain",
    summary: "Hak sesama manusia menuntut pemulangan hak — bukan hanya taubat kepada Allah.",
    body: [
      "Islam membahagikan hak yang wajib kita tunaikan kepada dua jenis: hak Allah (huquq Allah) dan hak sesama manusia (huquq al-'ibad). Kezaliman (zulm), ketidakadilan, mengkhianati amanah, menipu dalam perniagaan, menahan upah pekerja, hutang yang tidak dibayar, dan memutuskan silaturahim semuanya termasuk dalam hak sesama manusia — dan semua ini membawa kesan yang sangat serius di akhirat.",
      "Sebabnya ditunjukkan dalam sebuah hadis yang menginsafkan. Nabi ﷺ menggambarkan orang yang benar-benar muflis sebagai seseorang yang datang pada Hari Kiamat dengan solat, puasa, dan sedekah — tetapi dia pernah mencaci, memfitnah, mengambil harta secara zalim, dan menumpahkan darah. Mangsa-mangsanya dibayar daripada amal kebaikannya sehingga habis, kemudian dosa-dosa mereka dipikulkan ke atasnya lalu dia dicampakkan ke dalam Neraka (Sahih Muslim 2581). Seseorang boleh kaya dengan ibadat tetapi tetap binasa kerana cara dia melayan orang lain.",
      "Ini mengajarkan satu pengajaran penting tentang taubat: kembali kepada Allah adalah wajib, tetapi apabila hak manusia telah dicabuli, itu sahaja tidak mencukupi. Tuntutan orang yang dizalimi kekal sehingga ia diselesaikan atau dimaafkan. Maka taubat di sini mempunyai syarat keempat selain berhenti, menyesal, dan berazam — iaitu memulangkan apa yang terhutang.",
      "Secara praktikal, ini bermakna memulangkan apa yang telah diambil atau nilainya, membayar hutang walaupun secara beransur-ansur, memulihkan maruah orang yang telah dirosakkan, dan menghulurkan tangan untuk berdamai dengan kaum kerabat yang telah diputuskan hubungannya. Dan ada rahmat dalam hal ini juga: setiap langkah memulangkan hak itu sendiri ialah satu kebaikan, dan Allah memudahkan hati yang ikhlas yang berusaha membaiki apa yang telah dirosakkannya.",
    ],
    actions: [
      "Senaraikan sesiapa yang mungkin pernah anda zalimi dan ambil satu langkah untuk membaikinya minggu ini.",
      "Bayarlah hutang yang tertunggak walaupun secara ansuran kecil jika itu sahaja yang anda mampu.",
    ],
    appLinks: [
      { label: "Perjalanan Saya" },
      { label: "Taubat" },
      { label: "Dosa-dosa yang membinasakan" },
      { label: "Hisab (Hari Akhirat)" },
    ],
  },
  {
    title: "Nifak",
    summary: "Nifak besar dalam akidah — dan sifat-sifat nifak dalam perbuatan.",
    body: [
      "Ulama membezakan dua jenis nifak, dan memisahkan kedua-duanya mengelakkan rasa selamat yang palsu dan juga rasa panik yang tidak berasas. Yang pertama ialah nifak besar dalam akidah (nifaq i'tiqadi): menzahirkan Islam secara luaran sedangkan menolak iman di dalam batin. Inilah nifak yang paling keras diberi amaran oleh al-Quran, yang meletakkan golongan ini 'pada tingkatan yang terkebawah sekali dari (lapisan-lapisan dalam) neraka' (4:145), kerana pada hakikatnya mereka mati sebagai orang kafir di sebalik topeng.",
      "Yang kedua ialah nifak kecil dalam perbuatan (nifaq 'amali): sifat-sifat yang menyerupai kelakuan orang munafik walaupun pada diri seseorang yang imannya benar. Nabi ﷺ menyebut tanda-tandanya yang terkenal — 'when he speaks he lies, when he promises he breaks it, and when he is entrusted he betrays' (maksud dalam bahasa Inggeris) — dan dalam riwayat lain menambah berkata kesat ketika bertengkar. Seorang mukmin boleh terjerumus ke dalamnya dan masih kekal sebagai mukmin, tetapi ia ialah amaran serius yang mesti dijaga.",
      "Perbezaan ini sangat penting dalam cara kita menggunakan topik ini. Tanda-tanda dalam perbuatan diberikan sebagai cermin untuk diri sendiri, bukan sebagai label untuk dilekatkan pada orang lain. Nabi ﷺ dan para sahabat baginda sendiri takut akan nifak dalam diri mereka, justeru kerana hati itu tersembunyi dan boleh berubah.",
      "Maka tindak balas yang sihat ialah melihat ke dalam diri: memeriksa kejujuran diri sendiri, kesetiaan menunaikan janji, dan sifat amanah, serta memohon keikhlasan (ikhlas) kepada Allah. Hanya Allah yang mengetahui apa yang ada di dalam diri seseorang, dan menuduh individu tertentu sebagai munafik itu sendiri ialah satu kesalahan yang berat terhadap mereka.",
    ],
    disclaimer:
      "Jangan menuduh individu tertentu dengan nifak. Nas-nas ini memberi amaran kepada umat; penyucian bermula dengan diri sendiri.",
  },
  {
    title: "Azab yang Disebut",
    summary:
      "Apa yang digambarkan oleh nas — bacalah dengan rasa takut kepada Allah dan harapan kepada rahmat-Nya.",
    body: [
      "Al-Quran dan Sunnah memang menyebut akibat khusus bagi kesalahan-kesalahan tertentu — bagi mereka yang memakan riba, yang memfitnah wanita-wanita yang menjaga kehormatan, yang menimbun harta dan menahan haknya, yang mengabaikan solat, dan yang berterusan dalam dosa besar. Perincian ini ialah satu bentuk kejelasan: ia tidak meninggalkan ruang bagi sesiapa untuk berkata bahawa dia tidak diberi amaran tentang perkara yang sedang dilakukannya.",
      "Sebahagian akibat ini digambarkan berlaku di alam kubur (azab kubur) dan sebahagian lagi di dalam Jahannam itu sendiri. Akidah arus perdana Ahli Sunnah menetapkan hakikat kedua-duanya, sambil menyerahkan 'bagaimana' sebenar perkara-perkara ghaib ini kepada ilmu Allah, bukan kepada khayalan manusia.",
      "Cara seorang mukmin berinteraksi dengan semua ini ialah perkara yang penting. Tujuannya bukan sekali-kali untuk berlarutan memikirkan perincian yang mengerikan atau membiarkan hati tenggelam; tetapi untuk menerima amaran itu, bertaubat daripada apa sahaja yang berkaitan, kemudian menyalurkan tenaga kepada amalan yang benar-benar melindungi. Sebab itulah modul ini sengaja memberikan lebih banyak ruang kepada perlindungan, taubat, dan rahmat berbanding azab.",
      "Ringkasnya, pengajaran yang betul daripada mana-mana azab yang disebut ialah satu soalan, bukan ketakutan: 'Adakah aku melakukan perkara ini — dan jika ya, bagaimanakah aku berhenti dan memperbetulkannya?' Jika dijawab dengan jujur hari ini, amaran itu telah pun menunaikan tugasnya yang penuh rahmat.",
    ],
    appLinks: [{ label: "Perlindungan daripada Neraka" }, { label: "Harapan kepada rahmat" }],
  },
  {
    title: "Perlindungan daripada Neraka",
    summary: "Tauhid, solat, taubat, sedekah, al-Quran, dan doa — teras modul ini.",
    body: [
      "Selepas semua amaran, inilah inti persoalannya: Jahannam ialah sesuatu yang seseorang patut dilindungi daripadanya, dan Islam penuh dengan cara-cara perlindungan itu. Yang paling utama ialah tauhid yang sahih — menyembah Allah semata-mata, tanpa sesuatu pun di samping-Nya. Setiap amalan lain hanya diterima dan ditimbang di atas asas ini, sebab itulah menjaga akidah didahulukan daripada segala-galanya.",
      "Di atas asas itu, perisai-perisai praktikal amat banyak dan mudah dicapai: mendirikan solat lima waktu, taubat yang ikhlas, bersedekah — yang menurut sabda Nabi ﷺ memadamkan dosa sebagaimana air memadamkan api — berpuasa, membaca al-Quran dan mengamalkannya, akhlak yang baik, berbelas kasihan kepada orang lain, zikir yang berterusan, dan sentiasa memohon keampunan. Tiada satu pun daripadanya memerlukan kekayaan atau ilmu yang banyak; semuanya terbuka kepada semua orang.",
      "Nabi ﷺ juga mengajarkan doa-doa khusus untuk memohon perlindungan daripada Neraka, dan menggalakkan kita supaya kerap memohonnya. Baginda bersabda bahawa sesiapa yang memohon Syurga kepada Allah sebanyak tiga kali, Syurga sendiri berdoa supaya dia dimasukkan ke dalamnya, dan sesiapa yang memohon perlindungan daripada Neraka sebanyak tiga kali, Neraka sendiri berdoa supaya dia diselamatkan daripadanya (Jami' at-Tirmidhi 2572). Doa-doa ini mempunyai tempat yang istimewa sebelum salam dalam solat dan dalam zikir pagi dan petang.",
      "Perhatikan keseimbangan yang ditetapkan oleh syariat. Cara-cara perlindungan lebih banyak, lebih ditekankan, dan lebih mudah dicapai berbanding sebab-sebab kebinasaan — dan ini sendiri ialah tanda rahmat Allah. Untuk selamat jauh lebih mudah daripada untuk binasa.",
      "Bahagian ini sengaja dijadikan bahagian terbesar dalam modul ini, kerana begitulah Islam sendiri menimbang perkara ini: amaran sentiasa digandingkan dengan harapan, dan tidak pernah dipisahkan daripada amalan nyata yang boleh dimulakan seseorang hari ini.",
    ],
    actions: [
      "Hafalkan doa memohon perlindungan daripada Jahannam sebelum salam dalam solat.",
      "Dirikan solat lima waktu pada waktunya — antara perisai yang paling kuat.",
      "Bersedekahlah secara berterusan, walaupun sedikit.",
    ],
    appLinks: [
      { label: "Doa-doa perlindungan" },
      { label: "Perjalanan ke Jannah" },
      { label: "Zikir pagi & petang" },
      { label: "Belajar Doa" },
    ],
  },
  {
    title: "Taubat",
    summary: "Allah menerima taubat yang ikhlas — tiada dosa yang terlalu besar sebelum kematian.",
    body: [
      "Taubat ialah jalan yang Allah binakan dalam agama ini supaya tiada dosa yang semestinya kekal. Pada terasnya, ia ialah kembalinya hati kepada Allah, dan ulama mengambil syarat-syaratnya daripada al-Quran dan Sunnah: berhenti daripada dosa itu dengan ikhlas, benar-benar menyesalinya, dan berazam dengan teguh untuk tidak kembali kepadanya. Apabila dosa itu melibatkan hak orang lain, syarat keempat ditambah — memulangkan hak itu atau memohon kemaafannya.",
      "Apa yang menjadikan taubat begitu penuh harapan ialah cara Allah menerimanya. Dia bukan sekadar membiarkan hamba yang kembali; Dia bergembira. Nabi ﷺ bersabda bahawa Allah lebih gembira dengan taubat hamba-Nya berbanding seorang lelaki yang kehilangan tunggangannya bersama seluruh bekalannya di padang pasir yang tandus, lalu berputus asa, kemudian tiba-tiba mendapati tunggangan itu berdiri di hadapannya (Sahih al-Bukhari 6309). Itulah sambutan yang menanti sesiapa sahaja yang kembali.",
      "Tambahan pula, pintu-Nya tidak pernah tertutup sepanjang hayat. Nabi ﷺ bersabda bahawa Allah menghulurkan tangan-Nya pada waktu malam untuk menerima taubat orang yang berdosa pada waktu siang, dan menghulurkan tangan-Nya pada waktu siang untuk menerima taubat orang yang berdosa pada waktu malam (Sahih Muslim 2759). Taubat diterima bagi seseorang sehingga nyawa sampai ke kerongkong ketika mati, dan bagi umat manusia sehingga matahari terbit dari barat — maka tiada sebab untuk menangguhkannya.",
      "Ini benar walaupun bagi orang yang telah jatuh dan bertaubat berkali-kali. Selagi setiap kali kembali itu ikhlas, Allah terus menerimanya; putus asa datang daripada syaitan, bukan daripada agama. Satu perkara yang mesti diselesaikan sebelum mati ialah syirik, kerana orang yang mati dalam keadaan syirik mati tanpa iman yang menjadi syarat taubat — sebab itulah kembali sepenuhnya kepada Allah Yang Esa ialah taubat yang paling mendesak.",
      "Pengajaran praktikalnya mudah: bertaubatlah sekarang, bertaubatlah selalu, dan jangan sekali-kali biarkan besarnya sesuatu dosa, atau banyaknya kejatuhan yang lalu, menghalang anda daripada kembali. Jemputan itu sentiasa terbuka.",
    ],
    actions: [
      "Ucapkan Astaghfirullah sepanjang hari — utamakan istiqamah, bukan hanya selepas kesilapan besar.",
      "Pelajari Sayyidul Istighfar dan bacalah pada waktu pagi dan petang.",
    ],
    appLinks: [
      { label: "Zikir harian & istighfar" },
      { label: "Belajar Doa — keampunan" },
      { label: "Harapan kepada rahmat Allah" },
      { label: "Perjalanan Saya" },
    ],
  },
  {
    title: "Harapan kepada Rahmat Allah",
    summary: "Jangan sekali-kali berputus asa — kebaikan menghapuskan dosa; istiqamah itu penting.",
    body: [
      "Segala-galanya dalam modul ini menuju ke sini. Allah ialah ar-Rahman ar-Rahim — Yang Maha Pemurah lagi Maha Mengasihani — dan Dia telah memberitahu kita bahawa rahmat-Nya mengatasi kemurkaan-Nya dan 'meliputi tiap-tiap sesuatu' (7:156). Seorang mukmin sepatutnya hidup di antara harap dan takut, seperti dua sayap seekor burung: cukup takut akan dosa untuk terus berwaspada, cukup berharap kepada keampunan untuk tidak pernah berputus asa.",
      "Oleh sebab itu, putus asa itu sendiri tidak kena pada tempatnya. Sejauh mana pun seseorang merasakan dirinya telah tersasar, pintu untuk kembali tetap terbuka, dan syaitanlah — bukan Allah — yang membisikkan bahawa sudah terlambat. Berputus asa daripada rahmat bermakna memandang rendah Tuhan Yang Maha Mengasihani; tugas hati yang ikhlas hanyalah kembali.",
      "Di sinilah terletak ketenangan besar dalam akidah Ahli Sunnah tentang Neraka. Bagi mereka yang mati dalam kekufuran, Jahannam ialah tempat tinggal yang kekal. Tetapi seorang mukmin yang mati dalam keadaan mengesakan Allah, walaupun dibebani dosa-dosa besar, tidak akan kekal di dalamnya selama-lamanya. Nabi ﷺ mengajarkan bahawa manusia akan dikeluarkan daripada Neraka melalui syafaat dan kemudian melalui rahmat Allah sendiri — dicampakkan ke dalam Sungai Kehidupan di pinggir Syurga, lalu mereka dipulihkan dan memasukinya (Sahih al-Bukhari 7439). Baginda bersabda bahawa tidak akan kekal di dalam Neraka sesiapa yang di dalam hatinya ada iman walau seberat biji sawi (Sahih Muslim 183). Oleh itu, bagi orang yang bertauhid, Neraka — jika dimasuki sekalipun — tidak pernah menjadi pengakhiran ceritanya.",
      "Sementara itu, rahmat tersemai dalam kehidupan seharian: amal kebaikan menghapuskan kejahatan (11:114), dan ibadat yang kecil tetapi berterusan — satu solat yang ditunaikan pada waktunya, satu sedekah yang diberi secara senyap, satu saat kesabaran kerana Allah — sedikit demi sedikit mendekatkan seseorang kepada-Nya dan menjauhkannya daripada bahaya. Istiqamah lebih penting daripada kehebatan.",
      "Maka jadikanlah ini kesimpulan pembelajaran anda: ambil amaran itu dengan serius, tetapi biarlah harapan lebih kuat daripada ketakutan. Kenali bahayanya, pilih jalan rahmat, dan tempuhilah — selangkah demi selangkah — setiap hari sehingga anda bertemu Allah.",
    ],
    actions: [
      "Akhiri setiap hari dengan istighfar dan rasa syukur atas setiap nikmat.",
      "Gandingkan modul ini dengan Perjalanan ke Jannah — amaran dan harapan seiring.",
    ],
    appLinks: [
      { label: "Perjalanan ke Jannah" },
      { label: "Akidah — harapan & taubat" },
      { label: "Perjalanan Saya" },
    ],
  },
  {
    title: "Dosa-Dosa yang Membinasakan",
    summary:
      "Tujuh mūbiqāt, rangkaian 'dosa paling besar', dan dosa-dosa yang menghabiskan amal kebaikan.",
    body: [
      "Al-Quran dan Sunnah jarang menyatakan 'dosa ini paling berat di atas Neraca.' Kedua-duanya memberi amaran dengan bahasa lain: dosa besar yang paling berat, dosa-dosa yang membinasakan (al-mūbiqāt), 'dosa manakah yang paling besar?', laknat, dan ancaman yang keras. Itu ialah hierarki amaran — bukan carta kedudukan di atas Mizan. Memahaminya membantu anda menyusun keutamaan taubat tanpa berputus asa.",
      "Nabi ﷺ bersabda, 'Avoid the seven destructive sins' (maksud dalam bahasa Inggeris). Apabila ditanya apakah dosa-dosa itu, baginda menyenaraikan: mempersekutukan Allah, sihir, membunuh jiwa yang diharamkan oleh Allah kecuali dengan hak, memakan riba, memakan harta anak yatim, lari dari medan perang, dan menuduh wanita-wanita mukminah yang menjaga kehormatan berzina (Sahih al-Bukhari 2766; Sahih Muslim 89). Dosa besar tidak terhad kepada tujuh ini; tujuh ini disebut secara khusus kerana kebinasaannya yang amat dahsyat.",
      "Apabila seorang lelaki bertanya dosa manakah yang paling besar, Nabi ﷺ menjawab mengikut urutan: menjadikan sekutu bagi Allah sedangkan Dia yang menciptakan kamu; membunuh anak kamu kerana takut dia akan makan bersama kamu; kemudian berzina dengan isteri jiran kamu (Sahih Muslim 86; Sahih al-Bukhari 4761). Urutan ini mengajarkan tahap keberatannya — ia tidak bermakna kabā'ir yang lain itu ringan.",
      "Sesetengah dosa bukan sahaja menambah beban terhadap anda — ia memindahkan amal kebaikan anda kepada orang yang anda zalimi. Orang muflis dalam kalangan umat ini datang dengan solat, puasa, dan sedekah, tetapi dia pernah mencaci, memfitnah, mengambil harta, dan menumpahkan darah — maka amal kebaikannya diberikan kepada orang lain, dan apabila ia habis, dosa-dosa orang lain dipikulkan ke atasnya (Sahih Muslim 2581). Ibadat tidak membatalkan kezaliman; yang membatalkannya ialah menyelesaikan hak-hak.",
      "Di samping setiap amaran ada harapan. Allah berfirman: 'Wahai hamba-hambaKu yang telah melampaui batas terhadap diri mereka sendiri (dengan perbuatan-perbuatan maksiat), janganlah kamu berputus asa dari rahmat Allah, kerana sesungguhnya Allah mengampunkan segala dosa' (Qur'an 39:53). Mati dalam keadaan syirik tanpa bertaubat ialah pengecualian yang dijelaskan oleh nas (Qur'an 4:48); setiap pintu taubat yang lain tetap terbuka sehingga mati.",
    ],
    destructiveItems: [
      {
        title: "Syirik — mempersekutukan Allah",
        summary: "Yang pertama daripada tujuh dosa yang membinasakan dan dosa yang paling berat.",
      },
      {
        title: "Sihir",
        summary: "Mengamalkan sihir — termasuk dalam tujuh mūbiqāt.",
      },
      {
        title: "Membunuh jiwa tanpa hak",
        summary: "Meragut nyawa yang diharamkan oleh Allah kecuali dengan sebab yang adil.",
      },
      {
        title: "Memakan riba",
        summary: "Riba dan faedah — diisytiharkan sebagai dosa yang membinasakan.",
      },
      {
        title: "Memakan harta anak yatim",
        summary: "Membolot harta anak yatim secara zalim.",
      },
      {
        title: "Lari dari medan perang",
        summary: "Berpaling lari ketika tentera mara — salah satu daripada tujuh.",
      },
      {
        title: "Menuduh wanita mukminah yang menjaga kehormatan",
        summary:
          "Menuduh wanita-wanita mukminah yang menjaga kehormatan dan tidak tahu-menahu berzina.",
      },
      {
        title: "Orang yang muflis",
        summary:
          "Solat, puasa, dan sedekah boleh diambil untuk menyelesaikan hak orang yang anda zalimi.",
      },
    ],
    actions: [
      "Teliti tujuh dosa yang membinasakan dan bertaubatlah daripada mana-mana yang pernah anda hampiri.",
      "Selesaikan hak-hak manusia — hutang, harta, dan maruah — sebelum Hari Perhitungan.",
      "Gandingkan amaran dengan harapan: bacalah Qur'an 39:53 dan perbaharui taubat setiap hari.",
    ],
    appLinks: [
      { label: "Gambaran keseluruhan dosa-dosa besar" },
      { label: "Dosa terhadap orang lain" },
      { label: "Hisab (Hari Akhirat)" },
      { label: "Taubat" },
    ],
  },
];

export const JAHANNAM_MAJOR_SIN_TOPICS_MS: DeepPartial<JahannamTopic>[] = [
  {
    title: "Syirik",
    summary:
      "Mempersekutukan Allah — satu-satunya dosa yang tidak diampunkan jika seseorang mati dalam keadaan itu.",
    body: [
      "Takrif: Syirik ialah menjadikan sekutu bagi Allah — mengarahkan apa-apa perbuatan yang hanya layak bagi-Nya (ibadat, cinta yang tertinggi, takut, harap, tawakal, atau hak menetapkan hukum) kepada sesuatu atau seseorang selain-Nya. Ia ialah lawan yang tepat bagi tauhid, dan ia menyerang tujuan asal penciptaan makhluk: menyembah Allah semata-mata.",
      "Mengapa ia dosa yang paling berat: setiap dosa lain ialah kesalahan yang dilakukan sambil mengakui Tuhan yang sebenar, tetapi syirik ialah kesalahan yang dilakukan secara langsung terhadap-Nya — menyangka makhluk sebagai Pencipta. Inilah sebabnya al-Quran menyebutnya 'satu kezaliman yang besar' (31:13). Ia satu-satunya dosa yang, jika seseorang mati dalam keadaan itu tanpa bertaubat, tidak diampunkan: 'Sesungguhnya Allah tidak akan mengampunkan dosa syirik mempersekutukanNya (dengan sesuatu apajua), dan akan mengampunkan dosa yang lain dari itu bagi sesiapa yang dikehendakiNya' (4:48). Rahmat yang tersembunyi walaupun dalam ketegasan ini ialah segala dosa selain syirik tetap berada di bawah keampunan Allah.",
      "Bentuk-bentuknya: ulama membezakan syirik besar — menyembah berhala, orang mati, wali, atau makhluk; menyeru selain Allah untuk perkara yang hanya Dia mampu berikan; dan mengarahkan korban atau nazar kepada selain-Nya — yang mengeluarkan seseorang daripada Islam jika tidak ditaubati. Ada juga syirik kecil dan syirik tersembunyi, seperti menunjuk-nunjuk dalam ibadat (riya'), bersumpah dengan selain Allah, atau bergantung kepada petanda dan tangkal, yang merupakan dosa yang serius tetapi tidak dengan sendirinya mengeluarkan seseorang daripada agama.",
      "Jalan untuk menjauhinya: jaga dan kukuhkan tauhid dengan mempelajarinya, menyembah Allah semata-mata, dan menyucikan niat supaya amalan dilakukan kerana-Nya dan bukan untuk dilihat manusia. Sesiapa yang telah terjerumus ke dalam syirik bertaubat dengan meninggalkannya secara ikhlas dan kembali menyembah Allah semata-mata — dan pintu untuk kembali itu tetap terbuka selagi seseorang masih hidup.",
    ],
    actions: [
      "Pelajari tauhid melalui Belajar Akidah dan 99 Nama Allah.",
      "Ikhlaskan niat dalam ibadat — mohonlah keikhlasan kepada Allah setiap hari.",
    ],
    appLinks: [{ label: "Akidah — penjelasan syirik" }, { label: "Taubat" }],
  },
  {
    title: "Membunuh",
    summary:
      "Meragut nyawa yang tidak bersalah secara haram — antara pencabulan yang paling berat.",
    body: [
      "Takrif: Membunuh di sini bermaksud meragut dengan sengaja dan secara haram nyawa yang telah Allah jadikan suci. Islam memang mengiktiraf keadaan yang dibenarkan — seperti qisas (pembalasan setimpal mengikut undang-undang) yang dilaksanakan oleh pihak berkuasa yang sah — tetapi membunuh jiwa yang tidak bersalah tanpa sebab yang adil ialah antara jenayah yang paling berat.",
      "Mengapa ia begitu berat: al-Quran menimbang satu pembunuhan yang zalim dengan neraca seluruh manusia: 'sesiapa yang membunuh seorang manusia … maka seolah-olah dia telah membunuh manusia semuanya' (5:32), kerana memusnahkan satu nyawa bermakna mencabuli kesucian yang melindungi setiap nyawa. Pembunuhan ialah dosa pertama yang dilakukan dalam kalangan anak-anak Adam, dan wahyu berulang kali kembali menyebutnya sebagai pemusnah akhirat seseorang.",
      "Kesalahan berganda: membunuh ialah dosa terhadap Allah, yang hak-Nya atas kesucian nyawa telah dicabuli, dan pada masa yang sama dosa terhadap manusia — mangsa dan mereka yang ditinggalkannya. Inilah sebabnya taubatnya lebih berat daripada kebanyakan dosa: kembali kepada Allah adalah wajib, tetapi hak orang yang dizalimi juga tetap ada, dan apabila undang-undang negara atau syariat Islam menetapkan diat (pampasan darah) atau akibat lain, semua itu mesti ditunaikan melalui saluran yang betul dan ulama yang berkelayakan.",
      "Jalan untuk menjauhinya: anggaplah setiap nyawa suci, redakan kemarahan dan permusuhan sebelum ia menjadi keras, dan selesaikan pertikaian dengan kesabaran dan keadilan, bukan dengan kekerasan. Malah jenayah terbesar terhadap manusia ini pun tidak terkeluar daripada rahmat Allah bagi orang yang bertaubat dengan ikhlas, menunaikan hak-hak yang berkaitan sedaya mungkin, dan tidak lagi kembali ke jalan itu.",
    ],
    actions: ["Hargai setiap nyawa; selesaikan pertikaian dengan kesabaran dan keadilan."],
    appLinks: [{ label: "Dosa terhadap orang lain" }],
  },
  {
    title: "Zina",
    summary: "Hubungan seksual yang haram — dosa yang membinasakan jiwa dan masyarakat.",
    body: [
      "Takrif: Zina ialah apa-apa hubungan seksual yang haram di luar perkahwinan yang sah, merangkumi hubungan antara orang yang belum berkahwin dan juga yang melibatkan orang yang telah berkahwin. Islam tidak menganggapnya sebagai urusan peribadi semata-mata, tetapi sebagai pencabulan yang membawa kemudaratan yang luas.",
      "Mengapa ia berat: zina menghakis asas-asas yang menjadi binaan masyarakat yang sihat — nasab keturunan, kepercayaan antara suami isteri, keselamatan anak-anak, dan kesucian diri yang memuliakan seseorang. Lafaz al-Quran sendiri memberi pengajaran: ia bukan sekadar melarang perbuatan itu tetapi berfirman 'janganlah kamu menghampiri zina' (17:32), memberi amaran terhadap pandangan, pertemuan berdua-duaan, dan langkah-langkah yang membawa kepadanya. Larangan menghampiri itu ialah satu rahmat, kerana ia melindungi seseorang sebelum godaan menjadi terlalu kuat.",
      "Hikmah di sebalik batas-batas: daripada membiarkan manusia melawan nafsu ketika ia di puncaknya, Islam mengelilingi mereka dengan perlindungan yang lebih awal — menundukkan pandangan, sopan dalam berpakaian dan berkelakuan, mengelakkan berdua-duaan dengan bukan mahram, dan menggalakkan perkahwinan sebagai saluran yang halal dan mulia bagi keperluan ini. Membina batas-batas ini lebih awal jauh lebih mudah daripada melawan ketika sudah di tepi jurang.",
      "Jalan untuk kembali: bagi sesiapa yang telah terjatuh, jalan keluarnya ialah taubat yang ikhlas — meninggalkan dosa itu sepenuhnya, menyesalinya, berazam untuk tidak kembali, dan menutup aib masa lalu diri sendiri, bukan menghebahkannya. Zina ialah dosa besar, tetapi ia jelas termasuk dalam dosa-dosa yang Allah ampunkan bagi orang yang kembali kepada-Nya; putus asa tiada tempatnya, dan permulaan baharu sentiasa terbuka.",
    ],
    actions: [
      "Jaga pandangan mata dan penggunaan media sosial.",
      "Berdoalah untuk mendapat pasangan yang soleh jika belum berkahwin.",
    ],
    appLinks: [{ label: "Taubat" }],
  },
  {
    title: "Riba",
    summary: "Faedah dan riba — al-Quran mengisytiharkan perang terhadap pengamalnya.",
    body: [
      "Takrif: Riba ialah tambahan yang haram dalam urusan kewangan tertentu — yang paling biasa ialah faedah yang dikenakan atau dibayar atas pinjaman, tetapi ia juga merangkumi pertukaran tertentu yang tidak sama nilai atau bertangguh bagi barangan yang sejenis. Hakikatnya ialah memperoleh kekayaan tanpa nilai atau risiko yang sebenar, dengan menanggungkan kerugian kepada orang lain.",
      "Mengapa ia sangat berat: riba unik antara dosa-dosa kewangan kerana bahasa yang digunakan oleh al-Quran terhadapnya. Allah mengisytiharkan perang daripada-Nya dan Rasul-Nya ﷺ ke atas mereka yang terus mengamalkannya (2:279) — ungkapan yang tidak digunakan bagi dosa lain — kerana riba mengeksploitasi keperluan orang, menumpukan kekayaan di tangan segelintir orang, dan mengikis belas kasihan yang sepatutnya ada dalam sesebuah ekonomi. Nabi ﷺ memberi amaran keras terhadap terlibat dengannya dalam apa jua peranan.",
      "Hikmah dan rahmatnya: larangan ini mengalihkan manusia kepada perdagangan yang sebenar, perkongsian risiko, dan sedekah, serta melindungi golongan yang lemah daripada dihimpit hutang. Namun, di sini pun rahmat Allah tetap ada: apabila perintah itu turun, Dia tidak menuntut supaya faedah yang telah diambil dahulu dirampas kembali, tetapi hanya menyuruh orang beriman meninggalkan baki riba — 'hak kamu (yang sebenarnya) ialah pokok asal harta kamu' (2:279) — satu kemudahan bagi mereka yang berpaling daripadanya.",
      "Jalan untuk menjauhinya: semak kewangan anda untuk mengenal pasti produk berasaskan faedah, cari alternatif yang halal, dan rujuk ulama yang berkelayakan untuk kes-kes yang benar-benar sukar seperti pinjaman perumahan di negara bukan Islam. Meninggalkan riba mungkin memerlukan keputusan kewangan yang sukar, tetapi keselamatan jiwa lebih berat daripada apa-apa keuntungan sementara — dan Allah berjanji memberi rezeki kepada orang yang bertakwa kepada-Nya dari arah yang tidak disangka-sangka.",
    ],
    actions: [
      "Semak kewangan anda untuk mengenal pasti produk berasaskan faedah.",
      "Rujuk ulama yang berkelayakan tentang pinjaman perumahan dan hutang.",
    ],
    appLinks: [{ label: "Panduan zakat" }],
  },
  {
    title: "Kesaksian Palsu",
    summary: "Berdusta ketika bersumpah atau memberi kesaksian palsu — memusnahkan keadilan.",
    body: [
      "Takrif: Kesaksian palsu (syahadat al-zur) ialah memberi kesaksian atas sesuatu yang tidak benar — dan secara lebih luas, berdusta ketika bersumpah, mereka-reka tuduhan, atau menyembunyikan kesaksian yang benar apabila keadilan bergantung kepadanya.",
      "Mengapa ia berat: ia merosakkan alat yang digunakan untuk menegakkan keadilan. Seorang saksi palsu boleh menghancurkan orang yang tidak bersalah, merampas harta daripada pemiliknya yang sah, atau membebaskan orang yang zalim — maka dusta itu tidak pernah terhad kepada si pendusta; ia melukai manusia sebenar dan seluruh sistem keadilan. Nabi ﷺ menggolongkannya antara dosa besar yang paling besar, dan dalam satu riwayat baginda begitu bersungguh-sungguh mengulang amaran terhadapnya sehingga para sahabat berharap baginda berhenti, kerana bimbang akan keadaan baginda.",
      "Kaitannya dengan lidah: kesaksian palsu ialah hujung paling tajam bagi dosa-dosa percakapan yang lebih luas. Oleh kerana kata-kata mudah diucapkan, dosa ini amat mudah dilakukan — satu tandatangan, satu keterlaluan, satu diam yang memudahkan — namun bebannya amat besar pada Hari Kiamat, ketika anggota dan lidah manusia sendiri akan memberi kesaksian yang benar terhadap mereka.",
      "Jalan untuk menjauhinya: berpegang teguh pada kebenaran walaupun ia mahal harganya atau bertentangan dengan kepentingan diri sendiri, enggan meminjamkan kata-kata kepada apa-apa kebatilan, dan tampil memberi kesaksian yang adil apabila diperlukan. Sesiapa yang pernah memberi kesaksian palsu bertaubat dengan menarik balik dustanya jika boleh, berusaha menghapuskan kemudaratan dan memulihkan hak orang yang dizalimi, serta kembali kepada Allah dengan penyesalan yang ikhlas.",
    ],
    appLinks: [{ label: "Dosa-dosa lidah" }],
  },
  {
    title: "Sihir",
    summary:
      "Sihir, mendapatkan ahli sihir, dan amalan ilmu ghaib — kufur dalam bentuknya yang besar.",
    body: [
      "Takrif: Sihir ialah penggunaan cara-cara yang diharamkan — sering melibatkan pergantungan kepada syaitan atau dakwaan mempunyai kuasa atas perkara ghaib — untuk mempengaruhi manusia atau peristiwa. Mengamalkannya, mempelajarinya, mendapatkannya daripada orang lain, dan mempercayai mereka yang mendakwanya semuanya termasuk dalam dosa ini.",
      "Mengapa ia begitu berat: kebanyakan sihir tidak dapat dilakukan tanpa perbuatan kufur, seperti mendekatkan diri kepada syaitan atau menghina al-Quran, sebab itulah al-Quran mengaitkan ilmunya dengan kekufuran. Ketika menyebut tentang sihir yang dipelajari pada zaman Nabi Sulaiman, Allah berfirman bahawa syaitan-syaitan dan dua malaikat itu mengajarkannya hanya sebagai ujian, sambil memberi amaran 'janganlah engkau menjadi kafir' (2:102). Selain bahaya terhadap akidah, sihir memudaratkan manusia sebenar — menimbulkan perpecahan antara suami isteri, menyebarkan ketakutan, dan mengeksploitasi orang yang terdesak.",
      "Amalan yang berkaitan: amaran yang sama meliputi tilikan nasib, menganggap astrologi sebagai ilmu yang pasti tentang perkara ghaib, dan azimat serta tangkal yang mengandungi syirik. Mendakwa mengetahui masa depan yang ghaib hanyalah milik Allah semata-mata, dan pergi kepada orang yang mendakwanya meruntuhkan tauhid dari akarnya.",
      "Jalan untuk menjauhinya: bagi orang yang terlibat dalam amalan-amalan ini, taubat bermakna meninggalkannya sepenuhnya, memusnahkan apa-apa barang yang haram, memutuskan hubungan dengan mereka yang terlibat dengannya, dan memperbaharui tauhid yang ikhlas serta bertawakal kepada Allah semata-mata. Perlindungan terdapat dalam iman, dalam zikir harian, dan dalam memohon perlindungan kepada Allah — dan keampunan-Nya terbuka bagi sesiapa yang benar-benar kembali.",
    ],
    appLinks: [{ label: "Akidah — tauhid" }],
  },
  {
    title: "Memakan Harta Anak Yatim",
    summary: "Mengambil atau mensia-siakan harta anak yatim secara zalim.",
    body: [
      "Takrif: Dosa ini ialah mengambil, mensia-siakan, atau menyalahgunakan harta anak yatim — kanak-kanak yang telah kehilangan bapa dan tidak mampu menjaga kepentingan mereka sendiri. Seorang penjaga memegang harta mereka sebagai amanah, bukan sekali-kali sebagai pemilik.",
      "Mengapa ia berat: ia menghimpunkan dua kesalahan — mengkhianati amanah yang suci dan menzalimi golongan yang paling tidak berdaya. Gambaran al-Quran amat keras: mereka yang memakan harta anak yatim secara zalim 'hanyalah menelan api ke dalam perut mereka' (4:10), menjadikan detik ketamakan sebagai azab yang ditimpakan ke atas diri sendiri. Mengeksploitasi orang yang tiada pembela ialah antara bentuk kezaliman yang paling buruk, sebab itulah amarannya begitu tajam — dan kerana tajamnya, ia begitu penuh rahmat dalam memalingkan para penjaga daripadanya.",
      "Apa yang termasuk di dalamnya: bukan sahaja kecurian secara terang-terangan, tetapi juga bentuk-bentuk yang lebih halus — mencampurkan harta anak yatim dengan harta sendiri sehingga sempadannya kabur, melewatkan pemulangannya apabila anak yatim itu telah dewasa, atau melaburkan atau membelanjakannya tanpa hak. Allah memerintahkan sebaliknya: 'berikanlah kepada anak-anak yatim (yang telah baligh) itu harta mereka, dan janganlah kamu tukar-gantikan yang baik dengan yang buruk' (4:2).",
      "Jalan untuk menjauhinya: jagalah harta anak yatim dengan teliti, asingkan dan catat perakaunannya, serahkan sepenuhnya apabila mereka dewasa, dan — bagi orang yang telah cuai — bertaubatlah dengan memulangkan apa yang terhutang berserta apa-apa pertambahan yang sepatutnya dan memohon kemaafan mereka yang dizalimi. Pada Hari yang tiada harta atau keturunan dapat membantu kecuali hati yang sejahtera, memulihkan amanah seperti ini sendiri ialah amalan yang sangat berharga.",
    ],
    appLinks: [{ label: "Dosa terhadap orang lain" }],
  },
  {
    title: "Derhaka kepada Ibu Bapa",
    summary: "'Uquq — antara dosa besar selepas syirik.",
    body: [
      "Takrif: 'Uquq al-walidain ialah derhaka dan menganiaya ibu bapa secara berat — menyakiti mereka, memandang hina kepada mereka, mengabaikan mereka ketika memerlukan, atau melukai mereka dengan kata-kata atau perbuatan. Ia ialah lawan bagi birr al-walidain, iaitu berbakti dan berbuat baik yang diperintahkan oleh Islam.",
      "Mengapa ia begitu berat: dalam ayat demi ayat, Allah menggandingkan perintah menyembah-Nya dengan perintah berbuat baik kepada ibu bapa, seperti dalam 'hendaklah kamu beribadat kepada Allah … dan hendaklah kamu berbuat baik kepada kedua ibu bapa' (4:36) — meletakkan hak mereka sejurus selepas hak-Nya sendiri. Ibu bapa, selepas Allah, ialah punca terdekat bagi kewujudan dan didikan seseorang, maka tidak bersyukur kepada mereka ialah satu bentuk tidak bersyukur yang amat mendalam. Nabi ﷺ menyenaraikan perbuatan menganiaya mereka antara dosa besar yang paling besar, kedua selepas syirik.",
      "Satu keseimbangan yang penting: berbakti tidak bermakna mentaati ibu bapa dalam perkara maksiat kepada Allah — tiada makhluk yang ditaati dalam maksiat kepada Pencipta. Namun, walaupun seseorang terpaksa menolak, ia dilakukan dengan lemah lembut, hormat, dan terus berbuat baik. Al-Quran melarang walaupun perkataan rungutan yang paling kecil: 'janganlah engkau berkata kepada mereka (sebarang perkataan kasar) sekalipun perkataan \"Ha\"' (17:23).",
      "Jalan untuk kembali: rahmatnya di sini ialah ibu bapa biasanya masih dapat didekati. Bagi orang yang telah cuai, taubatnya sebahagian besarnya bersifat praktikal — kembali berbuat baik, memohon kemaafan mereka, berkhidmat kepada mereka, dan mendoakan mereka, terutamanya selagi mereka masih hidup. Dan jika ibu atau bapa telah meninggal dunia, bakti diteruskan dengan mendoakan mereka, bersedekah bagi pihak mereka, dan memuliakan kaum kerabat serta sahabat-sahabat mereka.",
    ],
    actions: ["Hubungi atau ziarahi ibu bapa minggu ini dengan kata-kata yang baik."],
    appLinks: [{ label: "Dosa terhadap orang lain" }],
  },
  {
    title: "Mencuri",
    summary: "Mengambil harta orang lain secara haram — mencabuli amanah dan mengundang hukuman.",
    body: [
      "Takrif: Mencuri (sariqah) ialah mengambil harta atau milik orang lain tanpa hak — sama ada secara senyap, pecah amanah, penipuan, atau apa-apa cara merampas secara tersembunyi sesuatu yang bukan haknya.",
      "Mengapa ia berat: ia mencabuli hak manusia dan juga kepercayaan yang menjadi asas kehidupan bermasyarakat. Keseriusannya ditegaskan oleh hukuman yang ditetapkan yang disebut oleh al-Quran bagi kes-kes yang memenuhi syarat (5:38) — hukuman yang dikawal oleh syarat-syarat yang ketat dan piawaian pembuktian yang tinggi, sehingga ketegasannya itu sendiri terutamanya berfungsi sebagai pencegah yang kuat yang memastikan harta manusia terpelihara. Matlamat Islam ialah masyarakat yang padanya manusia berasa selamat dengan harta milik mereka.",
      "Wajahnya pada zaman moden: mencuri tidak terhad kepada memecah masuk rumah. Ia termasuk mengambil daripada majikan, menipu dalam perniagaan, menahan upah pekerja, cetak rompak digital, plagiat, dan mengambil manfaat daripada sesuatu yang bukan milik sendiri secara halal. Apa yang tersembunyi daripada manusia tidak pernah tersembunyi daripada Allah, yang melihat setiap pengambilan secara diam-diam.",
      "Jalan untuk kembali: oleh kerana ia melibatkan hak manusia, taubat memerlukan lebih daripada penyesalan di hadapan Allah. Seseorang mesti memulangkan barang yang dicuri itu sendiri, atau nilainya, kepada pemiliknya yang sah, dan memohon kemaafannya jika boleh; jika pemiliknya tidak dapat ditemui, ulama menasihatkan supaya jumlah itu disedekahkan bagi pihaknya. Apabila diselesaikan dengan cara ini, dosa mencuri pun diampunkan sepenuhnya oleh Tuhan yang mengasihi hamba yang kembali kepada-Nya.",
    ],
    actions: [
      "Pulangkan barang yang dicuri atau nilainya; mohonlah kemaafan daripada mereka yang dizalimi.",
    ],
    appLinks: [{ label: "Taubat" }],
  },
  {
    title: "Arak dan Bahan yang Memabukkan",
    summary:
      "Arak dan bahan yang memabukkan — diharamkan secara beransur-ansur dan muktamad dalam al-Quran.",
    body: [
      "Takrif: Khamar ialah apa sahaja yang memabukkan dan mengaburkan akal — arak dan semua jenis alkohol, dan berdasarkan prinsip yang ditetapkan sendiri oleh Nabi ﷺ, setiap bahan yang memabukkan walau apa pun bentuk atau namanya. 'Every intoxicant is khamr, and every khamr is forbidden' (maksud dalam bahasa Inggeris).",
      "Mengapa ia berat: akal ialah kemampuan yang dengannya seseorang mengenal Allah, membezakan yang benar daripada yang salah, dan menjaga setiap tanggungjawab yang lain. Bahan yang memabukkan meruntuhkan perkara itulah, sebab itulah al-Quran menggandingkannya dengan berhala dan judi sebagai 'kotor (keji) dari perbuatan Syaitan' dan memerintahkan, 'hendaklah kamu menjauhinya' (5:90). Di luar diri individu, ia merosakkan kesihatan, keluarga, dan keselamatan, serta membuka pintu kepada dosa-dosa yang tidak akan dihampiri oleh orang yang waras.",
      "Hikmah cara ia diharamkan: Allah tidak mengharamkan khamar dengan sekali gus secara mendadak, tetapi mengharamkannya secara berperingkat, menjauhkan masyarakat Islam yang awal daripada tabiat yang telah berakar umbi dengan lembut. Pendekatan beransur-ansur itu sendiri ialah pengajaran tentang rahmat — dan contoh harapan bagi sesiapa yang sedang bergelut untuk meninggalkannya hari ini.",
      "Jalan untuk kembali, dengan belas kasihan: mereka yang terperangkap dalam ketagihan tidak patut dihina tetapi dibantu. Taubat bermakna berazam meninggalkan bahan itu, menyingkirkannya dan apa-apa yang mencetuskannya daripada kehidupan, mendapatkan bantuan dan rawatan tanpa rasa malu, dan mengisi kekosongan dengan teman yang baik, zikir, dan ibadat. Pintu Allah terbuka luas, dan setiap langkah ikhlas menjauhi bahan yang memabukkan ialah langkah yang Dia sambut.",
    ],
    actions: ["Dapatkan bantuan jika perlu; gantikan tabiat itu dengan zikir dan teman yang baik."],
    appLinks: [{ label: "Zikir harian" }],
  },
];

export const JAHANNAM_NAMES_MS: DeepPartial<JahannamNameEntry>[] = [
  {
    name: "Jahannam",
    meaning: "Api Neraka — nama neraka yang paling kerap disebut dalam al-Quran.",
    context:
      "Digunakan di seluruh al-Quran sebagai tempat azab bagi mereka yang menolak iman dan berterusan melakukan kezaliman.",
    tafsirNote:
      "Ibnu Kathir menyatakan bahawa Jahannam ialah nama yang menyeluruh bagi Api Neraka yang disediakan sebagai amaran dan balasan.",
    scholarlyNote:
      "Sesetengah ulama membincangkan sama ada Jahannam ialah keseluruhan neraka atau satu tingkatan tertentu — pandangan mereka berbeza.",
  },
  {
    name: "Jahim",
    meaning: "Api yang marak menyala — kepanasan yang dahsyat dan hebat.",
    context:
      "Menggambarkan kedahsyatan api yang menanti mereka yang mengambil sekutu-sekutu selain Allah.",
    tafsirNote:
      "Al-Tabari mengaitkan jahim dengan api yang marak dan dinyalakan yang tidak membiarkan apa-apa.",
  },
  {
    name: "Saqar",
    meaning: "Yang membakar hangus atau tidak meninggalkan apa-apa — kepanasan yang amat sangat.",
    context: "Disebut dalam Surah al-Muddaththir tentang orang yang berpaling daripada wahyu.",
    tafsirNote:
      "Tafsir klasik menggambarkan Saqar sebagai satu tingkatan neraka yang membakar dengan dahsyat; perinciannya berbeza antara ulama.",
    scholarlyNote:
      "Sama ada Saqar ialah tingkatan yang tersendiri atau nama bagi neraka secara keseluruhan dibincangkan dalam tafsir — tidak jelas dalam satu nas yang disepakati.",
  },
  {
    name: "Sa'ir",
    meaning: "Yang menyala — api yang dinyalakan.",
    context: "Amaran kepada mereka yang memakan harta anak yatim secara zalim.",
    tafsirNote:
      "Akar katanya membawa makna membakar dan menyalakan — menekankan api yang aktif dan membakar habis.",
  },
  {
    name: "Hutamah",
    meaning: "Penghancur — yang mematahkan dan meremukkan.",
    context:
      "Azab bagi orang yang suka mengumpat dan menimbun harta, menyangka hartanya akan mengekalkannya.",
    tafsirNote:
      "Ibnu Kathir menjelaskan bahawa Hutamah meremukkan dan membakar habis — api yang dinyalakan oleh Allah.",
  },
  {
    name: "Hawiyah",
    meaning: "Jurang atau lubang — tempat jatuh yang dalam.",
    context: "Tempat kembali mereka yang amal kebaikannya terlalu ringan pada Hari Kiamat.",
    tafsirNote:
      "Digambarkan sebagai lubang yang dalam di dalam Neraka; al-Tabari merekodkan pandangan-pandangan tentang kedalaman dan kedahsyatannya.",
    scholarlyNote:
      "Sesetengah karya tafsir menyenaraikan Hawiyah sebagai satu tingkatan tertentu — petik sebagai tafsiran ulama.",
  },
  {
    name: "Laza",
    meaning: "Nyalaan — api yang marak.",
    context: "Surah al-Ma'arij — amaran kepada mereka yang mendustakan Hari Kiamat.",
    tafsirNote:
      "Dikaitkan dengan nyalaan yang menyiat dan membakar — Laza menekankan api yang sedang marak.",
  },
];

export const JAHANNAM_GATES_MS: DeepPartial<JahannamGateEntry>[] = [
  {
    label: "Pintu 1",
    quranNote:
      "Allah menyatakan bahawa neraka mempunyai tujuh pintu; setiap pintu mempunyai bahagian tertentu daripada mereka yang memasukinya (15:44).",
    scholarlyNote:
      "Sesetengah karya tafsir terkemudian mengaitkan pintu-pintu itu dengan golongan pendosa tertentu. Kaitan ini tidak seragam dalam sumber-sumber awal — bentangkan sebagai tafsiran.",
  },
  {
    label: "Pintu 2",
    quranNote:
      "Al-Quran menegaskan tujuh pintu secara keseluruhan; ia tidak menamakan setiap pintu dalam wahyu yang jelas.",
    scholarlyNote:
      "Ibnu Kathir membincangkan bahawa pembahagian itu berdasarkan hikmah dan keadilan Allah.",
  },
  {
    label: "Pintu 3",
    quranNote:
      "Tujuh pintu — fakta yang jelas daripada nas. Perincian tentang penghuni setiap pintu kebanyakannya ialah perbincangan ulama.",
  },
  {
    label: "Pintu 4",
    quranNote:
      "Ayat itu menekankan pembahagian yang setimpal — setiap pintu mempunyai bahagiannya yang ditetapkan.",
  },
  {
    label: "Pintu 5",
    quranNote:
      "Orang beriman diberi amaran supaya mereka dapat menjauhi apa yang membawa kepada pintu-pintu ini melalui taubat.",
  },
  {
    label: "Pintu 6",
    quranNote:
      "Neraka telah disediakan — amaran itu benar. Perlindungan adalah melalui iman dan amal soleh.",
  },
  {
    label: "Pintu 7",
    quranNote:
      "Tujuh pintu, satu Neraka — amaran yang satu, dengan kepelbagaian dalam cara para pendosa dikelompokkan menurut hikmah Ilahi.",
    scholarlyNote:
      "Elakkan mengajarkan kaitan dosa tertentu dengan pintu tertentu sebagai fakta daripada Nabi ﷺ melainkan dengan memetik karya ulama yang dinamakan.",
  },
];

export const JAHANNAM_VERSES_MS: DeepPartial<JahannamVerseEntry>[] = [
  {
    context: "Ditujukan kepada orang beriman — rasa takut sebagai pendorong kepada ketaatan.",
    tafsirSummary:
      "Ibnu Kathir: seruan kepada takwa yang digandingkan dengan ketaatan kepada Rasul.",
  },
  {
    context: "Diturunkan untuk menenangkan mereka yang bimbang dosa-dosa mereka terlalu besar.",
    tafsirSummary: "Ayat asas tentang harapan — rahmat amat luas bagi mereka yang kembali.",
  },
  {
    context: "Perintah kepada orang beriman selepas panduan tentang keluarga dan akhlak.",
    tafsirSummary: "Taubat nasuha — taubat yang ikhlas tanpa kembali kepada dosa itu.",
  },
  {
    context: "Keadilan Ilahi — ganjaran dan azab setimpal dengan amalan.",
    tafsirSummary: "Darjat-darjat ini berlaku di Syurga dan juga di Neraka.",
  },
  {
    context: "Jaminan bahawa penghakiman Ilahi adalah adil dengan sempurna.",
  },
  {
    context: "Doa mereka yang menghimpunkan kebaikan dunia dan akhirat.",
    tafsirSummary:
      "Doa para nabi yang diajarkan dalam al-Quran — keseimbangan antara dunia dan akhirat.",
  },
  {
    context: "Disebut selepas bahagian ketika Iblis bersumpah untuk menyesatkan manusia.",
    tafsirSummary:
      "Sebutan yang jelas tentang tujuh pintu — perincian pembahagiannya ialah hikmah Ilahi.",
  },
  {
    context: "Pengecualian selepas menyenaraikan dosa-dosa yang berat.",
    tafsirSummary: "Harapan bagi orang yang bertaubat — amalan boleh diubah oleh rahmat.",
  },
  {
    context: "Surah al-Mulk — peringatan tentang perkara ghaib.",
  },
  {
    context: "Perintah mendirikan solat pada kedua-dua hujung siang.",
    tafsirSummary: "Galakan bahawa ibadat yang berterusan menghapuskan kesilapan yang lalu.",
  },
  {
    context: "Gambaran tentang golongan muttaqin (orang yang bertakwa).",
  },
  {
    context: "Surah al-Qari'ah — penimbangan amalan.",
  },
];

export const JAHANNAM_HADITH_MS: DeepPartial<JahannamHadithEntry>[] = [
  {
    context: "Galakan supaya sentiasa berdoa memohon Jannah dan perlindungan daripada Jahannam.",
  },
  {},
  {
    context: "Keseimbangan: bersungguh-sungguh dalam beramal tetapi bergantung kepada rahmat.",
  },
  {},
  {
    context: "Beratnya mengabaikan solat — antara amaran yang paling keras.",
  },
  {
    context: "Hak-hak manusia mungkin diselesaikan sebelum amalan dihitung pada Hari Kiamat.",
  },
  {},
  {
    context: "Menjaga lidah — muhasabah harian.",
  },
];

export const JAHANNAM_REFLECTIONS_MS: DeepPartial<JahannamReflectionEntry>[] = [
  {
    question:
      "Adakah aku telah menzalimi sesiapa hari ini — dengan kata-kata, perbuatan, atau kelalaian?",
    appLink: { label: "Jurnal" },
  },
  {
    question:
      "Adakah aku telah memohon keampunan Allah hari ini — dengan ikhlas dan berulang kali?",
    appLink: { label: "Zikir & istighfar" },
  },
  {
    question: "Adakah aku menjaga lidahku daripada mengumpat, berdusta, dan mengejek?",
    appLink: { label: "Dosa-dosa lidah" },
  },
  {
    question: "Adakah aku solat pada waktunya dan dengan hati yang hadir?",
    appLink: { label: "Penjejak solat" },
  },
  {
    question:
      "Adakah aku telah mengambil langkah untuk berdamai dengan seseorang yang telah renggang denganku?",
    appLink: { label: "Dosa terhadap orang lain" },
  },
  {
    question: "Adakah aku bersedekah atau berbuat baik hari ini — walaupun sedikit?",
    appLink: { label: "Perjalanan ke Jannah" },
  },
  {
    question: "Adakah aku membaca atau mendengar al-Quran hari ini?",
    appLink: { label: "Al-Quran" },
  },
];

export const JAHANNAM_REFERENCES_MS: DeepPartial<JahannamReferenceEntry>[] = [
  {
    title: "Al-Quran",
    note: "Sumber utama bagi nama-nama, amaran, rahmat, dan taubat. Terjemahan berbeza-beza; rujuk bahasa Arab untuk ketepatan.",
  },
  {
    title: "Sahih al-Bukhari & Sahih Muslim",
    note: "Kitab-kitab hadis muktabar yang dipetik di sepanjang modul ini apabila bertaraf sahih.",
  },
  {
    title: "Tafsir Ibnu Kathir",
    note: "Dirujuk untuk konteks nama-nama neraka dan ayat-ayat amaran yang utama — tafsiran ulama.",
  },
  {
    title: "Tafsir al-Tabari",
    note: "Tafsir awal yang menyeluruh — berguna untuk memahami pandangan klasik tentang Jahannam.",
  },
  {
    title: "Perkara yang diperselisihkan oleh ulama",
    note: "Tingkatan neraka yang tepat, kaitan pintu-pintunya, dan sesetengah makna nama dibincangkan dalam kalangan ulama — tidak semestinya jelas dalam wahyu.",
  },
];

export const JAHANNAM_DUAS_MS: DeepPartial<JahannamDuaEntry>[] = [
  {
    context:
      "Memohon kebaikan di dunia dan akhirat serta perlindungan daripada Neraka — doa daripada al-Quran.",
  },
  {
    context: "Selepas tasyahud: memohon Syurga dan perlindungan daripada Neraka.",
  },
  {
    context: "Zikir pagi: memohon perlindungan daripada azab kubur dan Neraka.",
  },
];

export const JAHANNAM_REFUGE_DUA_MS: { translation?: string } = {};
