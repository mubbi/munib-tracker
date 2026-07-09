import type { LearnDuaOccasion, LearnDuaTopic } from "../../types/learn-dua";
import type { DeepPartial } from "./localize";

// Indonesian (Bahasa Indonesia) translation overlay for the Learn Dua content.
// Mirrors the order of LEARN_DUA_TOPICS / LEARN_DUA_OCCASIONS in
// ../learn-dua*.ts (index-aligned); untranslated entries fall back to
// English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
// Arabic script (`arabic`) is kept verbatim.
export const LEARN_DUA_TOPICS_ID: DeepPartial<LearnDuaTopic>[] = [
  // Intro
  {
    title: "Apa itu doa?",
    summary:
      "Doa adalah ibadah: memanggil Allah secara langsung, dengan kerendahan hati dan harapan.",
    body: [
      "Doa (دعاء) berarti memanggil Allah — memohon kebaikan, ampunan, petunjuk, dan perlindungan dari-Nya, serta kembali kepada-Nya di saat membutuhkan. Ini bukanlah amalan yang remeh; Nabi ﷺ bersabda, 'Doa adalah ibadah,' lalu membacakan firman Allah, 'Berdoalah kepada-Ku, niscaya akan Aku kabulkan bagimu.' Memohon kepada Allah itu sendiri merupakan wujud tauhid yang murni, karena hal itu mengakui bahwa hanya Dia yang mendengar, memiliki, dan mengatur segala sesuatu.",
      "Ada dua jenis doa yang berjalan beriringan: doa mas'alah, yaitu memohon sesuatu kepada Allah; dan doa ibadah, yaitu beribadah kepada-Nya melalui salat, zikir, dan ketaatan — karena setiap ibadah pada hakikatnya adalah permohonan yang tak terucap agar diterima dan diberi pahala. Inilah sebabnya mengarahkan doa kepada selain Allah termasuk bentuk syirik: memberikan kepada selain-Nya hak yang hanya milik-Nya.",
      "Seorang mukmin berdoa dalam kemudahan maupun kesulitan, secara terang-terangan maupun tersembunyi, dengan keyakinan bahwa Allah mendengar setiap panggilan dan tidak pernah menolak hamba yang tulus dengan tangan hampa. Dia begitu dekat sampai-sampai berfirman, 'Aku kabulkan permohonan orang yang berdoa apabila ia berdoa kepada-Ku.'",
      "Jawaban doa datang dalam salah satu dari tiga bentuk, sebagaimana diajarkan Nabi ﷺ: Allah memberikan apa yang diminta; atau Dia menahannya dan menyimpan ganjaran yang setara atau lebih besar untuk akhirat; atau Dia menghindarkan suatu keburukan yang setara darinya. Jadi tidak ada doa yang tulus yang benar-benar tidak terjawab — kadang rahmat terbesar justru ada pada jawaban yang tidak kita sadari.",
    ],
    quran: [
      {
        excerpt: "Dan Tuhanmu berfirman, 'Berdoalah kepada-Ku, niscaya akan Aku kabulkan bagimu.'",
      },
      {
        excerpt:
          "Dan apabila hamba-hamba-Ku bertanya kepadamu tentang Aku, maka sesungguhnya Aku dekat. Aku kabulkan permohonan orang yang berdoa apabila ia berdoa kepada-Ku.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Doa adalah ibadah. — lalu beliau ﷺ membaca, 'Dan Tuhanmu berfirman, berdoalah kepada-Ku, niscaya akan Aku kabulkan bagimu.' (an-Nu'man ibn Bashir)",
      },
    ],
    appLinks: [{ label: "Jelajahi doa" }],
  },
  {
    title: "Adab berdoa",
    summary:
      "Mulailah dengan pujian, kirimkan selawat, mintalah dengan tulus, dan jangan pernah putus asa.",
    body: [
      "Doa memiliki adab yang diajarkan dan dicontohkan langsung oleh Nabi ﷺ, dan menjaganya membuat doa lebih mungkin dikabulkan. Mulailah dengan memuji Allah beserta nama-nama-Nya yang indah, lalu kirimkan selawat kepada Nabi ﷺ — beliau mengajarkan bahwa doa 'tertahan' hingga orang yang berdoa melakukan keduanya — barulah kemudian sampaikan permohonanmu.",
      "Panggillah Allah dengan tiga sikap batin: kerendahan hati, keyakinan bahwa Dia mampu dan akan mengabulkan, serta prasangka baik kepada-Nya (husnuzan). Menghadaplah kiblat bila memungkinkan, angkat kedua tanganmu, pilih waktu-waktu yang penuh berkah, dan mohonlah kebaikan dunia maupun akhirat. Dianjurkan untuk mengulang permohonan yang penting, dan menutup doa sebagaimana memulainya — dengan pujian dan selawat.",
      "Yang terpenting, jangan tergesa-gesa. Nabi ﷺ memperingatkan bahwa doa akan terus dikabulkan selama seseorang tidak putus asa lalu berkata, 'Aku sudah berdoa berkali-kali tetapi tidak dikabulkan,' kemudian meninggalkan doa itu. Kesungguhan dalam memohon itu sendiri adalah ibadah, dan Allah mencintai hamba yang terus mengetuk pintu-Nya.",
    ],
    hadith: [
      {
        excerpt:
          "Doa seorang hamba akan terus dikabulkan selama ia tidak tergesa-gesa — dengan berkata, 'Aku telah berdoa namun tidak dikabulkan.' (Abu Hurairah)",
      },
      {
        excerpt:
          "Apabila salah seorang dari kalian berdoa, hendaklah ia memulai dengan memuji dan menyanjung Tuhannya, kemudian bersalawat kepada Nabi ﷺ, barulah memohon apa yang ia kehendaki. (Fadalah bin 'Ubaid)",
      },
    ],
    actions: [
      "Bukalah setiap doa dengan Alhamdulillah dan selawat kepada Nabi ﷺ.",
      "Mohonlah kepada Allah dengan nama-nama yang paling sesuai dengan kebutuhanmu (misalnya Ya Razzaq untuk rezeki, Ya Ghafur untuk ampunan).",
      "Jadikan doa sebagai kebiasaan harian — setelah setiap salat, saat sujud, dan sebelum tidur.",
    ],
    appLinks: [{ label: "Doa salat" }, { label: "Kumpulan selawat" }],
  },
  {
    title: "Syarat-syarat terkabulnya doa",
    summary: "Keikhlasan, rezeki yang halal, dan berhenti dari dosa membuka pintu terkabulnya doa.",
    body: [
      "Selain adab, ada beberapa syarat yang sangat memengaruhi apakah doa dikabulkan atau tidak. Yang paling utama adalah ikhlas — hanya karena Allah semata, tanpa riya dan tanpa memanggil selain-Nya. Hati yang benar-benar hadir dalam doa jauh lebih bernilai daripada lisan yang membaca secara mekanis.",
      "Rezeki yang halal adalah kunci yang sangat penting. Nabi ﷺ menggambarkan seorang musafir yang mengangkat kedua tangannya ke langit sambil berseru 'Ya Rabb, ya Rabb,' namun 'makanannya haram, minumannya haram, pakaiannya haram, dan ia tumbuh dari yang haram — bagaimana mungkin doanya dikabulkan?' Menjaga penghasilan, bertobat dari dosa, dan tidak meminta sesuatu yang berdosa atau memutus tali silaturahmi — semua ini menghilangkan penghalang antara doa dan terkabulnya doa itu.",
      "Meski demikian, terkabulnya doa pada akhirnya adalah rahmat Allah, bukan sebuah transaksi yang bisa kita kendalikan. Karena itu, seorang mukmin memadukan usaha terbaiknya — keikhlasan, kehidupan yang halal, tobat — dengan tawakal yang rendah hati, dan tidak pernah putus asa jika jawaban tertunda. Kelemahan dan dosa masa lalu bukanlah alasan untuk berhenti berdoa; justru itu semua menjadi alasan yang lebih kuat untuk kembali kepada Yang Maha Penyayang.",
    ],
    hadith: [
      {
        excerpt:
          "…makanannya haram, minumannya haram, pakaiannya haram, tumbuh dari yang haram — bagaimana mungkin doanya dikabulkan? (Abu Hurairah)",
      },
      {
        excerpt:
          "Doa seorang hamba akan dikabulkan selama ia tidak meminta sesuatu yang berdosa atau memutus tali silaturahmi. (Abu Hurairah)",
      },
    ],
    actions: [
      "Periksalah penghasilan dan pengeluaranmu dari sisi kehalalannya — ini berpengaruh langsung pada doamu.",
      "Dahului doa-doa panjang dengan istigfar dan tobat yang tulus.",
      "Jangan pernah merangkai doa yang meminta keburukan, dosa, atau ketidakadilan.",
    ],
  },
  {
    title: "Waktu dan tempat terbaik untuk berdoa",
    summary: "Beberapa momen sangat diberkahi untuk terkabulnya doa.",
    body: [
      "Meskipun doa dapat dikabulkan kapan saja, Nabi ﷺ menyoroti momen dan keadaan tertentu yang paling diharapkan untuk terkabulnya doa. Sandarkan permohonanmu pada momen-momen ini, bukan hanya menunggu datangnya musibah.",
      "Di antara waktu yang paling utama adalah: sepertiga malam terakhir, ketika Allah turun (dengan cara yang sesuai dengan keagungan-Nya) ke langit dunia dan menyeru, 'Siapa yang memohon kepada-Ku, akan Aku kabulkan?'; sujud dalam salat, posisi terdekat seorang hamba dengan Allah; saat antara azan dan ikamah; ketika seseorang sedang berpuasa, terutama saat berbuka; saat turunnya hujan; dan sesaat menjelang terbenamnya matahari pada hari Jumat, yang di dalamnya terdapat satu waktu ketika tidak ada doa yang ditolak.",
      "Tempat dan keadaan yang diberkahi meliputi berdiri di Arafah saat haji, berada di dalam tanah suci, serta doa seorang musafir, doa orang tua untuk anaknya, dan doa orang yang teraniaya. Jadikan semua ini sebagai sandaran tetap bagi kehidupan berdoa yang konsisten.",
    ],
    hadith: [
      {
        excerpt:
          "Tuhan kita turun setiap malam ke langit dunia pada sepertiga malam terakhir dan berfirman: Siapa yang berdoa kepada-Ku, akan Aku kabulkan? Siapa yang memohon kepada-Ku, akan Aku berikan? (Abu Hurairah)",
      },
      {
        excerpt:
          "Saat terdekat seorang hamba dengan Tuhannya adalah ketika ia sedang sujud, maka perbanyaklah doa di dalamnya. (Abu Hurairah)",
      },
    ],
    appLinks: [{ label: "Pengingat salat" }, { label: "Zikir harian" }],
  },

  // Daily
  {
    title: "Zikir pagi dan petang",
    summary: "'Benteng muslim' harian — perlindungan dan kedekatan di kedua ujung hari.",
    body: [
      "Zikir pagi dan petang termasuk zikir harian yang paling ditekankan dalam sunnah — sebuah benteng spiritual yang diperbarui seorang mukmin di awal dan akhir setiap hari. Allah memerintahkan orang-orang beriman untuk 'mengingat Allah dengan sebanyak-banyaknya, dan bertasbihlah kepada-Nya pada waktu pagi dan petang' (33:41–42).",
      "Jika dibaca secara konsisten, zikir-zikir ini menjaga dari keburukan dan bisikan setan, memperbarui tawakal kepada Allah, dan menjaga hati tetap tertaut kepada-Nya sepanjang perubahan keadaan hari itu. Dua zikir terpenting ada di bawah ini; kumpulan zikir di aplikasi memuat set lengkapnya.",
    ],
    phrases: [
      {
        title: "Sayyidul Istigfar (penghulu istigfar)",
        when: "Sekali setiap pagi dan petang",
        translation:
          "Ya Allah, Engkau adalah Tuhanku, tidak ada tuhan yang berhak disembah selain Engkau. Engkau menciptakanku dan aku adalah hamba-Mu, dan aku berpegang pada janji dan ikrar-Mu semampuku. Aku berlindung kepada-Mu dari keburukan apa yang telah kuperbuat. Aku mengakui nikmat-Mu atasku, dan aku mengakui dosaku, maka ampunilah aku — sebab tidak ada yang mengampuni dosa-dosa kecuali Engkau.",
        reference:
          "Sahih al-Bukhari 6306 — barangsiapa mengucapkannya di siang hari dengan penuh keyakinan lalu meninggal pada hari itu, ia termasuk penghuni surga",
      },
      {
        title: "Hasbiyallahu la ilaha illa Huwa",
        when: "Tujuh kali setiap pagi dan petang",
        translation:
          "Cukuplah Allah bagiku, tidak ada tuhan selain Dia. Hanya kepada-Nya aku bertawakal, dan Dia adalah Tuhan pemilik Arsy yang agung.",
        reference: "Qur'an 9:129 (redaksinya); Sunan Abi Dawud 5081 untuk amalan pagi/petangnya",
      },
    ],
    appLinks: [{ label: "Zikir pagi dan petang" }, { label: "Semua doa" }],
  },
  {
    title: "Setelah bangun tidur dan sebelum tidur",
    summary: "Jadikan kata pertama dan terakhir harimu sebagai kedekatan dengan Allah.",
    body: [
      "Nabi ﷺ mengajarkan zikir khusus untuk bangun tidur dan berbaring untuk tidur, agar kata-kata sadar pertama seorang mukmin setiap hari adalah rasa syukur, dan kata-kata terakhirnya adalah kepasrahan. Tidur, menurut ajaran beliau, adalah 'kematian kecil,' dan bangun tidur adalah kebangkitan kecil — sehingga zikir-zikir ini membingkai seluruh siklus tersebut dalam kesadaran akan Allah.",
      "Membacanya secara rutin membangun ketenangan spiritual: kebiasaan bersyukur saat bangun dan menitipkan jiwa kepada Allah sebelum tidur. Sebelum tidur, Nabi ﷺ secara khusus menganjurkan membaca Ayat Kursi, dengan janji bahwa seorang penjaga dari Allah akan menyertai pembacanya dan tidak ada setan yang mendekat hingga pagi.",
    ],
    phrases: [
      {
        title: "Doa saat bangun tidur",
        when: "Segera setelah bangun",
        translation:
          "Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami, dan kepada-Nya kebangkitan itu (kembali).",
        reference: "Sahih al-Bukhari 6312",
      },
      {
        title: "Doa sebelum tidur",
        when: "Saat berbaring untuk tidur",
        translation: "Dengan nama-Mu, ya Allah, aku mati dan aku hidup.",
        reference: "Sahih al-Bukhari 6324",
      },
      {
        title: "Ayat Kursi sebelum tidur",
        when: "Sebelum tidur",
        translation:
          "Allah, tidak ada tuhan selain Dia, Yang Maha Hidup, Yang terus-menerus mengurus (makhluk-Nya). Tidak mengantuk dan tidak pula tidur. Milik-Nya apa yang ada di langit dan apa yang ada di bumi. Siapakah yang dapat memberi syafaat di sisi-Nya tanpa izin-Nya? Dia mengetahui apa yang ada di hadapan mereka dan apa yang ada di belakang mereka, dan mereka tidak mengetahui sedikit pun dari ilmu-Nya kecuali apa yang Dia kehendaki. Kursi-Nya meliputi langit dan bumi. Dan Dia tidak merasa berat memelihara keduanya, dan Dialah Yang Maha Tinggi lagi Maha Besar.",
        reference:
          "Qur'an 2:255; Sahih al-Bukhari 2311 — seorang penjaga tetap menyertai pembacanya hingga pagi",
      },
    ],
    appLinks: [{ label: "Doa sebelum tidur" }, { label: "Zikir malam" }],
  },
  {
    title: "Doa di rumah dan masjid",
    summary: "Bawa serta zikir saat memasuki dan meninggalkan rumah serta masjidmu.",
    body: [
      "Nabi ﷺ menyertakan doa-doa singkat pada setiap ambang batas kehidupan sehari-hari. Menyebut nama Allah saat keluar dan masuk rumah mendatangkan perlindungan dan berkah, serta menutup pintu bagi setan; beliau mengajarkan bahwa ketika seseorang masuk rumah sambil menyebut nama Allah, setan berkata kepada teman-temannya, 'Tidak ada tempat menginap bagi kalian di sini.'",
      "Masjid memiliki adabnya tersendiri: masuklah dengan kaki kanan sambil memohon dibukakan pintu-pintu rahmat, dan keluarlah dengan kaki kiri sambil memohon karunia Allah — pengingat bahwa masjid adalah tempat rahmat, ketertiban, dan kerendahan hati di hadapan Allah.",
    ],
    phrases: [
      {
        title: "Doa saat keluar rumah",
        when: "Saat melangkah keluar rumah",
        translation:
          "Dengan nama Allah, aku bertawakal kepada Allah; tidak ada daya dan kekuatan kecuali dengan (pertolongan) Allah.",
        reference: "Sunan Abi Dawud 5095; Jami' at-Tirmidhi 3426 (hasan sahih)",
      },
      {
        title: "Doa masuk masjid",
        when: "Saat masuk, melangkah dengan kaki kanan",
        translation: "Ya Allah, bukakanlah bagiku pintu-pintu rahmat-Mu.",
        reference: "Sahih Muslim 713",
      },
    ],
    appLinks: [{ label: "Doa seputar salat" }, { label: "Zikir masjid" }],
  },
  {
    title: "Doa makan dan minum",
    summary: "Zikir singkat yang mendatangkan berkah dan rasa syukur pada setiap hidangan.",
    body: [
      "Islam mengubah kegiatan makan yang biasa menjadi ibadah melalui zikir. Mulailah dengan 'Bismillah' — yang mengundang berkah dan mencegah setan ikut menikmati hidangan — dan akhiri dengan pujian kepada Allah, melatih hati untuk bersyukur dan sadar berkali-kali dalam sehari.",
      "Sunnah bahkan memberikan cara memperbaiki kelupaan: jika lupa mengucapkan 'Bismillah' di awal, ucapkanlah ketika teringat, 'Bismillahi awwalahu wa akhirahu' (Dengan nama Allah, pada awal dan akhirnya).",
    ],
    phrases: [
      {
        title: "Sebelum makan",
        when: "Pada awal makan",
        translation: "Dengan nama Allah.",
        reference: "Sahih al-Bukhari 5376; Jami' at-Tirmidhi 1858 (dengan koreksi bila terlupa)",
      },
      {
        title: "Setelah makan",
        when: "Saat selesai makan",
        translation:
          "Segala puji bagi Allah yang telah memberiku makan ini dan memberiku rezeki tanpa daya dan kekuatan dariku.",
        reference: "Jami' at-Tirmidhi 3458 (hasan) — dosa-dosanya yang telah lalu diampuni",
      },
    ],
    appLinks: [{ label: "Doa makan" }],
  },
  {
    title: "Doa seputar wudu dan salat",
    summary: "Doa sebelum dan sesudah wudu, serta di dalam salat itu sendiri.",
    body: [
      "Wudu dan salat adalah gerbang harian terbesar untuk zikir yang dikabulkan, sehingga sunnah memenuhinya dengan doa. Menyempurnakan wudu dengan mengucapkan kalimat syahadat membuka delapan pintu surga; dan di dalam salat — saat sujud dan tepat sebelum salam terakhir — terdapat dua momen paling mustajab dalam hari seorang mukmin.",
      "Mempelajari lafal yang sahih untuk momen-momen ini mengubah gerakan ritual menjadi percakapan yang penuh kesadaran dengan Allah.",
    ],
    phrases: [
      {
        title: "Setelah wudu",
        when: "Segera setelah selesai berwudu",
        translation:
          "Aku bersaksi bahwa tidak ada tuhan selain Allah semata, tidak ada sekutu bagi-Nya, dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya.",
        reference: "Sahih Muslim 234",
      },
      {
        title: "Sebelum salam dalam salat",
        when: "Pada tasyahud akhir, sebelum mengakhiri salat",
        translation:
          "Ya Allah, aku berlindung kepada-Mu dari azab Jahanam, dari azab kubur, dari fitnah kehidupan dan kematian, dan dari keburukan fitnah Al-Masih Dajjal.",
        reference: "Sahih al-Bukhari 1377; Sahih Muslim 588",
      },
    ],
    appLinks: [{ label: "Doa salat" }, { label: "Zikir salat" }],
  },
  {
    title: "Doa saat azan dan ikamah",
    summary: "Jawablah panggilan, mintakan kedudukan bagi Nabi ﷺ, lalu berdoalah.",
    body: [
      "Ketika azan dikumandangkan, sunnahnya adalah mengulang ucapan muazin, lalu mengirimkan selawat kepada Nabi ﷺ, kemudian membaca doa yang memohon kepada Allah agar Dia menganugerahkan al-Wasilah kepada beliau — Nabi ﷺ menjanjikan syafaatnya bagi siapa yang melakukan hal ini.",
      "Rentang waktu antara azan dan ikamah adalah salah satu waktu terkabulnya doa pribadi; Nabi ﷺ bersabda bahwa doa yang dipanjatkan saat itu tidak ditolak, maka gunakanlah untuk memohon kebutuhanmu kepada Allah.",
    ],
    phrases: [
      {
        title: "Doa setelah azan",
        when: "Ketika azan selesai",
        translation:
          "Ya Allah, Tuhan pemilik seruan yang sempurna ini dan salat yang akan didirikan, berikanlah kepada Muhammad al-Wasilah dan al-Fadhilah, dan bangkitkanlah dia pada kedudukan terpuji yang telah Engkau janjikan kepadanya.",
        reference: "Sahih al-Bukhari 614",
      },
    ],
    hadith: [
      {
        excerpt:
          "Doa yang dipanjatkan antara azan dan ikamah tidak akan ditolak. (Anas bin Malik; juga at-Tirmidzi 212)",
      },
    ],
    appLinks: [{ label: "Doa azan & salat" }, { label: "Pustaka zikir" }],
  },

  // Situational
  {
    title: "Kecemasan dan kesedihan",
    summary: "Kokohkan hati dengan tawakal dan doa-doa Nabi ﷺ sendiri.",
    body: [
      "Islam menghadapi tekanan batin dengan sarana spiritual yang nyata: doa, zikir, salat, dan tawakal kepada takdir Allah. Nabi ﷺ, yang sendiri pernah mengalami kesedihan dan kesulitan, mengajarkan doa-doa khusus untuk kecemasan (hamm), kesedihan (hazan), dan rasa takut — kata-kata yang mengalihkan arah hati dari masalah menuju Zat yang menguasainya.",
      "Doa-doa ini tidak menggantikan usaha mencari pertolongan melalui cara yang halal, termasuk perawatan medis atau profesional ketika memang dibutuhkan. Sebaliknya, doa-doa ini memperkuat hati bersamaan dengan sarana-sarana tersebut, mengingatkan seorang mukmin bahwa kecukupan yang hakiki hanya ada pada Allah semata.",
    ],
    phrases: [
      {
        title: "Doa untuk kecemasan dan duka",
        when: "Saat gelisah, khawatir, atau dilanda kesedihan berat",
        translation:
          "Ya Allah, aku berlindung kepada-Mu dari rasa cemas dan sedih, dari kelemahan dan kemalasan, dari sifat kikir dan pengecut, dari lilitan utang, dan dari tekanan orang lain.",
        reference: "Sahih al-Bukhari 6369 (Anas ibn Malik)",
      },
      {
        title: "Cukuplah Allah bagi kami",
        when: "Ketika takut atau merasa tertekan",
        translation: "Cukuplah Allah bagi kami, dan Dia sebaik-baik pelindung.",
        reference: "Qur'an 3:173 — ucapan orang-orang beriman ketika diancam",
      },
    ],
    appLinks: [{ label: "Zikir ketenangan" }, { label: "Doa umum" }],
  },
  {
    title: "Sakit dan rasa takut",
    summary: "Mohon kesembuhan kepada Allah sambil menempuh sarana pengobatan yang halal.",
    body: [
      "Sunnah memadukan doa dengan pengobatan: Nabi ﷺ mengajarkan, 'Setiap penyakit ada obatnya,' dan memerintahkan untuk berobat, sekaligus menyembuhkan hati dan tubuh melalui ruqyah — membacakan Al-Qur'an dan doa-doa yang sahih atas orang yang sakit. Seorang mukmin melakukan keduanya: mengonsumsi obat sekaligus berpaling kepada Sang Penyembuh.",
      "Nama pelaku sesungguhnya penting untuk diyakini: Allah adalah Asy-Syafi, Sang Penyembuh, dan obat hanyalah sarana yang Dia ciptakan. Dalam ketakutan pun, hati kembali kepada-Nya untuk memperoleh keselamatan dan keteguhan — sebab hanya Dia yang memberikan rasa aman.",
    ],
    phrases: [
      {
        title: "Doa untuk kesembuhan",
        when: "Saat sakit, atau saat mendoakan orang yang sakit",
        translation:
          "Ya Allah, Tuhan manusia, hilangkanlah penyakit ini dan berilah kesembuhan — Engkaulah Sang Penyembuh; tidak ada kesembuhan kecuali kesembuhan dari-Mu — kesembuhan yang tidak meninggalkan penyakit.",
        reference: "Sahih al-Bukhari 5743; Sahih Muslim 2191 ('Aishah)",
      },
    ],
    appLinks: [{ label: "Doa kesembuhan" }, { label: "Zikir perlindungan" }],
  },
  {
    title: "Ampunan dan petunjuk",
    summary: "Mintalah terus-menerus ampunan, keteguhan, dan petunjuk yang benar.",
    body: [
      "Memohon ampunan (istigfar) bukan hanya untuk sesudah melakukan dosa besar — ini adalah irama harian seorang mukmin. Nabi ﷺ, yang dosanya telah diampuni, memohon ampunan kepada Allah lebih dari tujuh puluh kali sehari, mengajarkan bahwa hati membutuhkan pembersihan yang terus-menerus.",
      "Petunjuk pun demikian, kebutuhan yang berkelanjutan, bukan peristiwa sekali jadi. Bahkan mukmin yang sudah teguh beribadah tetap memohon kepada Allah agar hati mereka tetap kokoh, karena hati mudah berbolak-balik — dan yang membolak-balikkannya adalah Allah. Nabi ﷺ sering berdoa memohon hati yang teguh di atas agama.",
    ],
    phrases: [
      {
        title: "Tobat yang terus-menerus",
        when: "Berulang-ulang, sepanjang hari",
        translation: "Aku memohon ampunan Allah dan bertobat kepada-Nya.",
        reference: "Sahih al-Bukhari 6307 — Nabi ﷺ memohon ampunan lebih dari 70 kali sehari",
      },
      {
        title: "Doa hati yang teguh",
        when: "Saat khawatir tersesat atau goyah",
        translation: "Wahai Yang membolak-balikkan hati, teguhkanlah hatiku di atas agama-Mu.",
        reference: "Jami' at-Tirmidhi 2140 (hasan) — sumpah dan doa beliau yang paling sering",
      },
    ],
    appLinks: [{ label: "Doa tobat" }, { label: "Istigfar harian" }],
  },
  {
    title: "Doa perjalanan dan hujan",
    summary: "Doa saat memulai perjalanan, dan untuk rahmat turunnya hujan.",
    body: [
      "Perjalanan adalah keadaan yang sekaligus rentan dan lebih besar peluang terkabulnya doa — Nabi ﷺ mengajarkan bahwa doa seorang musafir dikabulkan, dan memberikan doa untuk saat menaiki kendaraan dan memulai perjalanan yang mengakui kekuasaan Allah serta kepulangan kita kepada-Nya.",
      "Hujan adalah rahmat yang turun dari Allah, dan saat ia turun adalah waktu untuk berdoa. Nabi ﷺ menyambut hujan dengan doa singkat, memohon agar hujan itu dijadikan bermanfaat, bukan penyebab keburukan.",
    ],
    phrases: [
      {
        title: "Doa saat memulai perjalanan",
        when: "Saat menaiki kendaraan dan berangkat",
        translation:
          "Mahasuci Zat yang telah menundukkan ini untuk kami, padahal kami sebelumnya tidak mampu menguasainya; dan sesungguhnya kami akan kembali kepada Tuhan kami.",
        reference: "Qur'an 43:13–14 (redaksinya); Sahih Muslim 1342 (amalan perjalanan Nabi ﷺ)",
      },
      {
        title: "Doa saat hujan turun",
        when: "Pada awal turunnya hujan",
        translation: "Ya Allah, jadikanlah ia hujan yang bermanfaat.",
        reference: "Sahih al-Bukhari 1032 ('Aishah)",
      },
    ],
    appLinks: [{ label: "Doa perjalanan" }, { label: "Panduan perjalanan" }],
  },
  {
    title: "Rezeki dan keluarga",
    summary: "Mohonlah kepada Allah rezeki yang halal dan kebaikan dalam rumah tangga.",
    body: [
      "Rezeki hanya berasal dari Allah semata; seorang mukmin mengikat untanya — yakni bekerja dan berusaha — lalu memohon kepada Sang Pemberi Rezeki akan rezeki yang halal, keberkahan dalam apa yang ia peroleh, terbebas dari utang, serta tidak bergantung pada orang lain. Nabi ﷺ mengajarkan doa yang indah yang memohon persis hal ini.",
      "Untuk rumah tangga, Al-Qur'an sendiri mengajarkan doa orang-orang saleh: agar dikaruniai pasangan dan keturunan yang menjadi 'penyejuk mata,' serta memimpin rumah tangga yang terikat oleh iman, salat, dan kasih sayang.",
    ],
    quran: [
      {
        excerpt:
          "Ya Tuhan kami, anugerahkanlah kepada kami pasangan dan keturunan kami sebagai penyejuk mata, dan jadikanlah kami pemimpin bagi orang-orang yang bertakwa.",
      },
    ],
    phrases: [
      {
        title: "Doa rezeki yang halal",
        when: "Pagi hari, setelah salat, dan saat kesulitan finansial",
        translation:
          "Ya Allah, cukupkanlah aku dengan yang halal dari-Mu sehingga tidak butuh yang haram, dan kayakanlah aku dengan karunia-Mu sehingga tidak butuh selain-Mu.",
        reference: "Jami' at-Tirmidhi 3563 (hasan) ('Ali ibn Abi Talib)",
      },
    ],
    appLinks: [{ label: "Doa keluarga dan kehidupan" }],
  },

  // Categories
  {
    title: "Doa-doa Al-Qur'an",
    summary: "Doa yang diajarkan langsung oleh Allah di dalam Al-Qur'an.",
    body: [
      "Doa-doa Al-Qur'an adalah kata-kata yang Allah letakkan pada lisan para nabi dan orang-orang beriman, lalu dijaga untuk kita ulang-ulang — ringkas, menyeluruh, dan mustahil untuk disempurnakan lagi. Banyak yang diawali dengan 'Rabbana' (ya Tuhan kami), dan doa-doa ini sangat ideal untuk dihafal dan dibaca terus-menerus.",
      "Di antaranya mencakup seluruh kebutuhan seorang mukmin: ampunan, petunjuk, keteguhan, rahmat, keluarga yang saleh, perlindungan dari neraka, dan keberhasilan di kedua alam. Berdoa dengan kalimat Allah sendiri termasuk bentuk doa yang paling meyakinkan.",
    ],
    phrases: [
      {
        title: "Kebaikan di dua alam",
        when: "Doa umum untuk segala keperluan — yang paling sering dibaca Nabi ﷺ",
        translation:
          "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan peliharalah kami dari siksa neraka.",
        reference: "Qur'an 2:201 (doa yang paling sering dibaca Nabi ﷺ — Sahih al-Bukhari 6389)",
      },
      {
        title: "Keteguhan dalam iman",
        when: "Saat khawatir menyimpang atau setelah mendapat petunjuk",
        translation:
          "Ya Tuhan kami, janganlah Engkau condongkan hati kami kepada kesesatan sesudah Engkau beri petunjuk kepada kami, dan karuniakanlah kepada kami rahmat dari sisi-Mu. Sesungguhnya Engkaulah Maha Pemberi.",
        reference: "Qur'an 3:8",
      },
    ],
    appLinks: [{ label: "Pembaca Al-Qur'an" }, { label: "Doa-doa Qur'ani" }],
  },
  {
    title: "Doa-doa kenabian",
    summary: "Doa-doa yang sahih diajarkan oleh Nabi Muhammad ﷺ.",
    body: [
      "Nabi ﷺ dianugerahi 'ucapan yang paling ringkas namun padat makna' (jawami' al-kalim), dan doa-doa beliau mencerminkan hal itu: singkat dalam kata, luas dalam makna, dan seimbang sempurna antara kebutuhan dunia dan akhirat. Doa-doa ini memohon petunjuk, kesucian hati, kesehatan, ampunan, perlindungan, dan akhlak yang baik.",
      "Satu prinsip penting: berpeganglah pada doa-doa yang sahih dan telah teruji dari kumpulan yang terpercaya, serta hindari menyebarkan doa-doa lemah atau palsu dengan ganjaran yang dibuat-buat. Kekayaan asli sunnah sudah lebih dari cukup.",
    ],
    phrases: [
      {
        title: "Doa menyeluruh empat perkara",
        when: "Doa harian yang umum",
        translation:
          "Ya Allah, aku memohon kepada-Mu petunjuk, ketakwaan, kesucian diri, dan kecukupan.",
        reference: "Sahih Muslim 2721 (Ibn Mas'ud)",
      },
    ],
    appLinks: [{ label: "Doa-doa kenabian" }],
  },
  {
    title: "Zikir dan tasbih",
    summary: "Zikir singkat yang bobotnya sangat besar dan pahalanya berlimpah.",
    body: [
      "Zikir — mengingat Allah — mencakup tasbih (Subhanallah), tahmid (Alhamdulillah), tahlil (La ilaha illallah), takbir (Allahu Akbar), dan istigfar. Ini termasuk kalimat yang paling ringan diucapkan lisan namun paling berat dalam timbangan, dan menjadi benteng hati yang hidup melawan kelalaian.",
      "Nabi ﷺ menyebutkan kalimat-kalimat yang 'ringan di lisan, berat dalam timbangan, dicintai oleh Ar-Rahman,' dan mengajarkan bahwa siapa yang mengucapkan 'SubhanAllahi wa bihamdih' seratus kali sehari, dosa-dosanya akan dihapuskan meskipun sebanyak buih di lautan. Bila dijaga setelah salat dan sepanjang hari, zikir menjaga iman tetap hidup.",
    ],
    phrases: [
      {
        title: "Kalimat yang dicintai dan penghapus dosa",
        when: "Sepanjang hari; 100 kali menghapus dosa",
        translation: "Mahasuci Allah dan segala puji bagi-Nya.",
        reference: "Sahih al-Bukhari 6405; Sahih Muslim 2691",
      },
      {
        title: "Dua kalimat yang berat dalam timbangan",
        when: "Kapan saja",
        translation: "Mahasuci Allah dan segala puji bagi-Nya; Mahasuci Allah Yang Mahaagung.",
        reference:
          "Sahih al-Bukhari 6406; Sahih Muslim 2694 — ringan di lisan, berat dalam timbangan",
      },
    ],
    appLinks: [{ label: "Kumpulan zikir" }],
  },
  {
    title: "Selawat kepada Nabi ﷺ",
    summary: "Mengirimkan selawat kepada Nabi ﷺ adalah mata air rahmat setiap hari.",
    body: [
      "Mengirimkan selawat kepada Nabi ﷺ diperintahkan langsung oleh Allah dalam Al-Qur'an — 'Sesungguhnya Allah dan malaikat-malaikat-Nya bersalawat untuk Nabi; wahai orang-orang yang beriman, bersalawatlah kalian untuk Nabi dan ucapkanlah salam penghormatan kepadanya' — dan tidak ada doa lain yang memberikan balasan sepasti ini: Nabi ﷺ bersabda bahwa siapa yang bersalawat sekali kepadanya, Allah akan bersalawat sepuluh kali kepada orang itu.",
      "Memperbanyak selawat mendatangkan rahmat, mengangkat derajat, menghapus dosa, dan membuat seseorang paling dekat dengan Nabi ﷺ pada hari kiamat. Bentuk lengkap Ibrahimiyyah di bawah ini — yang diajarkan beliau kepada para sahabat ketika mereka bertanya bagaimana cara bersalawat kepadanya — dibaca dalam tasyahud setiap salat dan sangat baik untuk selalu diucapkan sepanjang hari.",
    ],
    quran: [
      {
        excerpt:
          "Sesungguhnya Allah dan malaikat-malaikat-Nya bersalawat untuk Nabi. Wahai orang-orang yang beriman, bersalawatlah kalian untuk Nabi dan ucapkanlah salam penghormatan kepadanya.",
      },
    ],
    phrases: [
      {
        title: "Selawat Ibrahimiyyah lengkap",
        when: "Dalam tasyahud salat dan sepanjang hari",
        translation:
          "Ya Allah, limpahkanlah selawat kepada Muhammad dan keluarga Muhammad, sebagaimana Engkau telah melimpahkan selawat kepada Ibrahim dan keluarga Ibrahim; sesungguhnya Engkau Maha Terpuji lagi Maha Mulia. Ya Allah, limpahkanlah berkah kepada Muhammad dan keluarga Muhammad, sebagaimana Engkau telah melimpahkan berkah kepada Ibrahim dan keluarga Ibrahim; sesungguhnya Engkau Maha Terpuji lagi Maha Mulia.",
        reference: "Sahih al-Bukhari 3370; Sahih Muslim 406 (Ka'b ibn 'Ujrah)",
      },
    ],
    appLinks: [{ label: "Kumpulan selawat" }],
  },

  // Reference
  {
    title: "Sumber dan keabsahan",
    summary: "Utamakan Al-Qur'an dan hadis sahih dengan rujukan yang jelas.",
    body: [
      "Modul ini bersifat edukatif dan tidak memihak mazhab tertentu, dibangun sepenuhnya di atas Al-Qur'an dan hadis sahih/hasan yang diterima luas, masing-masing dengan rujukan yang dapat ditelusuri. Standar emas untuk doa harian adalah persis ini: teks yang terverifikasi dengan sumber yang jelas.",
      "Perlu kehati-hatian serius terkait doa: banyak doa beredar di internet dengan redaksi buatan dan janji pahala yang berlebihan ('bacalah ini dan semua dosamu akan hilang'). Hadis palsu adalah perkara yang serius, maka periksalah keabsahan sebuah riwayat yang asing sebelum mengamalkan atau menyebarkannya.",
      "Untuk hafalan dan amalan harian, utamakan doa-doa sahih yang singkat dan benar-benar bisa kamu jaga secara konsisten daripada doa-doa panjang yang akan kamu tinggalkan — konsistensi lebih dicintai Allah daripada banyaknya jumlah. Ketika mazhab berbeda dalam lafalnya, belajarlah dari ulama setempat yang kompeten.",
    ],
    actions: [
      "Periksalah sumber setiap doa yang asing sebelum membagikannya.",
      "Pilih beberapa doa sahih yang ringkas dan jaga konsistensinya setiap hari, daripada banyak doa yang tidak bisa kamu pertahankan.",
      "Gunakan tautan topik di aplikasi untuk memasangkan setiap pelajaran dengan amalan nyata.",
    ],
    disclaimer:
      "Konten edukatif ini tidak menggantikan nasihat fikih yang bersifat pribadi. Tanyakan kepada ulama yang kompeten untuk hukum kasus-kasus tertentu.",
    appLinks: [
      { label: "Pustaka doa" },
      { label: "Al-Qur'an" },
      { label: "Zikir" },
      { label: "Selawat" },
    ],
  },
];

