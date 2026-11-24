import type { LearnDuaOccasion, LearnDuaTopic } from "../../types/learn-dua";
import type { DeepPartial } from "./localize";

// Malay translation overlay for the Learn Dua content. Mirrors the order of
// LEARN_DUA_TOPICS / LEARN_DUA_OCCASIONS in ../learn-dua*.ts (index-aligned);
// untranslated entries fall back to English. Only human-readable text is translated.

export const LEARN_DUA_TOPICS_MS: DeepPartial<LearnDuaTopic>[] = [
  // Intro
  {
    title: "Apakah itu doa?",
    summary:
      "Doa ialah ibadah: menyeru Allah secara langsung, dengan rendah diri dan penuh harapan.",
    body: [
      "Doa (دعاء) ialah menyeru Allah — memohon kebaikan, keampunan, petunjuk dan perlindungan daripada-Nya, serta kembali kepada-Nya ketika memerlukan. Doa bukanlah amalan yang remeh; Nabi ﷺ bersabda, 'Dua is worship' (maksud dalam bahasa Inggeris), lalu baginda membaca perintah Allah, 'Berdoalah kamu kepadaKu nescaya Aku perkenankan doa permohonan kamu.' Memohon kepada Allah itu sendiri ialah tauhid yang murni, kerana ia mengakui bahawa hanya Dia yang mendengar, memiliki dan mengawal segala kesudahan.",
      "Terdapat dua jenis doa yang saling berkait: doa al-mas'alah, iaitu memohon sesuatu daripada Allah; dan doa al-'ibadah, iaitu menyembah-Nya melalui solat, zikir dan ketaatan — kerana setiap ibadah pada hakikatnya ialah permohonan yang tidak terucap agar ia diterima dan diberi ganjaran. Oleh sebab itu, menujukan doa kepada selain Allah ialah satu bentuk syirik: ia memberikan kepada yang lain apa yang hanya milik-Nya.",
      "Seorang mukmin berdoa ketika senang dan susah, secara terang dan tersembunyi, dengan yakin bahawa Allah mendengar setiap seruan dan tidak sekali-kali menolak doa yang ikhlas dengan tangan kosong. Dia begitu hampir sehingga Dia berfirman, 'Aku perkenankan permohonan orang yang berdoa apabila ia berdoa kepadaKu.'",
      "Jawapan doa datang dalam salah satu daripada tiga bentuk, sebagaimana diajarkan oleh Nabi ﷺ: Allah memberikan apa yang diminta; atau Dia menahannya dan menyimpan ganjaran yang sama atau lebih besar untuk akhirat; atau Dia menolak suatu keburukan yang setara dengannya. Maka tiada doa yang ikhlas benar-benar tidak dijawab — adakalanya rahmat yang paling besar terletak pada jawapan yang tidak kita lihat.",
    ],
    appLinks: [{ label: "Layari doa" }],
  },
  {
    title: "Adab berdoa",
    summary:
      "Mulakan dengan pujian, berselawat, memohon dengan ikhlas, dan jangan sekali-kali berputus asa.",
    body: [
      "Doa mempunyai adab yang diajarkan dan dicontohkan oleh Nabi ﷺ, dan menjaganya menjadikan doa lebih berkemungkinan dimakbulkan. Mulakan dengan memuji Allah dengan nama-nama-Nya yang indah, kemudian berselawat ke atas Nabi ﷺ — baginda mengajarkan bahawa doa itu 'suspended' (maksud dalam bahasa Inggeris) sehingga orang yang berdoa melakukan kedua-duanya — dan barulah selepas itu kemukakan permohonan anda.",
      "Serulah Allah dengan tiga sifat batin: rendah diri, yakin bahawa Dia mampu dan akan memperkenankannya, serta bersangka baik kepada-Nya (husnuzan). Hadaplah kiblat jika boleh, angkatlah kedua-dua tangan, pilihlah waktu-waktu yang diberkati, dan mohonlah kebaikan urusan dunia dan akhirat. Disunatkan mengulang-ulang permohonan yang penting, dan menutup doa sebagaimana anda memulakannya — dengan pujian dan selawat.",
      "Yang paling utama, jangan tergesa-gesa. Nabi ﷺ memberi amaran bahawa doa seseorang akan dimakbulkan selagi dia tidak berputus asa lalu berkata, 'I called and called but was not answered' (maksud dalam bahasa Inggeris), kemudian meninggalkan doa. Tekun memohon itu sendiri ialah ibadah, dan Allah mengasihi hamba yang terus mengetuk pintu-Nya.",
    ],
    actions: [
      "Mulakan setiap doa dengan Alhamdulillah dan selawat ke atas Nabi ﷺ.",
      "Mohonlah kepada Allah dengan nama-Nya yang paling sesuai dengan keperluan anda (contohnya Ya Razzaq untuk rezeki, Ya Ghafur untuk keampunan).",
      "Jadikan doa amalan harian — selepas setiap solat, ketika sujud dan sebelum tidur.",
    ],
    appLinks: [{ label: "Doa solat" }, { label: "Koleksi selawat" }],
  },
  {
    title: "Syarat doa dimakbulkan",
    summary:
      "Keikhlasan, rezeki yang halal dan meninggalkan dosa membuka pintu-pintu makbulnya doa.",
    body: [
      "Selain adab, terdapat beberapa syarat yang sangat mempengaruhi sama ada sesuatu doa dimakbulkan. Yang paling utama ialah ikhlas — semata-mata kerana Allah, tanpa riyak dan tanpa menyeru selain-Nya. Hati yang benar-benar hadir ketika berdoa jauh lebih bernilai daripada lidah yang membaca secara mekanikal.",
      "Rezeki yang halal ialah kunci yang sangat penting. Nabi ﷺ menggambarkan seorang musafir yang mengangkat kedua-dua tangannya ke langit sambil menyeru 'O Lord, O Lord,' namun 'his food is unlawful, his drink is unlawful, his clothing is unlawful, and he is nourished by the unlawful — so how can he be answered?' (maksud dalam bahasa Inggeris). Menjaga sumber pendapatan, bertaubat daripada dosa, dan tidak meminta sesuatu yang berdosa atau yang memutuskan silaturahim — semua ini menghapuskan penghalang antara doa dan makbulnya.",
      "Walaupun begitu, makbulnya doa pada akhirnya ialah rahmat Allah, bukan satu urus niaga yang kita kawal. Oleh itu, seorang mukmin menggabungkan usaha terbaiknya — keikhlasan, hidup yang halal dan taubat — dengan tawakal yang penuh rendah diri, dan tidak berputus asa jika jawapannya tertangguh. Kelemahan dan dosa yang lalu bukanlah alasan untuk berhenti memohon; malah ia menjadi sebab yang lebih kuat untuk kembali kepada Yang Maha Penyayang.",
    ],
    actions: [
      "Semak pendapatan dan perbelanjaan anda dari segi halalnya — ia memberi kesan langsung kepada doa anda.",
      "Dahului doa-doa yang panjang dengan istighfar dan taubat yang ikhlas.",
      "Jangan sekali-kali menyusun doa yang memohon keburukan, dosa atau kezaliman.",
    ],
  },
  {
    title: "Waktu dan tempat terbaik untuk berdoa",
    summary: "Sesetengah saat sangat diberkati untuk doa yang dimakbulkan.",
    body: [
      "Walaupun doa dimakbulkan pada bila-bila masa, Nabi ﷺ menyebut secara khusus saat dan keadaan tertentu yang paling diharapkan doa dimakbulkan. Jadikan saat-saat ini sebagai tambatan permohonan anda, bukan hanya menunggu ketika ditimpa musibah.",
      "Antara yang paling utama ialah: sepertiga malam yang terakhir, ketika Allah turun (dengan cara yang layak dengan keagungan-Nya) ke langit dunia dan menyeru, 'Who will ask of Me, that I may give him?' (maksud dalam bahasa Inggeris); sujud dalam solat, iaitu kedudukan yang paling hampir dengan Allah; waktu antara azan dan iqamah; ketika seseorang berpuasa, terutamanya ketika berbuka; ketika hujan turun; dan saat terakhir pada hari Jumaat sebelum matahari terbenam, kerana padanya terdapat satu saat yang tiada doa ditolak.",
      "Tempat dan keadaan yang diberkati termasuklah wukuf di Arafah ketika haji, berada di dalam Tanah Haram, serta doa orang musafir, doa ibu bapa untuk anaknya dan doa orang yang dizalimi. Jadikan semua ini tambatan tetap untuk kehidupan yang sentiasa berdoa.",
    ],
    appLinks: [{ label: "Peringatan solat" }, { label: "Zikir harian" }],
  },

  // Daily
  {
    title: "Zikir pagi dan petang",
    summary:
      "'Benteng Muslim' harian — perlindungan dan hubungan dengan Allah di awal dan akhir hari.",
    body: [
      "Zikir pagi dan petang antara zikir harian yang paling ditekankan dalam Sunnah — benteng rohani yang diperbaharui oleh seorang mukmin pada awal dan akhir setiap hari. Allah memerintahkan orang-orang beriman: 'ingatlah serta sebutlah nama Allah dengan ingatan serta sebutan yang sebanyak-banyaknya … Dan bertasbihlah kamu kepadaNya pada waktu pagi dan petang' (33:41–42).",
      "Jika diamalkan secara istiqamah, zikir ini melindungi daripada bahaya dan bisikan syaitan, memperbaharui tawakal kepada Allah, dan memastikan hati sentiasa terikat kepada-Nya dalam segala keadaan sepanjang hari. Dua yang paling penting terdapat di bawah; koleksi zikir dalam aplikasi memuatkan set lengkapnya.",
    ],
    phrases: [
      {
        title: "Sayyidul Istighfar (penghulu istighfar)",
        when: "Sekali setiap pagi dan petang",
      },
      {
        title: "Hasbiyallahu la ilaha illa Huwa",
        when: "Tujuh kali setiap pagi dan petang",
      },
    ],
    appLinks: [{ label: "Zikir pagi dan petang" }, { label: "Semua doa" }],
  },
  {
    title: "Selepas bangun dan sebelum tidur",
    summary:
      "Jadikan kata-kata pertama dan terakhir anda setiap hari sebagai hubungan dengan Allah.",
    body: [
      "Nabi ﷺ mengajarkan zikir khusus ketika bangun tidur dan ketika berbaring untuk tidur, supaya kata-kata pertama seorang mukmin yang sedar setiap hari ialah kesyukuran, dan kata-kata terakhirnya ialah penyerahan diri. Baginda mengajarkan bahawa tidur ialah 'minor death' (maksud dalam bahasa Inggeris), dan bangun tidur ialah kebangkitan yang kecil — maka zikir-zikir ini membingkai seluruh kitaran itu dalam kesedaran terhadap Allah.",
      "Mengamalkannya secara tetap membina keteguhan rohani: kebiasaan bersyukur ketika bangun dan menyerahkan jiwa kepada Allah sebelum tidur. Sebelum tidur, Nabi ﷺ secara khusus menggalakkan membaca Ayat Kursi, dengan janji bahawa seorang penjaga daripada Allah akan sentiasa bersama pembacanya dan tiada syaitan yang mendekatinya hingga pagi.",
    ],
    phrases: [
      {
        title: "Doa ketika bangun tidur",
        when: "Sebaik sahaja bangun tidur",
      },
      {
        title: "Doa sebelum tidur",
        when: "Ketika berbaring untuk tidur",
      },
      {
        title: "Ayat Kursi sebelum tidur",
        when: "Sebelum tidur",
      },
    ],
    appLinks: [{ label: "Doa tidur" }, { label: "Zikir malam" }],
  },
  {
    title: "Doa di rumah dan masjid",
    summary: "Bawalah zikir bersama anda ketika masuk dan keluar dari rumah serta masjid.",
    body: [
      "Nabi ﷺ menyertakan doa-doa ringkas pada setiap ambang kehidupan seharian. Menyebut nama Allah ketika keluar dan masuk rumah membawa perlindungan dan keberkatan, serta menutup pintu kepada syaitan; baginda mengajarkan bahawa apabila seseorang masuk sambil menyebut nama Allah, syaitan berkata kepada rakan-rakannya, 'You have no place to spend the night here' (maksud dalam bahasa Inggeris).",
      "Masjid mempunyai adabnya yang tersendiri: masuklah dengan kaki kanan sambil memohon dibukakan pintu-pintu rahmat, dan keluarlah dengan kaki kiri sambil memohon kurnia Allah — peringatan bahawa masjid ialah tempat rahmat, disiplin dan rendah diri di hadapan Allah.",
    ],
    phrases: [
      {
        title: "Doa keluar rumah",
        when: "Ketika melangkah keluar dari rumah",
      },
      {
        title: "Doa masuk masjid",
        when: "Ketika masuk, dengan mendahulukan kaki kanan",
      },
    ],
    appLinks: [{ label: "Doa berkaitan solat" }, { label: "Zikir masjid" }],
  },
  {
    title: "Doa makan dan minum",
    summary: "Zikir ringkas yang membawa keberkatan dan kesyukuran pada setiap hidangan.",
    body: [
      "Islam menjadikan perbuatan makan yang biasa sebagai ibadah melalui zikir. Mulakan dengan 'Bismillah' — yang mengundang keberkatan dan menghalang syaitan daripada berkongsi hidangan — dan akhiri dengan memuji Allah, melatih hati untuk bersyukur dan sedar beberapa kali sehari.",
      "Sunnah juga menyediakan cara membetulkan kelupaan: jika anda terlupa membaca 'Bismillah' pada permulaan, bacalah ketika teringat, 'Bismillahi awwalahu wa akhirahu' (In the name of Allah, at its beginning and its end — maksud dalam bahasa Inggeris).",
    ],
    phrases: [
      {
        title: "Sebelum makan",
        when: "Pada permulaan makan",
      },
      {
        title: "Selepas makan",
        when: "Apabila selesai makan",
      },
    ],
    appLinks: [{ label: "Doa makan" }],
  },
  {
    title: "Doa berkaitan wuduk dan solat",
    summary: "Doa sebelum dan selepas wuduk, serta di dalam solat itu sendiri.",
    body: [
      "Wuduk dan solat ialah peluang harian yang paling besar untuk zikir yang diterima, maka Sunnah memenuhinya dengan doa. Menyempurnakan wuduk dengan lafaz syahadah membuka lapan pintu Syurga; dan di dalam solat — ketika sujud dan sejurus sebelum salam terakhir — terdapat dua daripada saat yang paling mustajab dalam hari seorang mukmin.",
      "Mempelajari lafaz-lafaz yang sahih untuk saat-saat ini mengubah gerakan ibadah menjadi perbualan yang penuh kesedaran dengan Allah.",
    ],
    phrases: [
      {
        title: "Selepas wuduk",
        when: "Sebaik sahaja selesai berwuduk",
      },
      {
        title: "Sebelum salam dalam solat",
        when: "Dalam tasyahud akhir, sebelum mengakhiri solat",
      },
    ],
    appLinks: [{ label: "Doa solat" }, { label: "Zikir solat" }],
  },
  {
    title: "Doa ketika azan dan iqamah",
    summary: "Jawablah seruan azan, mohonlah kedudukan mulia untuk Nabi ﷺ, kemudian berdoalah.",
    body: [
      "Apabila azan dilaungkan, Sunnahnya ialah mengulangi lafaz muazin, kemudian berselawat ke atas Nabi ﷺ, kemudian membaca doa yang memohon agar Allah mengurniakan al-Wasilah kepada baginda — Nabi ﷺ menjanjikan syafaatnya kepada sesiapa yang berbuat demikian.",
      "Waktu antara azan dan iqamah ialah salah satu waktu mustajab untuk doa peribadi; Nabi ﷺ bersabda bahawa doa pada waktu itu tidak ditolak, maka gunakanlah ia untuk memohon kepada Allah segala keperluan anda.",
    ],
    phrases: [
      {
        title: "Doa selepas azan",
        when: "Apabila azan selesai",
      },
    ],
    appLinks: [{ label: "Doa azan & solat" }, { label: "Perpustakaan zikir" }],
  },

  // Situational
  {
    title: "Kebimbangan dan kesedihan",
    summary: "Teguhkan hati dengan tawakal dan doa-doa Nabi ﷺ sendiri.",
    body: [
      "Islam menghadapi tekanan jiwa dengan alat rohani yang praktikal: doa, zikir, solat dan tawakal kepada ketentuan Allah. Nabi ﷺ, yang sendiri pernah mengalami kesedihan dan kesusahan, mengajarkan doa-doa yang tepat untuk kebimbangan (hamm), kesedihan (hazan) dan ketakutan — kata-kata yang mengalihkan hati daripada masalah kepada Zat yang menguasainya.",
      "Doa-doa ini tidak menggantikan usaha mendapatkan bantuan melalui cara yang halal, termasuk rawatan perubatan atau profesional apabila diperlukan. Sebaliknya, ia menguatkan hati seiring dengan usaha tersebut, sambil mengingatkan seorang mukmin bahawa kecukupan yang hakiki hanya ada pada Allah.",
    ],
    phrases: [
      {
        title: "Doa ketika bimbang dan sedih",
        when: "Ketika resah, risau atau ditimpa kesedihan yang berat",
      },
      {
        title: "Cukuplah Allah bagi kami",
        when: "Ketika takut atau rasa tertekan",
      },
    ],
    appLinks: [{ label: "Zikir ketenangan" }, { label: "Doa umum" }],
  },
  {
    title: "Sakit dan ketakutan",
    summary: "Mohon kesembuhan daripada Allah sambil berikhtiar dengan rawatan yang halal.",
    body: [
      "Sunnah menggabungkan doa dengan rawatan: Nabi ﷺ mengajarkan, 'For every disease there is a cure' (maksud dalam bahasa Inggeris), dan memerintahkan agar berubat, di samping mengubati hati dan tubuh melalui ruqyah — membacakan Al-Quran dan doa-doa yang sahih ke atas orang yang sakit. Seorang mukmin melakukan kedua-duanya: mengambil ubat dan berpaling kepada Yang Maha Menyembuhkan.",
      "Penting untuk mengenali siapa yang sebenarnya menyembuhkan: Allah ialah asy-Syafi, Yang Maha Menyembuhkan, dan ubat hanyalah sebab yang Dia ciptakan. Ketika takut juga, hati kembali kepada-Nya untuk mendapatkan keselamatan dan keteguhan — kerana hanya Dia yang mengurniakan rasa aman.",
    ],
    phrases: [
      {
        title: "Doa untuk kesembuhan",
        when: "Ketika sakit, atau ketika mendoakan orang yang sakit",
      },
    ],
    appLinks: [{ label: "Doa penyembuhan" }, { label: "Zikir perlindungan" }],
  },
  {
    title: "Keampunan dan petunjuk",
    summary: "Mohonlah sentiasa keampunan, keteguhan dan petunjuk yang benar.",
    body: [
      "Memohon keampunan (istighfar) bukan hanya selepas melakukan dosa besar — ia ialah rentak harian seorang mukmin. Nabi ﷺ, yang telah pun diampunkan, memohon keampunan Allah lebih daripada tujuh puluh kali sehari, mengajarkan bahawa hati memerlukan penggilapan yang berterusan.",
      "Petunjuk juga merupakan keperluan yang berterusan, bukan peristiwa sekali sahaja. Malah orang beriman yang teguh beramal pun memohon kepada Allah agar hati mereka tetap teguh, kerana hati sentiasa berbolak-balik — dan Yang membolak-balikkannya ialah Allah. Nabi ﷺ kerap berdoa agar hatinya diteguhkan di atas agama.",
    ],
    phrases: [
      {
        title: "Taubat yang kerap",
        when: "Berulang kali, sepanjang hari",
      },
      {
        title: "Doa untuk hati yang teguh",
        when: "Ketika bimbang akan tersesat atau goyah",
      },
    ],
    appLinks: [{ label: "Doa taubat" }, { label: "Istighfar harian" }],
  },
  {
    title: "Doa musafir dan hujan",
    summary: "Doa ketika memulakan perjalanan, dan ketika turunnya rahmat hujan.",
    body: [
      "Perjalanan ialah keadaan yang terdedah kepada bahaya dan juga lebih mustajab — Nabi ﷺ mengajarkan bahawa doa orang musafir dimakbulkan, dan baginda memberikan doa ketika menaiki kenderaan dan memulakan perjalanan yang mengakui kekuasaan Allah serta kepulangan kita kepada-Nya.",
      "Hujan ialah rahmat yang turun daripada Allah, dan saat turunnya ialah waktu untuk berdoa. Nabi ﷺ menyambut hujan dengan doa ringkas, memohon agar ia dijadikan bermanfaat, bukan penyebab bencana.",
    ],
    phrases: [
      {
        title: "Doa ketika memulakan perjalanan",
        when: "Ketika menaiki kenderaan dan bertolak",
      },
      {
        title: "Doa ketika hujan turun",
        when: "Pada permulaan hujan turun",
      },
    ],
    appLinks: [{ label: "Doa musafir" }, { label: "Panduan musafir" }],
  },
  {
    title: "Rezeki dan keluarga",
    summary: "Mohonlah kepada Allah rezeki yang halal dan kesolehan dalam rumah tangga.",
    body: [
      "Rezeki datang daripada Allah semata-mata; seorang mukmin menambat untanya — bekerja dan mencari nafkah — kemudian memohon kepada Yang Maha Pemberi Rezeki agar dikurniakan rezeki yang halal, keberkatan pada apa yang diperolehnya, bebas daripada hutang, dan tidak bergantung kepada orang lain. Nabi ﷺ mengajarkan sebuah doa yang indah yang memohon tepat perkara ini.",
      "Bagi rumah tangga, Al-Quran sendiri mengajarkan doa orang-orang soleh: agar dikurniakan pasangan dan zuriat yang menjadi 'perkara-perkara yang menyukakan hati melihatnya', serta memimpin keluarga yang terikat dengan iman, solat dan kasih sayang.",
    ],
    phrases: [
      {
        title: "Doa memohon rezeki yang halal",
        when: "Pada waktu pagi, selepas solat, dan ketika menghadapi kesempitan wang",
      },
    ],
    appLinks: [{ label: "Doa keluarga dan kehidupan" }],
  },

  // Categories
  {
    title: "Doa-doa Al-Quran",
    summary: "Doa-doa yang diajarkan oleh Allah sendiri di dalam Al-Quran.",
    body: [
      "Doa-doa Al-Quran ialah kata-kata yang Allah letakkan pada lidah para nabi dan orang-orang beriman, lalu dipelihara untuk kita ulangi — ringkas, menyeluruh dan mustahil untuk diperbaiki lagi. Banyak daripadanya bermula dengan 'Rabbana' (Tuhan kami), dan doa-doa ini sangat sesuai untuk dihafal dan dibaca sentiasa.",
      "Secara keseluruhannya, doa-doa ini merangkumi semua keperluan seorang mukmin: keampunan, petunjuk, keteguhan, rahmat, keluarga yang soleh, perlindungan daripada api neraka, dan kejayaan di dunia dan akhirat. Berdoa dengan kalam Allah sendiri ialah antara bentuk doa yang paling meyakinkan.",
    ],
    phrases: [
      {
        title: "Kebaikan di dunia dan akhirat",
        when: "Doa umum untuk segala keperluan — doa yang paling kerap dibaca oleh Nabi ﷺ",
      },
      {
        title: "Keteguhan iman",
        when: "Ketika bimbang akan menyimpang atau selepas mendapat petunjuk",
      },
    ],
    appLinks: [{ label: "Pembaca Al-Quran" }, { label: "Doa-doa Al-Quran" }],
  },
  {
    title: "Doa-doa Nabi ﷺ",
    summary: "Doa-doa yang diajarkan oleh Nabi Muhammad ﷺ dengan sanad yang sahih.",
    body: [
      "Nabi ﷺ dikurniakan 'the most comprehensive speech' (maksud dalam bahasa Inggeris) (jawami' al-kalim), dan doa-doa baginda mencerminkannya: ringkas lafaznya, luas maknanya, dan seimbang dengan sempurna antara keperluan dunia dan akhirat. Doa-doa ini memohon petunjuk, kesucian hati, kesihatan, keampunan, perlindungan dan akhlak yang mulia.",
      "Satu prinsip penting: berpeganglah kepada doa-doa yang sahih dan kukuh sumbernya daripada kitab-kitab hadis yang muktabar, dan elakkan daripada menyebarkan doa-doa yang daif atau palsu dengan ganjaran yang direka-reka. Khazanah Sunnah yang sebenar sudah lebih daripada mencukupi.",
    ],
    phrases: [
      {
        title: "Doa menyeluruh empat perkara",
        when: "Doa harian yang umum",
      },
    ],
    appLinks: [{ label: "Doa-doa Nabi ﷺ" }],
  },
  {
    title: "Zikir dan tasbih",
    summary: "Zikir-zikir ringkas yang besar nilainya dan ganjarannya.",
    body: [
      "Zikir — mengingati Allah — merangkumi tasbih (Subhanallah), tahmid (Alhamdulillah), tahlil (La ilaha illallah), takbir (Allahu Akbar) dan istighfar. Ia antara kalimah yang paling ringan di lidah tetapi paling berat di Mizan (timbangan amal), dan menjadi benteng hati yang hidup daripada kelalaian.",
      "Nabi ﷺ menyifatkan kalimah-kalimah yang 'light on the tongue, heavy on the Scale, beloved to the Most Merciful' (maksud dalam bahasa Inggeris), dan mengajarkan bahawa sesiapa yang membaca 'SubhanAllahi wa bihamdih' seratus kali sehari, dosa-dosanya akan dihapuskan walaupun sebanyak buih di lautan. Jika diamalkan selepas solat dan sepanjang hari, zikir memastikan iman sentiasa hidup.",
    ],
    phrases: [
      {
        title: "Kalimah yang dikasihi dan menghapuskan dosa",
        when: "Sepanjang hari; 100 kali menghapuskan dosa",
      },
      {
        title: "Dua kalimah yang berat di Mizan",
        when: "Pada bila-bila masa",
      },
    ],
    appLinks: [{ label: "Koleksi zikir" }],
  },
  {
    title: "Selawat ke atas Nabi ﷺ",
    summary: "Berselawat ke atas Nabi ﷺ ialah mata air rahmat setiap hari.",
    body: [
      "Berselawat ke atas Nabi ﷺ diperintahkan oleh Allah di dalam Al-Quran — 'Sesungguhnya Allah dan malaikatNya berselawat … kepada Nabi …; wahai orang-orang yang beriman berselawatlah kamu kepadanya serta ucapkanlah salam sejahtera dengan penghormatan yang sepenuhnya' — dan tiada doa lain yang mempunyai balasan yang begitu pasti: Nabi ﷺ bersabda bahawa sesiapa yang berselawat sekali ke atas baginda, Allah berselawat sepuluh kali ke atas orang itu.",
      "Memperbanyakkan selawat mendatangkan rahmat, mengangkat darjat, menghapuskan dosa, dan menjadikan seseorang paling hampir dengan Nabi ﷺ pada Hari Kiamat. Selawat Ibrahimiyyah yang lengkap di bawah — yang baginda ajarkan kepada para Sahabat ketika mereka bertanya cara berselawat ke atas baginda — dibaca dalam tasyahud setiap solat dan amat baik untuk sentiasa membasahi lidah sepanjang hari.",
    ],
    phrases: [
      {
        title: "Selawat Ibrahimiyyah yang lengkap",
        when: "Dalam tasyahud solat dan sepanjang hari",
      },
    ],
    appLinks: [{ label: "Koleksi selawat" }],
  },

  // Reference
  {
    title: "Sumber dan kesahihan",
    summary: "Utamakan Al-Quran dan hadis sahih dengan rujukan yang jelas.",
    body: [
      "Modul ini bersifat pendidikan dan tidak berpihak kepada mana-mana aliran, dibina sepenuhnya di atas Al-Quran dan hadis sahih (sahih/hasan) yang diterima secara meluas, masing-masing dengan rujukan yang boleh dikesan. Piawaian terbaik bagi doa harian ialah tepat seperti ini: teks yang disahkan dengan sumber yang diketahui.",
      "Satu peringatan serius berkaitan doa: banyak doa tersebar di internet dengan lafaz rekaan dan ganjaran yang dibesar-besarkan ('bacalah ini dan semua dosa anda akan lenyap'). Hadis palsu ialah perkara yang berat, maka sahkan dahulu riwayat yang tidak dikenali sebelum mengamalkan atau menyebarkannya.",
      "Untuk hafalan dan amalan harian, utamakan doa-doa sahih yang ringkas yang benar-benar boleh anda amalkan secara berterusan berbanding doa-doa panjang yang akan anda tinggalkan — amalan yang berterusan lebih disukai Allah daripada banyaknya amalan. Apabila mazhab berbeza dalam lafaznya, belajarlah daripada ulama tempatan yang berkelayakan.",
    ],
    actions: [
      "Sahkan sumber sesuatu doa yang tidak dikenali sebelum berkongsinya.",
      "Pilih beberapa doa sahih yang ringkas dan amalkannya setiap hari, berbanding banyak doa yang tidak mampu anda kekalkan.",
      "Gunakan pautan topik dalam aplikasi untuk menggandingkan setiap pelajaran dengan amalan sebenar.",
    ],
    disclaimer:
      "Kandungan pendidikan tidak menggantikan nasihat fiqh yang khusus untuk anda. Rujuklah ulama yang berkelayakan bagi hukum kes-kes tertentu.",
    appLinks: [
      { label: "Perpustakaan doa" },
      { label: "Al-Quran" },
      { label: "Zikir" },
      { label: "Durood" },
    ],
  },
];

