import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// ms overlay for new-muslim. Index-aligned with NEW_MUSLIM_TOPICS in ../new-muslim.ts.
export const NEW_MUSLIM_TOPICS_MS: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Selamat Datang ke Islam",
    summary:
      "Peta ringkas dan praktikal untuk hari-hari dan minggu-minggu pertama perjalanan anda.",
    body: [
      "Tahniah — dan selamat datang. Memeluk Islam bukanlah garisan penamat, tetapi permulaan hubungan sepanjang hayat dengan Allah, yang berkembang secara beransur-ansur melalui ilmu, ibadah dan masyarakat, bukan sekali gus. Tiada sesiapa mengharapkan anda mengetahui segala-galanya pada hari pertama; setiap Muslim, termasuk para sahabat Rasulullah ﷺ sendiri, mempelajari agama mereka langkah demi langkah.",
      "Antara ajaran yang paling menenangkan bagi seseorang yang baru mengenali Islam ialah masa lalu anda benar-benar telah ditinggalkan di belakang: 'Do you not know that Islam demolishes what preceded it?' (maksud dalam bahasa Inggeris), sabda Rasulullah ﷺ kepada seorang sahabat yang bimbang tentang dosa-dosa silamnya. Anda bermula dengan lembaran yang bersih di sisi Allah.",
      "Panduan ini merangkumi perkara-perkara asas — maksud syahadah, lima rukun Islam, asas-asas iman, dan pengenalan awal kepada solat — kemudian membawa anda kepada panduan penuh Solat, Akidah, Belajar Doa dan al-Quran dalam aplikasi ini untuk pendalaman yang sebenar. Ikutilah satu bahagian pada satu masa.",
    ],
    hadith: [{}],
    actions: [
      "Ikut rentak anda sendiri — baca satu bahagian panduan ini bagi setiap sesi, bukan semuanya sekali gus.",
      "Catat soalan-soalan yang timbul semasa membaca; bawa soalan itu kepada seorang guru atau rakan yang berilmu kemudian.",
    ],
  },
  {
    title: "Maksud Syahadah",
    summary: "Dua ayat pendek yang membawa keseluruhan makna Islam.",
    body: [
      "Syahadah — penyaksian iman — ialah: 'Ash-hadu an la ilaha illallah, wa ash-hadu anna Muhammadan rasulullah' ('Aku bersaksi bahawa tiada tuhan melainkan Allah, dan aku bersaksi bahawa Muhammad ialah Rasul Allah'). Ia mempunyai dua bahagian, dan kedua-duanya penting.",
      "Bahagian pertama, la ilaha illallah, bermaksud tiada sesiapa dan tiada apa-apa pun — bukan wang, kedudukan, nenek moyang, berhala, atau mana-mana makhluk — yang berhak disembah, ditaati sebagai suatu bentuk pengabdian, atau dijadikan tempat pergantungan mutlak melainkan Allah semata-mata. Ia ialah kenyataan tentang siapa yang berhak disembah, bukan sekadar siapa yang wujud.",
      "Bahagian kedua mengakui bahawa Muhammad ﷺ ialah rasul terakhir Allah, yang diutus dengan petunjuk untuk seluruh manusia. Mengakui hal ini bermakna mempercayai apa yang baginda ﷺ ajarkan tentang Allah, ibadah dan cara menjalani kehidupan — dan itulah sebabnya al-Quran dan ajaran baginda yang sahih (Sunnah) menjadi dua sumber yang dirujuk oleh keseluruhan panduan ini.",
      "Penyaksian ini bukanlah jampi ajaib, tetapi gambaran tentang keyakinan hati yang teguh. Mengucapkannya dengan ikhlas, sambil memahami maknanya, itulah yang menjadikan seseorang itu Muslim — 'orang yang berserah diri.'",
    ],
    appLinks: [{ label: "Belajar Akidah — beriman kepada Allah" }],
  },
  {
    title: "Memeluk Islam",
    summary:
      "Mengucapkan syahadah dengan ikhlas — disertai kefahaman dan niat — itulah yang dikira.",
    body: [
      "Tiada paderi, upacara, bayaran atau dokumen yang diperlukan untuk memeluk Islam. Yang diperlukan ialah keikhlasan: memahami maksud syahadah dan mengucapkannya dengan niat untuk menerimanya sebagai kepercayaan anda, antara anda dengan Allah.",
      "Ramai orang memilih untuk mengucapkannya di hadapan orang lain — imam tempatan, jemaah masjid, atau rakan-rakan — kerana ia memberikan saksi kepada detik itu dan menghubungkan anda dengan rangkaian sokongan sejak hari pertama; ini ialah amalan yang digalakkan secara meluas, bukan syarat ketat bagi penyaksian itu sendiri.",
      "Sesetengah saudara baru juga mandi (ghusl — mandian seluruh badan secara syarak) sekitar waktu ini sebagai permulaan baharu yang simbolik dan praktikal sebelum belajar solat; amalan dan pandangan tentang bila dan bagaimana tepatnya berbeza antara masyarakat, jadi tanyalah guru tempatan tentang kebiasaan di tempat anda daripada meneka.",
      "Jika anda masih meneroka dan belum yakin, itu ialah peringkat yang biasa dan dihormati — bacalah, bertanyalah, dan ambillah masa anda. Penyaksian ini sepatutnya diucapkan dengan keyakinan, bukan di bawah tekanan.",
    ],
    actions: [
      "Jika anda sudah bersedia, pertimbangkan untuk mengucapkan syahadah di hadapan imam tempatan, jemaah masjid, atau rakan-rakan Muslim yang dipercayai.",
      "Tanyakan kepada masjid atau guru tempatan tentang langkah seterusnya yang menjadi kebiasaan (seperti mandi) dalam masyarakat anda.",
    ],
  },
  {
    title: "Lima Rukun Islam",
    summary: "Islam berdiri di atas lima ibadah asas, yang disebut bersama oleh Rasulullah ﷺ.",
    body: [
      "Rasulullah ﷺ meringkaskan struktur amalan Islam dalam satu hadis: Islam dibina di atas lima rukun — bersaksi bahawa tiada tuhan melainkan Allah dan bahawa Muhammad ialah Rasul-Nya (syahadah); mendirikan solat lima waktu sehari (solat); menunaikan sedekah tahunan yang wajib (zakat); berpuasa pada bulan Ramadan; dan menunaikan haji ke Makkah sekurang-kurangnya sekali, bagi mereka yang mampu.",
      "Bayangkan ia seperti sebuah rumah: syahadah ialah asas tempat segala-galanya berdiri, dan empat yang lain ialah tiang-tiang yang menyokong binaan itu — ibadah yang tetap (solat), pemberian yang tetap (zakat), sebulan latihan disiplin diri setiap tahun (puasa), dan ibadah haji sekali seumur hidup (haji) bagi mereka yang mempunyai kesihatan dan kemampuan untuk bermusafir.",
      "Anda tidak perlu menguasai kelima-limanya dengan segera. Tentang syahadah, anda sudah pun mempelajarinya; solat dibincangkan seterusnya dalam panduan ini; zakat dan puasa dipelajari secara beransur-ansur apabila tibanya setiap tahun; haji dirancang untuk kemudian hari apabila keadaan mengizinkan.",
    ],
    hadith: [{}],
  },
  {
    title: "Sepintas Lalu: Zakat, Puasa dan Haji",
    summary: "Tiga rukun yang datang seiring masa — anda tidak perlu melaksanakannya hari ini.",
    body: [
      "Zakat ialah kewajipan tahunan — peratusan kecil yang tetap — ke atas simpanan dan harta yang layak melebihi had minimum (nisab), yang diberikan kepada golongan tertentu yang memerlukan. Ia biasanya menjadi relevan selepas anda memegang simpanan selama kira-kira setahun, jadi tidak perlu tergesa-gesa; panduan Zakat dalam aplikasi ini menerangkan butiran penuhnya apabila anda memerlukannya.",
      "Berpuasa Ramadan bermaksud menahan diri daripada makan, minum dan hubungan suami isteri dari sebelum fajar hingga terbenam matahari selama satu bulan qamari setiap tahun, di samping solat tambahan dan bacaan al-Quran. Ia ialah rukun yang mencabar tetapi sangat bermakna, dan kebanyakan saudara baru membiasakan diri dengannya secara beransur-ansur dengan bimbingan masyarakat mereka, bukan bersendirian.",
      "Haji ialah ibadah ke Makkah, yang wajib sekali seumur hidup hanya bagi mereka yang mampu dari segi fizikal dan kewangan untuk melakukan perjalanan tersebut. Jika ia belum dalam kemampuan anda sekarang, tiada beban ke atas anda — Allah hanya menuntut apa yang mampu diberikan oleh seseorang.",
    ],
    appLinks: [{ label: "Panduan Zakat" }],
  },
  {
    title: "Bagaimana Rukun Islam Membentuk Kehidupan Harian",
    summary:
      "Lima rukun Islam menjadikan kepercayaan suatu rentak yang benar-benar dihayati, hari demi hari dan tahun demi tahun.",
    body: [
      "Antara perkara yang sering dirasakan paling indah oleh saudara baru ialah bagaimana rukun-rukun ini membina suatu rentak dalam kehidupan biasa: lima jeda singkat untuk solat setiap hari, satu musim puasa dan muhasabah setiap tahun, satu amalan memberi setiap tahun, dan — akhirnya — ibadah haji sekali seumur hidup. Tiada satu pun daripadanya teologi yang abstrak; semuanya dihayati.",
      "Rentak ini bertujuan untuk berterusan, bukan membebankan. Rasulullah ﷺ mengajarkan bahawa amalan yang paling dicintai oleh Allah ialah amalan yang dilakukan secara berterusan, walaupun sedikit — bukan semangat yang membuak-buak secara tiba-tiba lalu padam. Binalah tabiat kecil yang konsisten terlebih dahulu; kedalaman akan datang seiring masa.",
    ],
    hadith: [{}],
    actions: [
      "Pilih satu tabiat kecil yang mampu dikekalkan untuk dimulakan minggu ini, daripada cuba melakukan segala-galanya sekali gus.",
    ],
  },
  {
    title: "Enam Rukun Iman",
    summary:
      "Apa yang dipercayai oleh seorang Muslim, dalam enam perkara yang diajarkan terus oleh Rasulullah ﷺ.",
    body: [
      "Jika lima rukun Islam ialah apa yang dilakukan oleh seorang Muslim, enam rukun iman pula ialah apa yang dipercayainya. Ia datang daripada Hadis Jibril, iaitu ketika malaikat Jibril, dalam rupa seorang lelaki, meminta Rasulullah ﷺ menerangkan tentang iman di hadapan para sahabat yang berhimpun.",
      "Rasulullah ﷺ menjawab: beriman kepada Allah; kepada para malaikat-Nya; kepada kitab-kitab yang diturunkan-Nya; kepada para rasul-Nya; kepada Hari Akhirat; dan kepada qada dan qadar (takdir) — yang baik dan yang pahit. Keenam-enam ini membentuk satu gambaran realiti yang saling berkait: siapa yang menciptakan anda, siapa yang mengatur alam ghaib, bagaimana petunjuk sampai kepada manusia, siapa yang menyampaikannya, ke mana arah kehidupan ini, dan bagaimana menghadapi kesenangan serta kesusahan dengan bertawakal kepada Allah.",
      "Anda tidak perlu menguasai falsafah di sebalik setiap rukun itu hari ini — panduan Akidah dalam aplikasi ini menghuraikan keenam-enamnya secara mendalam, berserta dalil bagi setiap satu, apabila anda bersedia untuk mendalaminya.",
    ],
    hadith: [{}],
    appLinks: [{ label: "Belajar Akidah — enam rukun iman" }],
  },
  {
    title: "Siapakah Allah?",
    summary:
      "Tuhan Yang Esa, tanpa sekutu, tanpa tandingan, dan tidak berhajat kepada sesuatu — disifatkan dengan nama-nama-Nya yang indah.",
    body: [
      "Allah ialah nama khas bagi Tuhan dalam Islam — bukan tuhan yang lain, tetapi Pencipta Yang Maha Esa yang sama yang ditunjukkan oleh kitab-kitab terdahulu, kini dikenali dengan nama yang dipilih-Nya sendiri dan disifatkan melalui sifat-sifat-Nya yang diwahyukan, bukan melalui sangkaan manusia.",
      "Gambaran ringkas yang paling jelas dalam al-Quran ialah Surah al-Ikhlas: Dia Maha Esa; Dia tidak mempunyai sekutu dan tiada tandingan; Dia tidak beranak dan tidak diperanakkan. Allah tidak mempunyai jasad yang boleh dibayangkan dan tiada gambar yang boleh dibuat untuk mewakili-Nya — mengenali-Nya adalah melalui nama-nama-Nya (seperti Yang Maha Pengasih, Yang Maha Mengetahui, Yang Maha Mendengar) dan perbuatan-Nya dalam ciptaan, bukan melalui gambar atau perbandingan fizikal.",
      "Mengenali Allah melalui nama-nama-Nya sering menjadi bahagian yang paling menenangkan jiwa pada awal beriman: semakin anda mengenali sifat-Nya, semakin solat dan pergantungan harian kepada-Nya terasa peribadi, bukan sekadar rutin.",
    ],
    appLinks: [{ label: "Asmaul Husna" }],
  },
  {
    title: "Al-Quran dan Risalah Terakhir",
    summary:
      "Al-Quran ialah kalam Allah sendiri, terpelihara tanpa sebarang perubahan sejak ia diturunkan.",
    body: [
      "Umat Islam percaya bahawa al-Quran ialah kalam Allah secara harfiah, yang diwahyukan kepada Nabi Muhammad ﷺ dalam tempoh kira-kira 23 tahun, dan terpelihara kata demi kata sejak itu — dihafaz oleh generasi demi generasi umat Islam dan tidak pernah diubah.",
      "Ia bukan biografi Rasulullah ﷺ atau buku sejarah, walaupun ia mengandungi petunjuk dan kisah para nabi terdahulu; ia terutamanya kitab petunjuk untuk dibaca, dialunkan, direnungi dan diamalkan, sedikit demi sedikit.",
      "Anda tidak perlu membaca bahasa Arab untuk bermula. Mulakan dengan terjemahan dalam bahasa yang anda fahami, mengikut susunan yang menarik minat anda, dan biarkan kebiasaan dengan bacaan Arabnya berkembang secara beransur-ansur seiring dengan solat anda.",
    ],
    appLinks: [{ label: "Baca al-Quran" }],
  },
  {
    title: "Cara Bersolat — Gambaran Keseluruhan",
    summary:
      "Lima solat ringkas sehari, setiap satunya mengikut urutan tetap berdiri, rukuk dan sujud.",
    body: [
      "Solat ditunaikan lima kali sehari dalam waktu-waktu yang ditetapkan — Subuh (fajar), Zohor (tengah hari), Asar (petang), Maghrib (terbenam matahari) dan Isyak (malam) — dan hanya mengambil masa beberapa minit setiap kali selepas anda mengetahui polanya. Waktu solat dan penjejak dalam aplikasi ini akan menunjukkan dengan tepat bila setiap waktu bermula di tempat anda.",
      "Setiap solat terdiri daripada unit yang dipanggil rakaat (Subuh dua, Zohor/Asar/Isyak empat, Maghrib tiga), dan setiap rakaat mengikut bentuk asas yang sama: berdiri sambil membaca, rukuk, dan dua kali sujud, dengan lafaz pujian dan bacaan al-Quran yang tetap pada setiap kedudukan.",
      "Sebelum solat, anda mengambil wuduk — basuhan ringkas secara syarak bagi tangan, mulut, muka, lengan, kepala dan kaki — dan anda solat menghadap ke arah Kaabah di Makkah (kiblat), yang juga boleh ditunjukkan oleh aplikasi ini.",
      "Gambaran ini sengaja dibuat secara umum. Lafaz tepat yang dibaca pada setiap kedudukan, arahan langkah demi langkah ala video, dan kursus penuh untuk pemula semuanya terdapat dalam panduan Solat khusus — mulakan di sana selepas ini, dan gunakan panduan bacaan bersamanya untuk mempelajari lafaz berserta transliterasi dan terjemahan.",
    ],
    appLinks: [
      { label: "Belajar Solat — panduan penuh" },
      { label: "Bacaan solat (dengan transliterasi)" },
    ],
  },
  {
    title: "Wuduk: Bersedia untuk Solat",
    summary:
      "Basuhan ringkas secara syarak yang menyediakan tubuh dan hati untuk berdiri di hadapan Allah.",
    body: [
      "Wuduk diwajibkan sebelum setiap solat (kecuali jika wuduk anda yang sebelumnya masih sah) dan mengikut tertib yang tetap: membasuh tangan, berkumur dan memasukkan air ke hidung, membasuh muka, membasuh tangan hingga ke siku, menyapu kepala dan telinga, dan membasuh kaki hingga ke buku lali.",
      "Ia tidak mengambil masa yang lama selepas dipelajari — kebanyakan orang dapat menyelesaikannya dalam masa kurang daripada dua minit — dan ia turut membawa makna rohani: setiap anggota yang dibasuh, dalam riwayat-riwayat hadis, dikaitkan dengan gambaran dosa-dosa kecil yang turut gugur bersamanya.",
      "Panduan Bersuci (Taharah) penuh dalam aplikasi ini menghuraikan wuduk langkah demi langkah, termasuk apa yang perlu dilakukan jika anda ragu-ragu sama ada wuduk anda masih sah.",
    ],
    appLinks: [{ label: "Panduan Bersuci (Taharah)" }],
  },
  {
    title: "Mempelajari Bacaan Solat",
    summary:
      "Mulakan dengan transliterasi dan maknanya; kefasihan bahasa Arab datang melalui pengulangan dari semasa ke semasa.",
    body: [
      "Solat ditunaikan dalam bahasa Arab, dan ini mungkin terasa sebagai bahagian yang paling sukar pada mulanya — tetapi anda tidak diharapkan fasih untuk bermula. Kebanyakan saudara baru bermula dengan mempelajari beberapa lafaz pendek yang penting (takbir pembukaan, satu surah pendek, bacaan ketika rukuk dan sujud, dan salam penutup) dengan transliterasi dan terjemahan di samping teks Arab.",
      "Hafazkan lafaz-lafaz ini sedikit demi sedikit, bukan semuanya sekali gus, dan ulanginya setiap hari — ingatan terhadap bacaan solat terbina dengan cepat melalui pengulangan solat itu sendiri, walaupun sebelum anda sengaja cuba menghafaz apa-apa.",
      "Panduan bacaan khusus dalam aplikasi ini memberikan setiap lafaz penting dalam teks Arab, transliterasi dan terjemahan bersama-sama, disusun mengikut tempat setiap satunya dibaca dalam solat — gunakannya sebagai alat latihan harian anda.",
    ],
    appLinks: [{ label: "Panduan bacaan solat" }],
  },
  {
    title: "Senarai Semak Langkah Pertama Anda",
    summary:
      "Susunan yang mudah dan realistik untuk mempelajari sesuatu dalam minggu-minggu pertama anda.",
    body: [
      "Tiada satu susunan wajib untuk belajar selepas mengucap syahadah, tetapi saudara baru sering mendapati urutan kasar membantu supaya tiada apa yang terasa membebankan sekali gus. Gunakan ini sebagai panduan longgar, bukan perlumbaan.",
    ],
    actions: [
      "Pelajari wuduk (basuhan secara syarak) dan latihlah sehingga ia terasa biasa.",
      "Pelajari lafaz-lafaz penting bagi satu solat penuh menggunakan panduan bacaan.",
      "Mulakan solat lima waktu, walaupun belum sempurna pada mulanya — konsistensi lebih penting daripada kesempurnaan pada peringkat awal.",
      "Pelajari beberapa doa harian yang pendek untuk bangun tidur, makan dan keluar rumah.",
      "Cari masjid tempatan atau komuniti dalam talian untuk sokongan dan bertanya soalan.",
      "Mula membaca al-Quran dalam terjemahan, sedikit setiap hari.",
      "Beritahu seseorang yang anda percayai — keluarga atau rakan rapat — apabila anda rasa bersedia, mengikut rentak anda sendiri.",
    ],
  },
  {
    title: "Mencari Komuniti",
    summary:
      "Belajar bersama Muslim lain menjadikan perjalanan ini lebih mudah dan lebih menggembirakan.",
    body: [
      "Islam bertujuan untuk dihayati dalam masyarakat, bukan hanya secara peribadi. Solat berjemaah, masjid tempatan dan rakan-rakan Muslim boleh menjawab soalan-soalan harian ('bagaimana saya membaca ini dalam solat jika saya terlupa?'), memberikan dorongan, dan menjadikan anda kurang berasa keseorangan dalam pengalaman baharu.",
      "Jika anda tidak pasti di mana hendak bermula, kebanyakan masjid menyambut saudara baru dengan mesra dan sering ada seseorang yang memang gembira membantu pendatang baharu dengan perkara-perkara asas — bertanya ialah perkara biasa dan dijangka, bukan sesuatu yang janggal.",
      "Jika masjid tidak dapat dikunjungi secara bersemuka buat masa ini, komuniti dalam talian dan panduan-panduan dalam aplikasi ini boleh merapatkan jurang sehingga anda menemuinya, atau secara kekal jika itulah keadaan anda — walau bagaimanapun, anda tetap sepenuhnya sebahagian daripada masyarakat Islam yang lebih luas (ummah).",
    ],
    actions: [
      "Cari masjid atau pusat Islam berhampiran anda dan pertimbangkan untuk berkunjung pada waktu solat atau ketika ada majlis.",
      "Jika komuniti bersemuka belum dapat diakses, carilah komuniti Muslim dalam talian yang diselia untuk mendapatkan sokongan.",
    ],
  },
  {
    title: "Terus Belajar",
    summary:
      "Panduan ini ialah titik permulaan — tiga panduan yang lebih mendalam sedia apabila anda bersedia.",
    body: [
      "Selepas perkara-perkara asas dalam panduan ini terasa selesa, tiga panduan pendamping dalam aplikasi ini dibina untuk membawa anda lebih mendalam: Akidah untuk huraian penuh setiap rukun iman, Belajar Doa untuk doa-doa bagi saat-saat harian, dan pembaca al-Quran untuk bacaan dan renungan harian.",
      "Anda tidak perlu menghabiskan mana-mana panduan itu dengan cepat. Islam dipelajari sepanjang hayat, dan kembali kepada topik yang sama beberapa bulan atau tahun kemudian, dengan lebih banyak pengalaman, adalah perkara yang biasa — malah memang dijangka.",
    ],
    appLinks: [{ label: "Belajar Akidah" }, { label: "Belajar Doa" }, { label: "Baca al-Quran" }],
  },
  {
    title: "Soalan Lazim: Kesilapan Biasa pada Peringkat Awal",
    summary: "Semua orang bermula dengan tidak sempurna — begini cara melihat kesilapan awal.",
    body: [
      "S: Saya selalu tersilap dalam bahagian-bahagian solat atau terlupa bacaannya — adakah itu masalah? J: Tidak. Semua orang terlupa bacaan dan tersilap langkah semasa belajar; teruskan berlatih dengan panduan bacaan dan ia akan menjadi biasa dalam beberapa minggu. Keikhlasan semasa belajar jauh lebih penting daripada kesempurnaan pada peringkat awal.",
      "S: Saya rasa bersalah kerana tidak melakukan semuanya (puasa, solat sunat, menghafaz al-Quran) dengan segera. J: Cuba melakukan segala-galanya sekali gus ialah kesilapan biasa saudara baru yang sering membawa kepada keletihan. Jadikan solat lima waktu sebagai tabiat tetap pertama anda, kemudian tambahlah secara beransur-ansur — Allah tidak membebankan seseorang melainkan sesuai dengan kemampuannya.",
      "S: Bagaimana jika saya tertinggal solat atau melakukan kesilapan di dalamnya? J: Tertinggal solat sesekali semasa anda masih membiasakan diri dengan rutinnya, atau melakukan kesilapan kecil di dalamnya, bukanlah pengakhiran segala-galanya — gantikannya (qada) apabila anda teringat, teruskan, dan jangan biarkan sesuatu kegagalan menghalang anda daripada menunaikan solat yang seterusnya.",
    ],
    actions: [
      "Apabila anda melakukan kesilapan, anggaplah ia sebahagian biasa daripada proses belajar, bukan alasan untuk berputus asa.",
    ],
  },
  {
    title: "Soalan Lazim: Perlukah Saya Belajar Bahasa Arab?",
    summary:
      "Bahasa Arab berkembang bersama anda selama bertahun-tahun — ia bukan syarat untuk mula beramal.",
    body: [
      "S: Perlukah saya bertutur dalam bahasa Arab sebelum boleh solat atau membaca al-Quran? J: Tidak. Anda boleh mula solat dengan beberapa lafaz pendek yang ditransliterasikan hari ini, dan membaca al-Quran dalam bahasa anda sendiri sementara bacaan Arab anda berkembang dari semasa ke semasa melalui pengulangan.",
      "S: Adakah tidak menghormati jika saya tersalah sebut bahasa Arab semasa belajar? J: Tidak — setiap qari, dalam setiap generasi, bermula sebagai pemula. Usaha semasa belajar amat dihargai; kesempurnaan ialah matlamat jangka panjang, bukan syarat untuk bermula.",
      "S: Patutkah saya menyertai kelas untuk belajar membaca bahasa Arab (untuk solat, tidak semestinya untuk perbualan)? J: Ramai saudara baru mendapati kelas membaca al-Quran yang ringkas (asas tajwid) sangat bermanfaat selepas perkara-perkara asas solat terasa selesa — ia ialah langkah seterusnya yang baik, bukan langkah pertama.",
    ],
    actions: [
      "Teruskan menggunakan transliterasi dan terjemahan di samping teks Arab sehingga bacaan terasa biasa — tiada tarikh akhir.",
    ],
  },
  {
    title: "Soalan Lazim: Keluarga dan Perhubungan",
    summary:
      "Berbuat baik kepada keluarga tetap menjadi kewajipan, walaupun kepercayaan kini berbeza.",
    body: [
      "S: Keluarga saya bukan Muslim dan saya bimbang tentang reaksi mereka — apakah yang Islam tuntut daripada saya dalam hal ini? J: Berbuat baik kepada ibu bapa dan keluarga diperintahkan dalam al-Quran walaupun kepercayaan berbeza: '…maka janganlah engkau taat kepada mereka [dalam perkara yang menjejaskan iman anda]; dan bergaulah dengan mereka di dunia dengan cara yang baik.' Iman baharu anda sepatutnya jelas menjadikan anda lebih lembut dan lebih berbakti kepada keluarga, bukan sebaliknya.",
      "S: Bagaimana saya memberitahu keluarga, atau menangani perselisihan, tanpa ia menjadi krisis? J: Tiada satu cara yang betul — rentak, masa dan sejauh mana untuk berkongsi bergantung kepada keluarga dan keselamatan anda sendiri. Ini benar-benar keputusan peribadi; berbincang terlebih dahulu dengan imam tempatan yang dipercayai, kaunselor, atau kumpulan sokongan saudara baru yang berpengalaman sebelum perbualan yang sukar adalah lebih bijak daripada menghadapinya sepenuhnya bersendirian.",
      "S: Adakah saya wajib memutuskan hubungan dengan keluarga atau rakan-rakan bukan Muslim? J: Tidak — mengekalkan hubungan yang baik dan memuliakan ikatan kekeluargaan tetap menjadi kewajipan dalam Islam. Batasan berkaitan amalan tertentu (contohnya, perayaan atau aktiviti tertentu) ialah perkara berasingan yang bersifat peribadi, dan sebaiknya dibincangkan dengan guru tempatan yang berilmu dan memahami keadaan anda.",
    ],
    disclaimer:
      "Soalan lazim ini menawarkan panduan umum, bukan fatwa, untuk soalan-soalan biasa pada peringkat awal. Bagi keadaan keluarga, keselamatan atau peribadi anda yang khusus, sila berbincang dengan imam tempatan, kaunselor yang bertauliah, atau orang tua masyarakat yang dipercayai.",
  },
];