export const LEARN_DUA_OCCASIONS_ID: DeepPartial<LearnDuaOccasion>[] = [
  { title: "Zikir pagi", summary: "Mulai hari dengan zikir" },
  { title: "Zikir petang", summary: "Perlindungan sebelum malam" },
  { title: "Setelah bangun tidur", summary: "Kata pertama saat terjaga" },
  { title: "Sebelum tidur", summary: "Doa dan zikir malam hari" },
  { title: "Masuk rumah", summary: "Bismillah dan salam" },
  { title: "Keluar rumah", summary: "Tawakal saat bepergian" },
  { title: "Masjid", summary: "Masuk dan keluar masjid" },
  { title: "Sebelum & sesudah makan", summary: "Rasa syukur saat makan" },
  { title: "Wudu", summary: "Sebelum dan sesudah wudu" },
  { title: "Salat", summary: "Sebelum, saat, dan sesudah salat" },
  { title: "Cemas & khawatir", summary: "Tenangkan hati dengan doa" },
  { title: "Sakit", summary: "Kesembuhan dan kesabaran" },
  { title: "Ampunan", summary: "Istigfar dan tobat" },
  { title: "Perjalanan", summary: "Berangkat dan kembali" },
  { title: "Rezeki", summary: "Memohon rezeki halal kepada Allah" },
  { title: "Doa-doa Qur'ani", summary: "Doa dari Kitab Allah" },
];
