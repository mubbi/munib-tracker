import type { LearnDuaOccasion, LearnDuaTopic } from "../../types/learn-dua";
import type { DeepPartial } from "./localize";

// Malay translation overlay for the Learn Dua content. Mirrors the order of
// LEARN_DUA_TOPICS / LEARN_DUA_OCCASIONS in ../learn-dua*.ts (index-aligned);
// untranslated entries fall back to English. Only human-readable text is translated.

export const LEARN_DUA_TOPICS_MS: DeepPartial<LearnDuaTopic>[] = [
  {
    title: "Apa itu doa?",
    summary:
      "Doa adalah ibadat: memanggil Allah secara langsung, dengan kerendahan hati dan harapan.",
    body: [
      "Doa (دعاء) berarti memanggil Allah — memohon kebaikan, ampunan, petunjuk, dan perlindungan dari-Nya, serta kembali kepada-Nya di saat membutuhkan. Ini bukanlah amalan yang remeh; Nabi ﷺ bersabda, 'Doa adalah ibadat,' lalu membaca firman Allah, 'Berdoalah kepada-Ku, pasti akan Aku kabulkan bagimu.' Memohon kepada Allah itu sendiri merupakan wujud tauhid yang murni, kerana hal itu mengakui bahawa hanya Dia yang mendengar, memiliki, dan mengatur segala sesuatu.",
      "Ada dua jenis doa yang berjalan beriringan: doa mas'alah, iaitu memohon sesuatu kepada Allah; dan doa ibadat, iaitu beribadat kepada-Nya melalui solat, zikir, dan ketaatan — kerana setiap ibadat pada hakikatnya adalah permohonan yang tak terucap supaya diterima dan diberi pahala. Inilah sebabnya mengarahkan doa kepada selain Allah termasuk bentuk syirik: memberikan kepada selain-Nya hak yang hanya milik-Nya.",
      "Seorang mukmin berdoa dalam kemudahan maupun kesulitan, secara terang-terangan maupun tersembunyi, dengan keyakinan bahawa Allah mendengar setiap panggilan dan tidak pernah menolak hamba yang tulus dengan tangan hampa. Dia begitu dekat sampai-sampai berfirman, 'Aku kabulkan permohonan orang yang berdoa apabila ia berdoa kepada-Ku.'",
      "Jawaban doa datang dalam salah satu dari tiga bentuk, seperti diajarkan Nabi ﷺ: Allah memberikan apa yang diminta; atau Dia menahannya dan menyimpan ganjaran yang setara atau lebih besar untuk akhirat; atau Dia menghindarkan suatu keburukan yang setara darinya. Jadi tidak ada doa yang tulus yang benar-benar tidak terjawab — kadang rahmat terbesar justru ada pada jawaban yang tidak kita sadari.",
    ],
    quran: [
      {
        excerpt: "Dan Tuhanmu berfirman, 'Berdoalah kepada-Ku, pasti akan Aku kabulkan bagimu.'",
      },
      {
        excerpt:
          "Dan apabila hamba-hamba-Ku bertanya kepadamu tentang Aku, maka sesungguhnya Aku dekat. Aku kabulkan permohonan orang yang berdoa apabila ia berdoa kepada-Ku.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Doa adalah ibadat. — lalu baginda ﷺ membaca, 'Dan Tuhanmu berfirman, berdoalah kepada-Ku, pasti akan Aku kabulkan bagimu.' (an-Nu'man ibn Bashir)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Adab berdoa",
    summary:
      "Mulailah dengan pujian, kirimkan selawat, mintalah dengan tulus, dan jangan pernah putus asa.",
    body: [
      "Doa memiliki adab yang diajarkan dan dicontohkan langsung oleh Nabi ﷺ, dan menjaganya membuat doa lebih mungkin dikabulkan. Mulailah dengan memuji Allah beserta nama-nama-Nya yang indah, lalu kirimkan selawat kepada Nabi ﷺ — baginda mengajarkan bahawa doa 'tertahan' hingga orang yang berdoa melakukan keduanya — barulah kemudian sampaikan permohonanmu.",
      "Panggillah Allah dengan tiga sikap batin: kerendahan hati, keyakinan bahawa Dia mampu dan akan mengabulkan, serta prasangka baik kepada-Nya (husnuzan). Menghadaplah kiblat bila memungkinkan, angkat kedua tanganmu, pilih waktu-waktu yang penuh berkah, dan mohonlah kebaikan dunia maupun akhirat. Dianjurkan untuk mengulang permohonan yang penting, dan menutup doa seperti memulainya — dengan pujian dan selawat.",
      "Yang terpenting, jangan tergesa-gesa. Nabi ﷺ memperingatkan bahawa doa akan terus dikabulkan selama seseorang tidak putus asa lalu berkata, 'Aku sudah berdoa berkali-kali tetapi tidak dikabulkan,' kemudian meninggal duniakan doa itu. Kesungguhan dalam memohon itu sendiri adalah ibadat, dan Allah mencintai hamba yang terus mengetuk pintu-Nya.",
    ],
    hadith: [
      {
        excerpt:
          "Doa seorang hamba akan terus dikabulkan selama ia tidak tergesa-gesa — dengan berkata, 'Aku telah berdoa namun tidak dikabulkan.' (Abu Hurairah)",
      },
      {
        excerpt:
          "Apabila salah seorang dari kamu berdoa, hendaklah ia memulai dengan memuji dan menyanjung Tuhannya, kemudian bersalawat kepada Nabi ﷺ, barulah memohon apa yang ia kehendaki. (Fadalah bin 'Ubaid)",
      },
    ],
    actions: [
      "Bukalah setiap doa dengan Alhamdulillah dan selawat kepada Nabi ﷺ.",
      "Mohonlah kepada Allah dengan nama-nama yang paling sesuai dengan kebutuhanmu (misalnya Ya Razzaq untuk rezeki, Ya Ghafur untuk ampunan).",
      "Jadikan doa sebagai kebiasaan harian — selepas setiap solat, saat sujud, dan sebelum tidur.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Syarat-syarat terkabulnya doa",
    summary: "Keikhlasan, rezeki yang halal, dan berhenti dari dosa membuka pintu terkabulnya doa.",
    body: [
      "Selain adab, ada beberapa syarat yang sangat memengaruhi apakah doa dikabulkan atau tidak. Yang paling utama adalah ikhlas — hanya kerana Allah semata, tanpa riya dan tanpa memanggil selain-Nya. Hati yang benar-benar hadir dalam doa jauh lebih bernilai daripada lisan yang membaca secara mekanis.",
      "Rezeki yang halal adalah kunci yang sangat penting. Nabi ﷺ menggambarkan seorang musafir yang mengangkat kedua tangannya ke langit sambil berseru 'Ya Rabb, ya Rabb,' namun 'makanannya haram, minumannya haram, pakaiannya haram, dan ia tumbuh dari yang haram — bagaimana mungkin doanya dikabulkan?' Menjaga penghasilan, bertobat dari dosa, dan tidak meminta sesuatu yang berdosa atau memutus tali silaturahmi — semua ini menghilangkan penghalang antara doa dan terkabulnya doa itu.",
      "Walaupun demikian, terkabulnya doa pada akhirnya adalah rahmat Allah, bukan sebuah transaksi yang boleh kita kendalikan. Oleh sebab itu, seorang mukmin memadukan usaha terbaiknya — keikhlasan, kehidupan yang halal, tobat — dengan tawakal yang rendah hati, dan tidak pernah putus asa jika jawaban tertunda. Kelemahan dan dosa masa lalu bukanlah alasan untuk berhenti berdoa; justru itu semua menjadi alasan yang lebih kuat untuk kembali kepada Yang Maha Penyayang.",
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
      "Dului doa-doa panjang dengan istigfar dan tobat yang tulus.",
      "Jangan pernah merangkai doa yang meminta keburukan, dosa, atau ketidakadilan.",
    ],
  },
  {
    title: "Waktu dan tempat terbaik untuk berdoa",
    summary: "Beberapa momen sangat diberkahi untuk terkabulnya doa.",
    body: [
      "Walaupun doa boleh dikabulkan kapan sahaja, Nabi ﷺ menyoroti momen dan keadaan tertentu yang paling diharapkan untuk terkabulnya doa. Sandarkan permohonanmu pada momen-momen ini, bukan hanya menunggu datangnya musibah.",
      "Di antara waktu yang paling utama adalah: sepertiga malam terakhir, ketika Allah turun (dengan cara yang sesuai dengan keagungan-Nya) ke langit dunia dan menyeru, 'Siapa yang memohon kepada-Ku, akan Aku kabulkan?'; sujud dalam solat, posisi terdekat seorang hamba dengan Allah; saat antara azan dan ikamah; ketika seseorang sedang berpuasa, terutamanya saat berbuka; saat turunnya hujan; dan sesaat menjelang terbenamnya matahari pada hari Jumat, yang di dalamnya terboleh satu waktu ketika tidak ada doa yang ditolak.",
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
    appLinks: [{}, {}],
  },
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
      },
      {
        title: "Hasbiyallahu la ilaha illa Huwa",
        when: "Tujuh kali setiap pagi dan petang",
        translation:
          "Cukuplah Allah bagiku, tidak ada tuhan selain Dia. Hanya kepada-Nya aku bertawakal, dan Dia adalah Tuhan pemilik Arsy yang agung.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Selepas bangun tidur dan sebelum tidur",
    summary: "Jadikan kata pertama dan terakhir harimu sebagai kedekatan dengan Allah.",
    body: [
      "Nabi ﷺ mengajarkan zikir khusus untuk bangun tidur dan berbaring untuk tidur, supaya kata-kata sadar pertama seorang mukmin setiap hari adalah rasa syukur, dan kata-kata terakhirnya adalah kepasrahan. Tidur, menurut ajaran baginda, adalah 'kematian kecil,' dan bangun tidur adalah kebangkitan kecil — sehingga zikir-zikir ini membingkai seluruh siklus tersebut dalam kesadaran akan Allah.",
      "Membacanya secara rutin membangun ketenangan spiritual: kebiasaan bersyukur saat bangun dan menitipkan jiwa kepada Allah sebelum tidur. Sebelum tidur, Nabi ﷺ secara khusus menganjurkan membaca Ayat Kursi, dengan janji bahawa seorang penjaga dari Allah akan menyertai pembacanya dan tidak ada setan yang mendekat hingga pagi.",
    ],
    phrases: [
      {
        title: "Doa saat bangun tidur",
        when: "Segera selepas bangun",
        translation:
          "Segala puji bagi Allah yang telah menghidupkan kami selepas mematikan kami, dan kepada-Nya kebangkitan itu (kembali).",
      },
      {
        title: "Doa sebelum tidur",
        when: "Saat berbaring untuk tidur",
        translation: "Dengan nama-Mu, ya Allah, aku mati dan aku hidup.",
      },
      {
        title: "Ayat Kursi sebelum tidur",
        when: "Sebelum tidur",
        translation:
          "Allah, tidak ada tuhan selain Dia, Yang Maha Hidup, Yang terus-menerus mengurus (makhluk-Nya). Tidak mengantuk dan tidak pula tidur. Milik-Nya apa yang ada di langit dan apa yang ada di bumi. Siapakah yang boleh memberi syafaat di sisi-Nya tanpa izin-Nya? Dia mengetahui apa yang ada di hadapan mereka dan apa yang ada di belakang mereka, dan mereka tidak mengetahui sedikit pun dari ilmu-Nya kecuali apa yang Dia kehendaki. Kursi-Nya meliputi langit dan bumi. Dan Dia tidak merasa berat memelihara keduanya, dan Dialah Yang Maha Tinggi lagi Maha Besar.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Doa di rumah dan masjid",
    summary: "Bawa serta zikir saat memasuki dan meninggal duniakan rumah serta masjidmu.",
    body: [
      "Nabi ﷺ menyertakan doa-doa singkat pada setiap ambang batas kehidupan sehari-hari. Menyebut nama Allah saat keluar dan masuk rumah mendatangkan perlindungan dan berkah, serta menutup pintu bagi setan; baginda mengajarkan bahawa ketika seseorang masuk rumah sambil menyebut nama Allah, setan berkata kepada teman-temannya, 'Tidak ada tempat menginap bagi kamu di sini.'",
      "Masjid memiliki adabnya tersendiri: masuklah dengan kaki kanan sambil memohon dibukakan pintu-pintu rahmat, dan keluarlah dengan kaki kiri sambil memohon karunia Allah — pengingat bahawa masjid adalah tempat rahmat, ketertiban, dan kerendahan hati di hadapan Allah.",
    ],
    phrases: [
      {
        title: "Doa saat keluar rumah",
        when: "Saat melangkah keluar rumah",
        translation:
          "Dengan nama Allah, aku bertawakal kepada Allah; tidak ada daya dan kekuatan kecuali dengan (pertolongan) Allah.",
      },
      {
        title: "Doa masuk masjid",
        when: "Saat masuk, melangkah dengan kaki kanan",
        translation: "Ya Allah, bukakanlah bagiku pintu-pintu rahmat-Mu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Doa makan dan minum",
    summary: "Zikir singkat yang mendatangkan berkah dan rasa syukur pada setiap hidangan.",
    body: [
      "Islam mengubah kegiatan makan yang biasa menjadi ibadat melalui zikir. Mulailah dengan 'Bismillah' — yang mengundang berkah dan mencegah setan ikut menikmati hidangan — dan akhiri dengan pujian kepada Allah, melatih hati untuk bersyukur dan sadar berkali-kali dalam sehari.",
      "Sunnah bahkan memberikan cara memperbaiki kelupaan: jika lupa mengucapkan 'Bismillah' di awal, ucapkanlah ketika teringat, 'Bismillahi awwalahu wa akhirahu' (Dengan nama Allah, pada awal dan akhirnya).",
    ],
    phrases: [
      {
        title: "Sebelum makan",
        when: "Pada awal makan",
        translation: "Dengan nama Allah.",
      },
      {
        title: "Selepas makan",
        when: "Saat selesai makan",
        translation:
          "Segala puji bagi Allah yang telah memberiku makan ini dan memberiku rezeki tanpa daya dan kekuatan dariku.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Doa seputar wudu dan solat",
    summary: "Doa sebelum dan sesudah wudu, serta di dalam solat itu sendiri.",
    body: [
      "Wudu dan solat adalah gerbang harian terbesar untuk zikir yang dikabulkan, sehingga sunnah memenuhinya dengan doa. Menyempurnakan wudu dengan mengucapkan kalimat syahadat membuka delapan pintu syurga; dan di dalam solat — saat sujud dan tepat sebelum salam terakhir — terboleh dua momen paling mustajab dalam hari seorang mukmin.",
      "Mempelajari lafal yang sahih untuk momen-momen ini mengubah gerakan ritual menjadi percakapan yang penuh kesadaran dengan Allah.",
    ],
    phrases: [
      {
        title: "Selepas wudu",
        when: "Segera selepas selesai berwudu",
        translation:
          "Aku bersaksi bahawa tidak ada tuhan selain Allah semata, tidak ada sekutu bagi-Nya, dan aku bersaksi bahawa Muhammad adalah hamba dan utusan-Nya.",
      },
      {
        title: "Sebelum salam dalam solat",
        when: "Pada tasyahud akhir, sebelum mengakhiri solat",
        translation:
          "Ya Allah, aku berlindung kepada-Mu dari azab Jahanam, dari azab kubur, dari fitnah kehidupan dan kematian, dan dari keburukan fitnah Al-Masih Dajjal.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Doa saat azan dan ikamah",
    summary: "Jawablah panggilan, mintakan kedudukan bagi Nabi ﷺ, lalu berdoalah.",
    body: [
      "Ketika azan dikumandangkan, sunnahnya adalah mengulang ucapan muazin, lalu mengirimkan selawat kepada Nabi ﷺ, kemudian membaca doa yang memohon kepada Allah supaya Dia menganugerahkan al-Wasilah kepada baginda — Nabi ﷺ menjanjikan syafaatnya bagi siapa yang melakukan hal ini.",
      "Rentang waktu antara azan dan ikamah adalah salah satu waktu terkabulnya doa pribadi; Nabi ﷺ bersabda bahawa doa yang dipanjatkan saat itu tidak ditolak, maka gunakanlah untuk memohon kebutuhanmu kepada Allah.",
    ],
    phrases: [
      {
        title: "Doa selepas azan",
        when: "Ketika azan selesai",
        translation:
          "Ya Allah, Tuhan pemilik seruan yang sempurna ini dan solat yang akan didirikan, berikanlah kepada Muhammad al-Wasilah dan al-Fadhilah, dan bangkitkanlah dia pada kedudukan terpuji yang telah Engkau janjikan kepadanya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Doa yang dipanjatkan antara azan dan ikamah tidak akan ditolak. (Anas bin Malik; juga at-Tirmidzi 212)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Kecemasan dan kesedihan",
    summary: "Kokohkan hati dengan tawakal dan doa-doa Nabi ﷺ sendiri.",
    body: [
      "Islam menghadapi tekanan batin dengan sarana spiritual yang nyata: doa, zikir, solat, dan tawakal kepada takdir Allah. Nabi ﷺ, yang sendiri pernah mengalami kesedihan dan kesulitan, mengajarkan doa-doa khusus untuk kecemasan (hamm), kesedihan (hazan), dan rasa takut — kata-kata yang mengalihkan arah hati dari masalah menuju Zat yang menguasainya.",
      "Doa-doa ini tidak menggantikan usaha mencari pertolongan melalui cara yang halal, termasuk perawatan medis atau profesional ketika memang dibutuhkan. Sebaliknya, doa-doa ini memperkuat hati bersamaan dengan sarana-sarana tersebut, mengingatkan seorang mukmin bahawa kecukupan yang hakiki hanya ada pada Allah semata.",
    ],
    phrases: [
      {
        title: "Doa untuk kecemasan dan duka",
        when: "Saat gelisah, khawatir, atau dilanda kesedihan berat",
        translation:
          "Ya Allah, aku berlindung kepada-Mu dari rasa cemas dan sedih, dari kelemahan dan kemalasan, dari sifat kikir dan pengecut, dari lilitan utang, dan dari tekanan orang lain.",
      },
      {
        title: "Cukuplah Allah bagi kami",
        when: "Ketika takut atau merasa tertekan",
        translation: "Cukuplah Allah bagi kami, dan Dia sebaik-baik pelindung.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Sakit dan rasa takut",
    summary: "Mohon kesembuhan kepada Allah sambil menempuh sarana pengobatan yang halal.",
    body: [
      "Sunnah memadukan doa dengan pengobatan: Nabi ﷺ mengajarkan, 'Setiap penyakit ada obatnya,' dan memerintahkan untuk berobat, sekaligus menyembuhkan hati dan tubuh melalui ruqyah — membaca Al-Quran dan doa-doa yang sahih atas orang yang sakit. Seorang mukmin melakukan keduanya: mengonsumsi obat sekaligus berpaling kepada Sang Penyembuh.",
      "Nama pelaku sesungguhnya penting untuk diyakini: Allah adalah Asy-Syafi, Sang Penyembuh, dan obat hanyalah sarana yang Dia ciptakan. Dalam ketakutan pun, hati kembali kepada-Nya untuk memperoleh keselamatan dan keteguhan — sebab hanya Dia yang memberikan rasa aman.",
    ],
    phrases: [
      {
        title: "Doa untuk kesembuhan",
        when: "Saat sakit, atau saat mendoakan orang yang sakit",
        translation:
          "Ya Allah, Tuhan manusia, hilangkanlah penyakit ini dan berilah kesembuhan — Engkaulah Sang Penyembuh; tidak ada kesembuhan kecuali kesembuhan dari-Mu — kesembuhan yang tidak meninggal duniakan penyakit.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ampunan dan petunjuk",
    summary: "Mintalah terus-menerus ampunan, keteguhan, dan petunjuk yang benar.",
    body: [
      "Memohon ampunan (istigfar) bukan hanya untuk sesudah melakukan dosa besar — ini adalah irama harian seorang mukmin. Nabi ﷺ, yang dosanya telah diampuni, memohon ampunan kepada Allah lebih dari tujuh puluh kali sehari, mengajarkan bahawa hati membutuhkan pembersihan yang terus-menerus.",
      "Petunjuk pun demikian, kebutuhan yang berkelanjutan, bukan peristiwa sekali jadi. Bahkan mukmin yang sudah teguh beribadat tetap memohon kepada Allah supaya hati mereka tetap kokoh, kerana hati mudah berbolak-balik — dan yang membolak-balikkannya adalah Allah. Nabi ﷺ sering berdoa memohon hati yang teguh di atas agama.",
    ],
    phrases: [
      {
        title: "Tobat yang terus-menerus",
        when: "Berulang-ulang, sepanjang hari",
        translation: "Aku memohon ampunan Allah dan bertobat kepada-Nya.",
      },
      {
        title: "Doa hati yang teguh",
        when: "Saat khawatir tersesat atau goyah",
        translation: "Wahai Yang membolak-balikkan hati, teguhkanlah hatiku di atas agama-Mu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Doa perjalanan dan hujan",
    summary: "Doa saat memulai perjalanan, dan untuk rahmat turunnya hujan.",
    body: [
      "Perjalanan adalah keadaan yang sekaligus rentan dan lebih besar peluang terkabulnya doa — Nabi ﷺ mengajarkan bahawa doa seorang musafir dikabulkan, dan memberikan doa untuk saat menaiki kendaraan dan memulai perjalanan yang mengakui kekuasaan Allah serta kepulangan kita kepada-Nya.",
      "Hujan adalah rahmat yang turun dari Allah, dan saat ia turun adalah waktu untuk berdoa. Nabi ﷺ menyambut hujan dengan doa singkat, memohon supaya hujan itu dijadikan bermanfaat, bukan penyebab keburukan.",
    ],
    phrases: [
      {
        title: "Doa saat memulai perjalanan",
        when: "Saat menaiki kendaraan dan berangkat",
        translation:
          "Mahasuci Zat yang telah menundukkan ini untuk kami, padahal kami sebelumnya tidak mampu menguasainya; dan sesungguhnya kami akan kembali kepada Tuhan kami.",
      },
      {
        title: "Doa saat hujan turun",
        when: "Pada awal turunnya hujan",
        translation: "Ya Allah, jadikanlah ia hujan yang bermanfaat.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Rezeki dan keluarga",
    summary: "Mohonlah kepada Allah rezeki yang halal dan kebaikan dalam rumah tangga.",
    body: [
      "Rezeki hanya berasal dari Allah semata; seorang mukmin mengikat untanya — iaitu bekerja dan berusaha — lalu memohon kepada Sang Pemberi Rezeki akan rezeki yang halal, keberkahan dalam apa yang ia peroleh, terbebas dari utang, serta tidak bergantung pada orang lain. Nabi ﷺ mengajarkan doa yang indah yang memohon persis hal ini.",
      "Untuk rumah tangga, Al-Quran sendiri mengajarkan doa orang-orang saleh: supaya dikaruniai pasangan dan keturunan yang menjadi 'penyejuk mata,' serta memimpin rumah tangga yang terikat oleh iman, solat, dan kasih sayang.",
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
        when: "Pagi hari, selepas solat, dan saat kesulitan finansial",
        translation:
          "Ya Allah, cukupkanlah aku dengan yang halal dari-Mu sehingga tidak butuh yang haram, dan kayakanlah aku dengan karunia-Mu sehingga tidak butuh selain-Mu.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Doa-doa Al-Quran",
    summary: "Doa yang diajarkan langsung oleh Allah di dalam Al-Quran.",
    body: [
      "Doa-doa Al-Quran adalah kata-kata yang Allah letakkan pada lisan para nabi dan orang-orang beriman, lalu dijaga untuk kita ulang-ulang — ringkas, menyeluruh, dan mustahil untuk disempurnakan lagi. Banyak yang diawali dengan 'Rabbana' (ya Tuhan kami), dan doa-doa ini sangat ideal untuk dihafal dan dibaca terus-menerus.",
      "Di antaranya mencakup seluruh kebutuhan seorang mukmin: ampunan, petunjuk, keteguhan, rahmat, keluarga yang saleh, perlindungan dari neraka, dan keberhasilan di kedua alam. Berdoa dengan kalimat Allah sendiri termasuk bentuk doa yang paling meyakinkan.",
    ],
    phrases: [
      {
        title: "Kebaikan di dua alam",
        when: "Doa umum untuk segala keperluan — yang paling sering dibaca Nabi ﷺ",
        translation:
          "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan peliharalah kami dari siksa neraka.",
      },
      {
        title: "Keteguhan dalam iman",
        when: "Saat khawatir menyimpang atau selepas menboleh petunjuk",
        translation:
          "Ya Tuhan kami, janganlah Engkau condongkan hati kami kepada kesesatan sesudah Engkau beri petunjuk kepada kami, dan karuniakanlah kepada kami rahmat dari sisi-Mu. Sesungguhnya Engkaulah Maha Pemberi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Doa-doa kenabian",
    summary: "Doa-doa yang sahih diajarkan oleh Nabi Muhammad ﷺ.",
    body: [
      "Nabi ﷺ dianugerahi 'ucapan yang paling ringkas namun padat makna' (jawami' al-kalim), dan doa-doa baginda mencerminkan hal itu: singkat dalam kata, luas dalam makna, dan seimbang sempurna antara kebutuhan dunia dan akhirat. Doa-doa ini memohon petunjuk, kesucian hati, kesehatan, ampunan, perlindungan, dan akhlak yang baik.",
      "Satu prinsip penting: berpeganglah pada doa-doa yang sahih dan telah teruji dari kumpulan yang terpercaya, serta hindari menyebarkan doa-doa lemah atau palsu dengan ganjaran yang dibuat-buat. Kekayaan asli sunnah sudah lebih dari cukup.",
    ],
    phrases: [
      {
        title: "Doa menyeluruh empat perkara",
        when: "Doa harian yang umum",
        translation:
          "Ya Allah, aku memohon kepada-Mu petunjuk, ketakwaan, kesucian diri, dan kecukupan.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Zikir dan tasbih",
    summary: "Zikir singkat yang bobotnya sangat besar dan pahalanya berlimpah.",
    body: [
      "Zikir — mengingat Allah — mencakup tasbih (Subhanallah), tahmid (Alhamdulillah), tahlil (La ilaha illallah), takbir (Allahu Akbar), dan istigfar. Ini termasuk kalimat yang paling ringan diucapkan lisan namun paling berat dalam timbangan, dan menjadi benteng hati yang hidup melawan kelalaian.",
      "Nabi ﷺ menyebutkan kalimat-kalimat yang 'ringan di lisan, berat dalam timbangan, dicintai oleh Ar-Rahman,' dan mengajarkan bahawa siapa yang mengucapkan 'SubhanAllahi wa bihamdih' seratus kali sehari, dosa-dosanya akan dihapuskan walaupun sebanyak buih di lautan. Bila dijaga selepas solat dan sepanjang hari, zikir menjaga iman tetap hidup.",
    ],
    phrases: [
      {
        title: "Kalimat yang dicintai dan penghapus dosa",
        when: "Sepanjang hari; 100 kali menghapus dosa",
        translation: "Mahasuci Allah dan segala puji bagi-Nya.",
      },
      {
        title: "Dua kalimat yang berat dalam timbangan",
        when: "Kapan sahaja",
        translation: "Mahasuci Allah dan segala puji bagi-Nya; Mahasuci Allah Yang Mahaagung.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Selawat kepada Nabi ﷺ",
    summary: "Mengirimkan selawat kepada Nabi ﷺ adalah mata air rahmat setiap hari.",
    body: [
      "Mengirimkan selawat kepada Nabi ﷺ diperintahkan langsung oleh Allah dalam Al-Quran — 'Sesungguhnya Allah dan malaikat-malaikat-Nya bersalawat untuk Nabi; wahai orang-orang yang beriman, bersalawatlah kamu untuk Nabi dan ucapkanlah salam penghormatan kepadanya' — dan tidak ada doa lain yang memberikan balasan sepasti ini: Nabi ﷺ bersabda bahawa siapa yang bersalawat sekali kepadanya, Allah akan bersalawat sepuluh kali kepada orang itu.",
      "Memperbanyak selawat mendatangkan rahmat, mengangkat derajat, menghapus dosa, dan membuat seseorang paling dekat dengan Nabi ﷺ pada hari kiamat. Bentuk lengkap Ibrahimiyyah di bawah ini — yang diajarkan baginda kepada para sahabat ketika mereka bertanya bagaimana cara bersalawat kepadanya — dibaca dalam tasyahud setiap solat dan sangat baik untuk selalu diucapkan sepanjang hari.",
    ],
    quran: [
      {
        excerpt:
          "Sesungguhnya Allah dan malaikat-malaikat-Nya bersalawat untuk Nabi. Wahai orang-orang yang beriman, bersalawatlah kamu untuk Nabi dan ucapkanlah salam penghormatan kepadanya.",
      },
    ],
    phrases: [
      {
        title: "Selawat Ibrahimiyyah lengkap",
        when: "Dalam tasyahud solat dan sepanjang hari",
        translation:
          "Ya Allah, limpahkanlah selawat kepada Muhammad dan keluarga Muhammad, seperti Engkau telah melimpahkan selawat kepada Ibrahim dan keluarga Ibrahim; sesungguhnya Engkau Maha Terpuji lagi Maha Mulia. Ya Allah, limpahkanlah berkah kepada Muhammad dan keluarga Muhammad, seperti Engkau telah melimpahkan berkah kepada Ibrahim dan keluarga Ibrahim; sesungguhnya Engkau Maha Terpuji lagi Maha Mulia.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Sumber dan keabsahan",
    summary: "Utamakan Al-Quran dan hadis sahih dengan rujukan yang jelas.",
    body: [
      "Modul ini bersifat edukatif dan tidak memihak mazhab tertentu, dibangun sepenuhnya di atas Al-Quran dan hadis sahih/hasan yang diterima luas, masing-masing dengan rujukan yang boleh ditelusuri. Standar emas untuk doa harian adalah persis ini: teks yang terverifikasi dengan sumber yang jelas.",
      "Perlu kehati-hatian serius terkait doa: banyak doa beredar di internet dengan redaksi buatan dan janji pahala yang berlebihan ('bacalah ini dan semua dosamu akan hilang'). Hadis palsu adalah perkara yang serius, maka periksalah keabsahan sebuah riwayat yang asing sebelum mengamalkan atau menyebarkannya.",
      "Untuk hafalan dan amalan harian, utamakan doa-doa sahih yang singkat dan benar-benar boleh kamu jaga secara konsisten daripada doa-doa panjang yang akan kamu tinggalkan — konsistensi lebih dicintai Allah daripada banyaknya jumlah. Ketika mazhab berbeda dalam lafalnya, belajarlah dari ulama setempat yang kompeten.",
    ],
    actions: [
      "Periksalah sumber setiap doa yang asing sebelum membagikannya.",
      "Pilih beberapa doa sahih yang ringkas dan jaga konsistensinya setiap hari, daripada banyak doa yang tidak boleh kamu pertahankan.",
      "Gunakan tautan topik di aplikasi untuk memasangkan setiap pengajaran dengan amalan nyata.",
    ],
    disclaimer:
      "Konten edukatif ini tidak menggantikan nasihat fikih yang bersifat pribadi. Tanyakan kepada ulama yang kompeten untuk hukum kasus-kasus tertentu.",
    appLinks: [{}, {}, {}, {}],
  },
];

export const LEARN_DUA_OCCASIONS_MS: DeepPartial<LearnDuaOccasion>[] = [
  {
    title: "Zikir pagi",
    summary: "Mulai hari dengan zikir",
  },
  {
    title: "Zikir petang",
    summary: "Perlindungan sebelum malam",
  },
  {
    title: "Selepas bangun tidur",
    summary: "Kata pertama saat terjaga",
  },
  {
    title: "Sebelum tidur",
    summary: "Doa dan zikir malam hari",
  },
  {
    title: "Masuk rumah",
    summary: "Bismillah dan salam",
  },
  {
    title: "Keluar rumah",
    summary: "Tawakal saat bepergian",
  },
  {
    title: "Masjid",
    summary: "Masuk dan keluar masjid",
  },
  {
    title: "Sebelum & sesudah makan",
    summary: "Rasa syukur saat makan",
  },
  {
    title: "Wudu",
    summary: "Sebelum dan sesudah wudu",
  },
  {
    title: "Solat",
    summary: "Sebelum, saat, dan sesudah solat",
  },
  {
    title: "Cemas & khawatir",
    summary: "Tenangkan hati dengan doa",
  },
  {
    title: "Sakit",
    summary: "Kesembuhan dan kesabaran",
  },
  {
    title: "Ampunan",
    summary: "Istigfar dan tobat",
  },
  {
    title: "Perjalanan",
    summary: "Berangkat dan kembali",
  },
  {
    title: "Rezeki",
    summary: "Memohon rezeki halal kepada Allah",
  },
  {
    title: "Doa-doa Qurani",
    summary: "Doa dari Kitab Allah",
  },
];