export const LEARN_DUA_OCCASIONS_MS: DeepPartial<LearnDuaOccasion>[] = [
  { title: "Zikir pagi", summary: "Mulakan hari dengan zikir" },
  { title: "Zikir petang", summary: "Perlindungan sebelum malam" },
  { title: "Selepas bangun tidur", summary: "Kata-kata pertama ketika terjaga" },
  { title: "Sebelum tidur", summary: "Doa dan zikir untuk waktu malam" },
  { title: "Masuk rumah", summary: "Bismillah dan memberi salam" },
  { title: "Keluar rumah", summary: "Bertawakal ketika keluar" },
  { title: "Masjid", summary: "Masuk dan keluar masjid" },
  { title: "Sebelum & selepas makan", summary: "Kesyukuran ketika makan" },
  { title: "Wuduk", summary: "Sebelum dan selepas berwuduk" },
  { title: "Solat", summary: "Sebelum, semasa dan selepas solat" },
  { title: "Bimbang & risau", summary: "Tenangkan hati dengan doa" },
  { title: "Sakit", summary: "Kesembuhan dan kesabaran" },
  { title: "Keampunan", summary: "Istighfar dan taubat" },
  { title: "Musafir", summary: "Bertolak dan pulang" },
  { title: "Rezeki", summary: "Memohon rezeki yang halal daripada Allah" },
  { title: "Doa-doa Al-Quran", summary: "Doa daripada Kitab Allah" },
];
