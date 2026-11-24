import type { TaharahChecklistItem, TaharahTopic } from "../../types/taharah";
import type { DeepPartial } from "./localize";

// Malay (Malaysia) translation overlay for the Learn Taharah content. Mirrors the order of TAHARAH_TOPICS in ../taharah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations, grades and Qur'an verse labels stay in the English source.
export const TAHARAH_TOPICS_MS: DeepPartial<TaharahTopic>[] = [
  {
    title: "Pengenalan kepada Taharah",
    summary: "Bersuci ialah pintu kepada solat dan separuh daripada iman seorang mukmin.",
    body: [
      "Taharah (طهارة) bermaksud bersuci — membebaskan badan, pakaian dan tempat solat daripada hadas dan najis supaya seorang Muslim dapat berdiri di hadapan Allah dalam keadaan yang diterima-Nya. Inilah perkara pertama yang dipelajari oleh setiap penuntut ilmu ibadah, kerana tanpanya tiada solat yang sah: Nabi ﷺ bersabda, 'Kunci solat ialah bersuci.'",
      "Bersuci dalam Islam mempunyai dua dimensi. Dimensi zahir ialah kebersihan yang nyata — membasuh, menghilangkan kekotoran dan menjaga kebersihan. Dimensi batin ialah rasa rendah diri, kesedaran dan kesediaan hati yang sepatutnya dibangkitkan oleh basuhan itu. Nabi ﷺ menghubungkan kedua-duanya apabila baginda menyebut bersuci sebagai 'separuh daripada iman', menggandingkan kebersihan fizikal dengan penyucian jiwa daripada dosa.",
      "Modul ini membincangkan keseluruhan tajuk mengikut urutan: air yang digunakan untuk bersuci, wuduk (bersuci daripada hadas kecil), mandi wajib (mandi seluruh badan mengikut syarak), tayamum (bersuci tanpa air apabila air tidak dapat digunakan), najis (menghilangkan kekotoran fizikal), serta keadaan khas dan rukhsahnya. Pelajarinya sekali dengan teliti, dan solat menjadi ibadah yang dapat anda masuki dengan yakin, bukan dengan ragu-ragu.",
    ],
    quran: [
      {
        excerpt:
          "Wahai orang-orang yang beriman, apabila kamu bangun hendak mendirikan solat, maka basuhlah muka kamu dan tangan kamu hingga ke siku, sapulah kepala kamu, dan basuhlah kaki kamu hingga ke buku lali.",
      },
      {
        excerpt:
          "Sesungguhnya Allah mengasihi orang-orang yang banyak bertaubat dan mengasihi orang-orang yang menyucikan diri.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kunci solat ialah bersuci; permulaannya ialah takbir dan penutupnya ialah salam. (Ali; juga Jami' at-Tirmizi 3)",
      },
    ],
    actions: [
      "Jadikan bersuci sebagai persediaan untuk menghadap Allah, bukan rutin yang dilakukan secara tergesa-gesa.",
      "Pelajari satu tajuk taharah setiap hari sehingga keseluruhan alirannya terasa semula jadi.",
    ],
    appLinks: [{ label: "Pusat Belajar Solat" }],
  },
  {
    title: "Kepentingan Bersuci",
    summary: "Kesucian ialah syarat wajib bagi solat dan tanda seorang mukmin.",
    body: [
      "Bersuci bukanlah satu pilihan antara banyak pilihan — ia ialah syarat sah solat. Allah tidak menerima solat seseorang yang berada dalam keadaan berhadas sehingga dia bersuci. Oleh sebab itu, solat yang dikerjakan tanpa wuduk atau mandi wajib yang sah mesti diulang, walau seikhlas mana pun ia dilakukan.",
      "Nabi ﷺ mengangkat bersuci sebagai sifat yang menandakan seorang mukmin, dengan menyebutnya 'separuh daripada iman'. Bersuci secara tetap mendisiplinkan seseorang, menjadikannya hampir sentiasa bersedia untuk beribadah, dan — sebagaimana yang diajar oleh hadis — benar-benar menggugurkan dosa-dosa kecil bersama air.",
      "Oleh kerana ia menjaga solat, taharah juga menjaga seorang mukmin daripada dosa menunaikan solat yang tidak sah akibat kecuaian. Maka, mempelajari hukum-hakamnya dengan baik ialah satu usaha memelihara salah satu amalan terbesar dalam Islam.",
    ],
    hadith: [
      {
        excerpt: "Bersuci itu separuh daripada iman. (Abu Malik al-Asy'ari)",
      },
      {
        excerpt:
          "Allah tidak menerima solat tanpa bersuci, dan tidak menerima sedekah daripada harta yang dicuri. (Ibnu 'Umar)",
      },
    ],
    actions: [
      "Sebelum setiap solat, pastikan keadaan suci anda sebelum memulakannya.",
      "Simpan senarai semak ringkas dalam fikiran: badan, pakaian, tempat dan wuduk.",
    ],
  },
  {
    title: "Jenis-jenis Kesucian",
    summary: "Tiga keadaan yang perlu diketahui: hadas kecil, hadas besar dan najis fizikal.",
    body: [
      "Syariat Islam membezakan tiga perkara yang mungkin perlu anda sucikan diri daripadanya, dan setiap satu mempunyai cara penyelesaiannya sendiri. Mengetahui keadaan yang sedang anda alami ialah kunci untuk memilih kaedah yang betul.",
      "Hadas kecil (hadath asghar) berpunca daripada perkara biasa seperti membuang air, keluar angin atau tidur lena. Ia diangkat dengan wuduk, atau dengan tayamum apabila air tidak dapat digunakan.",
      "Hadas besar (hadath akbar, juga dipanggil janabah) berpunca daripada hubungan suami isteri, keluarnya mani, dan berakhirnya haid atau nifas. Ia diangkat dengan mandi wajib, iaitu mandi seluruh badan mengikut syarak — dan sekali lagi tayamum menjadi penggantinya apabila air tiada atau memudaratkan.",
      "Kekotoran fizikal (najis) — seperti air kencing, tahi atau darah yang mengalir — ialah perkara yang berasingan: ia mesti dihilangkan secara fizikal daripada badan, pakaian dan tempat solat, tanpa mengira keadaan hadas anda. Keempat-empat mazhab Sunni bersepakat tentang tiga kategori ini, dan hanya berbeza dalam sebahagian butiran tentang perkara yang membatalkan kesucian atau kadar sisa yang dimaafkan.",
    ],
    quran: [
      {
        excerpt:
          "Dan jika kamu berjunub, maka bersucilah. Tetapi jika kamu sakit atau dalam musafir… lalu kamu tidak mendapat air, maka bertayamumlah dengan tanah yang bersih.",
      },
    ],
    actions: [
      "Kenal pasti keadaan anda dahulu (hadas kecil, hadas besar atau najis), kemudian gunakan kaedah yang betul.",
      "Apabila tidak pasti tentang butirannya, ikutilah seorang guru yang berkelayakan daripada mazhab yang diiktiraf secara konsisten.",
    ],
  },
  {
    title: "Air dalam Islam",
    summary:
      "Air yang suci ialah alat bersuci yang utama — digunakan dengan sempurna, tetapi jangan sekali-kali dibazirkan.",
    body: [
      "Cara asal untuk bersuci ialah dengan air. Allah menyifatkan hujan sebagai diturunkan dalam keadaan 'suci lagi menyucikan' (tahur) — mampu membersihkan dan boleh digunakan untuk ibadah. Mana-mana air yang bersih secara semula jadi — air hujan, sungai, laut, mata air, perigi atau paip — adalah menyucikan selagi warna, rasa atau baunya tidak berubah kerana bercampur dengan najis.",
      "Para fuqaha membahagikan air secara terperinci (suci lagi menyucikan, suci tetapi tidak menyucikan, dan najis), tetapi kaedah praktikal untuk kehidupan seharian adalah mudah: air kekal sesuai untuk wuduk dan mandi wajib melainkan jelas telah berubah kerana najis. Apabila benar-benar ragu sedangkan ada pilihan lain yang bersih, gunakanlah pilihan itu.",
      "Islam mengajar kesempurnaan tanpa berlebih-lebihan. Nabi ﷺ membasuh dengan sempurna tetapi menggunakan air yang sangat sedikit — kira-kira satu mud (dua tadahan tangan) untuk wuduk dan satu sa' (lebih kurang empat mud) untuk mandi wajib yang lengkap. Membazir air tidak digalakkan walaupun air banyak, kerana bersederhana itu sendiri sebahagian daripada adab ibadah.",
    ],
    quran: [
      {
        excerpt: "Dan Kami turunkan dari langit air yang suci.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Nabi ﷺ biasa berwuduk dengan satu mud air dan mandi dengan satu sa' hingga lima mud. (Anas; juga Sahih Muslim 325 — sunnah bersederhana)",
      },
    ],
    actions: [
      "Gunakan air secukupnya untuk membasuh dengan sempurna, tetapi perlahankan paip dan elakkan pembaziran.",
      "Jika sesuatu sumber air kelihatan atau berbau berubah kerana najis, carilah sumber yang jelas bersih yang terdekat.",
    ],
    disclaimer:
      "Riwayat yang sering dipetik 'jangan membazir air walaupun di sungai yang mengalir' (Ibnu Majah 425) dinilai lemah (da'if) oleh kebanyakan ulama; sunnah bersederhana sebaliknya disabitkan melalui hadis mud/sa' di atas.",
  },
  {
    title: "Apakah Wuduk?",
    summary: "Bersuci yang mengangkat hadas kecil sebelum beribadah.",
    body: [
      "Wuduk (وضوء) ialah membasuh anggota tertentu, mengikut susunan tertentu, untuk mengangkat hadas kecil. Empat basuhan wajibnya disebut secara langsung dalam al-Quran (5:6): muka, tangan hingga ke siku, menyapu kepala, dan kaki hingga ke buku lali.",
      "Ia diwajibkan sebelum setiap solat — melainkan anda masih dalam keadaan berwuduk daripada solat sebelumnya — dan, menurut majoriti ulama, sebelum melakukan tawaf mengelilingi Kaabah dan sebelum menyentuh naskhah fizikal (mushaf) al-Quran.",
      "Wuduk ialah ibadah tersendiri, bukan sekadar persediaan. Nabi ﷺ memberi peringatan bahawa 'Allah tidak menerima solat seseorang daripada kamu yang berhadas sehingga dia berwuduk semula' — maka menjaga wuduk bererti menjaga solat itu sendiri.",
    ],
    hadith: [
      {
        excerpt:
          "Allah tidak menerima solat seseorang daripada kamu yang berhadas sehingga dia berwuduk. (Abu Hurairah)",
      },
    ],
    appLinks: [{ label: "Wuduk dalam panduan Solat" }],
  },
  {
    title: "Syarat Sah Wuduk",
    summary: "Niat, air yang suci dan kulit yang tidak terhalang — prasyarat wuduk yang sah.",
    body: [
      "Beberapa syarat (syurut) mesti dipenuhi agar wuduk dikira sah. Orang itu mestilah seorang Muslim yang berakal, yang berniat bersuci untuk ibadah (niat). Sebahagian mazhab menggolongkan niat sebagai rukun perbuatan itu dan sebahagian lagi sebagai syarat, tetapi semuanya bersepakat bahawa ia diperlukan untuk mendapat pahala dan, bagi kebanyakannya, untuk sahnya wuduk.",
      "Air yang digunakan mestilah suci lagi menyucikan. Yang paling penting, air itu mesti benar-benar sampai ke kulit — maka apa-apa yang membentuk lapisan kalis air pada sesuatu anggota (cat tebal, pengilat kuku, lilin, gam) mesti dibuang terlebih dahulu, jika tidak basuhan di bawahnya tidak sah. Kotoran biasa atau kesan inai yang tidak menghalang air bukanlah masalah.",
      "Mazhab Syafie dan Hanbali juga mensyaratkan agar basuhan dilakukan mengikut tertib al-Quran (tartib), dan mazhab Maliki dan Hanbali mensyaratkan agar basuhan dilakukan berturut-turut tanpa selang yang lama sehingga anggota menjadi kering (muwalat). Mazhab Hanafi mengira kedua-duanya sebagai sunat. Ikutilah kaedah satu mazhab supaya konsisten.",
    ],
    quran: [
      {
        excerpt:
          "Basuhlah muka kamu dan tangan kamu hingga ke siku, sapulah kepala kamu, dan basuhlah kaki kamu hingga ke buku lali.",
      },
    ],
    actions: [
      "Tanggalkan pengilat kuku, cincin yang menghalang air, dan apa-apa yang menutup kulit sebelum berwuduk.",
      "Lakukan wuduk dengan tenang dalam satu aliran supaya tiada anggota yang tertinggal atau sempat kering.",
    ],
  },
  {
    title: "Perbuatan Wajib dalam Wuduk",
    summary: "Rukun-rukun al-Quran (fara'id) yang tanpanya wuduk tidak sah.",
    body: [
      "Perbuatan wajib wuduk (fara'idnya) ialah bahagian yang disebut oleh Allah dalam ayat tersebut: membasuh seluruh muka; membasuh kedua-dua tangan hingga ke siku termasuk siku; menyapu kepala; dan membasuh kedua-dua kaki hingga ke buku lali termasuk buku lali. Jika tertinggal salah satu daripadanya, wuduk itu tidak lengkap.",
      "Selain itu, mazhab-mazhab menambah kewajipan lain berdasarkan Sunnah dan ijtihad fiqh. Niat adalah wajib dalam kebanyakan mazhab (mazhab Hanafi menggolongkannya sebagai sunat muakkad untuk mengangkat hadas kecil). Tertib (tartib) wajib bagi mazhab Syafie dan Hanbali, dan berturut-turut (muwalat) bagi mazhab Maliki dan Hanbali. Mazhab Maliki menambah menggosok anggota (dalk) sebagai satu kewajipan.",
      "Segala yang selain itu — berkumur dan memasukkan air ke hidung, membasuh tangan terlebih dahulu, membasuh tiga kali — adalah sunat, bukan wajib. Mengetahui perbezaan ini membolehkan anda membezakan antara wuduk yang sekadar kurang sempurna dengan wuduk yang benar-benar tidak sah.",
    ],
    quran: [
      {
        excerpt:
          "Basuhlah muka kamu dan tangan kamu hingga ke siku, sapulah kepala kamu, dan basuhlah kaki kamu hingga ke buku lali.",
      },
    ],
    disclaimer:
      "Senarai tepat fara'id (contohnya sama ada niat, tertib dan menggosok itu wajib) berbeza antara empat mazhab. Pelajari dan amalkan satu mazhab yang muktabar secara konsisten.",
  },
  {
    title: "Perbuatan Sunat dalam Wuduk",
    summary: "Amalan sunat yang menyempurnakan wuduk dan menggandakan pahalanya.",
    body: [
      "Di samping teras yang wajib, Nabi ﷺ mengamalkan banyak perbuatan sunat (sunan) yang melengkapkan dan memperindah wuduk. Meninggalkan salah satu daripadanya tidak membatalkan wuduk, tetapi melakukannya mendatangkan pahala tambahan dan lebih sempurna mengikut teladan baginda.",
      "Perbuatan sunat yang sabit termasuklah: membaca 'Bismillah' pada permulaan; membasuh tangan tiga kali sebelum memulakan; berkumur (madmadah) dan memasukkan air ke hidung (istinsyaq); menyelati janggut yang tebal serta celah-celah jari tangan dan kaki dengan jari yang basah (takhlil); mendahulukan yang kanan bagi setiap pasangan anggota; dan mengulangi setiap basuhan sehingga tiga kali.",
      "Dua sunnah wajar disebut secara khusus: bersugi (siwak) sebelum wuduk — yang hampir-hampir dijadikan wajib oleh Nabi ﷺ — dan membaca syahadah selepas selesai, yang membuka lapan pintu syurga bagi orang yang membacanya.",
    ],
    hadith: [
      {
        excerpt:
          "Sesiapa yang berwuduk dengan sempurna, kemudian mengucapkan 'Aku bersaksi bahawa tiada tuhan melainkan Allah… dan bahawa Muhammad ialah hamba dan Rasul-Nya,' dibukakan baginya lapan pintu syurga. ('Umar ibn al-Khattab)",
      },
    ],
    actions: [
      "Amalkan urutan sunnah yang lengkap sehingga ia menjadi rutin semula jadi anda.",
      "Bacalah syahadah selepas wuduk setiap kali.",
    ],
    appLinks: [{ label: "Doa selepas wuduk" }],
  },
  {
    title: "Wuduk Langkah demi Langkah",
    summary: "Urutan lengkap mengikut sunnah Nabi, daripada niat hingga doa penutup.",
    body: [
      "Nabi ﷺ mengajar wuduk sebagai satu urutan yang berterusan yang menggabungkan perkara wajib dengan perbuatan sunat. Inilah cara yang ditunjukkan oleh 'Uthman ibn 'Affan kepada orang ramai, lalu beliau berkata bahawa beliau telah melihat Nabi ﷺ berwuduk tepat seperti itu — dan sesiapa yang melakukan sedemikian lalu solat dua rakaat dengan sepenuh kehadiran hati, diampunkan dosa-dosanya yang lalu.",
      "Lakukan setiap langkah tanpa tergesa-gesa, dan pastikan air sampai ke setiap bahagian yang wajib. Anggota yang dibasuh (muka, tangan, kaki) hendaklah dibasuh; kepala pula hanya disapu.",
    ],
    steps: [
      {
        title: "Berniat untuk bersuci dan membaca Bismillah",
        body: "Tetapkan niat wuduk di dalam hati dan mulakan dengan nama Allah.",
        tip: "Niat itu di dalam hati — tiada lafaz khusus yang diwajibkan.",
      },
      {
        title: "Basuh kedua-dua tangan tiga kali",
        body: "Basuh hingga ke pergelangan tangan, dan alirkan air ke celah-celah jari.",
      },
      {
        title: "Berkumur tiga kali",
        body: "Masukkan air ke dalam mulut, kumur-kumurkan, kemudian buang.",
      },
      {
        title: "Memasukkan air ke hidung tiga kali",
        body: "Sedut air perlahan-lahan ke dalam rongga hidung, kemudian hembuskan keluar.",
      },
      {
        title: "Basuh muka tiga kali (fardu)",
        body: "Dari tempat tumbuh rambut hingga ke bawah dagu, dan dari telinga ke telinga.",
      },
      {
        title: "Basuh tangan kanan, kemudian tangan kiri (fardu)",
        body: "Setiap satu dari hujung jari hingga ke siku termasuk siku, sehingga tiga kali.",
      },
      {
        title: "Sapu kepala sekali (fardu)",
        body: "Dengan tangan yang basah, sapu dari depan ke belakang dan kembali semula, kemudian sapu telinga dengan basahan yang sama.",
      },
      {
        title: "Basuh kaki kanan, kemudian kaki kiri (fardu)",
        body: "Setiap satu hingga ke buku lali termasuk buku lali, sambil menyelati celah-celah jari kaki.",
        tip: "Beri perhatian pada tumit dan buku lali — bahagian yang paling kerap tertinggal.",
      },
      {
        title: "Baca doa penutup",
        body: "Ucapkan syahadah untuk membuka pintu-pintu syurga.",
        tip: "Amalan sunat yang ringkas tetapi besar ganjarannya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "'Uthman membasuh setiap anggota tiga kali sebagaimana beliau melihat Nabi ﷺ melakukannya, lalu berkata: sesiapa yang berwuduk seperti ini dan solat dua rakaat dengan penuh khusyuk, diampunkan dosa-dosanya yang lalu. (Humran, daripada 'Uthman)",
      },
    ],
    appLinks: [{ label: "Wuduk dalam panduan Solat" }, { label: "Doa wuduk" }],
  },
  {
    title: "Doa-doa Berkaitan Wuduk",
    summary: "Doa-doa yang diriwayatkan secara sahih sebelum dan selepas wuduk.",
    body: [
      "Zikir yang paling kuat riwayatnya berkaitan wuduk ada dua: membaca 'Bismillah' pada permulaan, dan syahadah selepas selesai. Pada syahadah penutup itu, terdapat tambahan yang sahih yang memohon kepada Allah, 'Jadikanlah aku daripada golongan orang yang bertaubat dan jadikanlah aku daripada golongan orang yang menyucikan diri.'",
      "Penting untuk diketahui bahawa 'doa bagi setiap anggota' yang terperinci (doa khusus ketika membasuh tangan, muka, lengan dan sebagainya) yang tersebar dalam sesetengah buku kecil tidak sabit secara sahih daripada Nabi ﷺ. Para ulama menasihatkan agar tidak menyandarkannya kepada baginda sebagai sunnah, walaupun tidak mengapa berzikir kepada Allah secara umum ketika berwuduk.",
      "Inti pati perkara ini ialah kehadiran hati: basuhlah dengan kesedaran bahawa dosa setiap anggota sedang gugur, dan akhirilah dengan syahadah yang menghubungkan semula perbuatan itu dengan tujuannya — iman kepada Allah semata-mata.",
    ],
    hadith: [
      {
        excerpt:
          "Sesiapa yang berwuduk dengan sempurna kemudian membaca syahadah, dibukakan baginya lapan pintu syurga untuk dia masuk melalui mana-mana pintu yang dia kehendaki. ('Umar)",
      },
    ],
    actions: [
      "Hafalkan syahadah selepas wuduk jika anda belum menghafalnya.",
      "Elakkan membaca lafaz khusus bagi setiap anggota yang tidak sahih seolah-olah ia sunnah yang sabit.",
    ],
    appLinks: [{ label: "Doa-doa solat" }, { label: "Belajar doa wuduk" }],
  },
  {
    title: "Apakah yang Membatalkan Wuduk?",
    summary:
      "Perkara yang membatalkan wuduk — dan kaedah berpegang pada keyakinan ketika ragu-ragu.",
    body: [
      "Dengan kesepakatan ulama, wuduk terbatal oleh apa sahaja yang keluar daripada dua jalan (qubul dan dubur) — air kencing, tahi, angin atau lelehan lain — dan juga oleh tidur lena yang menghilangkan kesedaran, serta hilang akal kerana pengsan atau mabuk.",
      "Perkara lain tertakluk kepada perbezaan pendapat yang dihormati antara mazhab: menyentuh kemaluan secara langsung, dan persentuhan kulit dengan bukan mahram yang berlainan jantina, membatalkan wuduk menurut sesetengah mazhab tetapi tidak menurut mazhab yang lain, berdasarkan perbezaan dalam memahami nas yang sama.",
      "Satu prinsip asas yang penting melindungi anda daripada kebimbangan berterusan (waswas): keyakinan tidak hilang dengan keraguan. Jika anda sudah berwuduk dan hanya ragu-ragu sama ada wuduk itu telah terbatal, anda masih dianggap berwuduk sehingga anda yakin bahawa sesuatu yang membatalkannya telah berlaku. Nabi ﷺ berpesan kepada seorang lelaki yang terganggu dengan perasaan ini agar tidak meninggalkan solatnya 'sehingga dia mendengar bunyi atau mencium bau.'",
    ],
    hadith: [
      {
        excerpt:
          "Janganlah dia meninggalkan (solatnya) sehingga dia mendengar bunyi atau mencium bau. ('Abbad ibn Tamim, daripada bapa saudaranya)",
      },
    ],
    disclaimer:
      "Sama ada menyentuh orang yang berlainan jantina atau menyentuh kemaluan sendiri membatalkan wuduk berbeza antara mazhab. Ikutilah guru tempatan yang berkelayakan dan kaedah satu mazhab.",
  },
  {
    title: "Kesilapan Lazim dalam Wuduk",
    summary:
      "Kesilapan yang kerap berlaku yang mengurangkan pahala — atau membatalkan wuduk sepenuhnya.",
    body: [
      "Kebanyakan kesilapan wuduk berpunca daripada tergesa-gesa. Bergegas sehingga air tidak sampai ke seluruh anggota — bahagian kering pada tumit, buku lali, siku, atau celah-celah jari tangan dan kaki — boleh menyebabkan wuduk tidak sah, kerana basuhan yang diperintahkan dalam al-Quran tidak disempurnakan di situ.",
      "Nabi ﷺ pernah melihat sekumpulan orang yang tumit mereka dibiarkan kering kerana air tidak sampai kepadanya, lalu baginda memberi amaran keras, 'Celakalah tumit-tumit daripada api neraka!' Tumit, buku lali dan sudut-sudut muka ialah bahagian yang paling kerap diabaikan.",
      "Kesilapan yang sebaliknya ialah berlebih-lebihan: membasuh jauh lebih daripada tiga kali, atau menggunakan air secara membazir, yang bercanggah dengan sunnah bersederhana. Ada pula yang terjerumus ke dalam waswas (keraguan yang berlebihan), lalu mengulangi wuduk berkali-kali — ini juga satu kesilapan, kerana keyakinan tidak dibatalkan oleh sangkaan.",
    ],
    hadith: [
      {
        excerpt:
          "Celakalah tumit-tumit daripada api neraka! — sabda baginda ketika melihat tumit yang dibiarkan kering dalam wuduk. (Abu Hurairah)",
      },
    ],
    actions: [
      "Perlahankan diri dan pastikan dengan sedar bahawa setiap anggota yang dibasuh diliputi air sepenuhnya, terutamanya tumit dan siku.",
      "Gunakan air secara sederhana; jangan biarkan keraguan yang berlebihan mendorong anda mengulang tanpa perlu.",
    ],
  },
  {
    title: "Kelebihan Wuduk",
    summary:
      "Wuduk menghapuskan dosa, meninggikan darjat, dan akan menjadikan orang beriman bercahaya pada Hari Kiamat.",
    body: [
      "Wuduk ialah penghapusan dosa yang berulang-ulang. Nabi ﷺ mengajar bahawa ketika seorang mukmin membasuh setiap anggota, kesalahan yang dilakukan oleh anggota itu gugur bersama air — melalui mata, tangan dan kaki — sehingga dia keluar dalam keadaan bersih daripada dosa. Maka solat yang didahului dengan wuduk didahului dengan keampunan yang baharu.",
      "Ia juga satu kemuliaan yang membezakan di akhirat. Pada Hari Kiamat, Nabi ﷺ akan mengenali umatnya melalui cahaya pada muka, tangan dan kaki mereka daripada kesan wuduk — cahaya yang khusus bagi umat ini, yang disebut al-ghurr al-muhajjalun.",
      "Kerana kelebihan-kelebihan ini, sentiasa berada dalam keadaan berwuduk ialah tabiat yang digalakkan: memperbaharui wuduk bagi setiap solat dan tidur dalam keadaan berwuduk termasuk antara amalan yang melindungi seorang mukmin.",
    ],
    hadith: [
      {
        excerpt:
          "Umatku akan dipanggil pada Hari Kiamat dalam keadaan muka, tangan dan kaki mereka bercahaya daripada kesan wuduk. (Abu Hurairah)",
      },
    ],
    actions: [
      "Perbaharui wuduk bagi setiap waktu solat apabila anda mampu.",
      "Jadikan tidur dalam keadaan berwuduk sebagai sunnah setiap malam.",
    ],
    appLinks: [{ label: "Jejak solat anda" }],
  },
  {
    title: "Apakah Mandi Wajib?",
    summary: "Mandi seluruh badan mengikut syarak yang mengangkat hadas besar (janabah).",
    body: [
      "Mandi wajib (غسل, ghusl) ialah membasuh seluruh badan, disertai niat, untuk mengangkat hadas besar (janabah). Jika wuduk mengangkat hadas kecil, mandi wajib pula mengangkat keadaan yang lebih besar yang berlaku selepas hubungan suami isteri, keluar mani, dan berakhirnya haid atau nifas.",
      "Intipatinya ialah air sampai ke setiap bahagian luar badan — tidak boleh ada bahagian yang kering, termasuk pangkal rambut, lipatan kulit, belakang telinga, pusat dan celah-celah jari kaki. Berkumur dan memasukkan air ke hidung dikira sebahagian daripada mandi wajib oleh ramai ulama.",
      "Satu mandi wajib yang dilakukan dengan niat mengangkat janabah juga mengangkat hadas kecil, maka orang yang telah selesai mandi wajib boleh solat tanpa wuduk yang berasingan (walaupun berwuduk dalam mandi wajib itu adalah sunnah).",
    ],
    quran: [
      {
        excerpt: "Dan jika kamu berjunub, maka bersucilah.",
      },
    ],
    appLinks: [{ label: "Gambaran persediaan solat" }],
  },
  {
    title: "Bilakah Mandi Wajib Diwajibkan",
    summary: "Keadaan yang menjadikan mandi seluruh badan wajib atau sunat.",
    body: [
      "Mandi menjadi wajib (fardu) dalam beberapa keadaan yang ditetapkan: keluar mani dengan syahwat (sama ada ketika jaga atau melalui mimpi basah); persetubuhan itu sendiri, walaupun tanpa keluar mani — Nabi ﷺ bersabda bahawa apabila kedua-duanya bertemu, wajiblah mandi; dan berakhirnya haid atau nifas. Kematian juga mewajibkan orang yang hidup memandikan jenazah.",
      "Mandi-mandi yang lain adalah sunat (mustahab), bukan wajib: mandi hari Jumaat sebelum solat Jumaat, yang sangat dituntut sehingga Nabi ﷺ menyebutnya 'wajib atas setiap orang yang telah baligh'; mandi bagi dua hari raya; dan mandi ihram sebelum haji atau umrah.",
      "Seorang mualaf diperintahkan mandi apabila memeluk Islam — dianggap wajib oleh sesetengah ulama dan sangat digalakkan oleh ulama yang lain.",
    ],
    hadith: [
      {
        excerpt:
          "Apabila seorang lelaki duduk di antara empat anggota isterinya lalu menyetubuhinya, maka wajiblah mandi. (Abu Hurairah; juga Sahih Muslim 348)",
      },
      {
        excerpt:
          "Mandi pada hari Jumaat adalah wajib atas setiap orang yang telah baligh. (Abu Sa'id al-Khudri; juga Sahih Muslim 846)",
      },
    ],
    disclaimer:
      "Sama ada mandi Jumaat dan mandi mualaf itu wajib atau sangat digalakkan berbeza mengikut mazhab dan keadaan.",
    appLinks: [{ label: "Panduan haid" }],
  },
  {
    title: "Mandi Wajib Langkah demi Langkah",
    summary: "Cara mengikut sunnah Nabi — kewajipan minimum berserta sunnah yang lengkap.",
    body: [
      "'Aisyah menceritakan mandi wajib Nabi ﷺ secara terperinci, dan daripadanya para ulama mengeluarkan kedua-dua mandi wajib minimum yang sah dan kaedah sunnah yang lebih lengkap. Yang minimum hanyalah: niat serta air sampai ke seluruh badan (bersama berkumur dan memasukkan air ke hidung menurut ramai ulama). Kaedah lengkap di bawah ialah cara Nabi ﷺ sendiri melakukannya.",
      "Lakukannya tanpa tergesa-gesa, sambil menggosok air ke seluruh kulit supaya tiada bahagian yang tertinggal kering.",
    ],
    steps: [
      {
        title: "Berniat",
        body: "Berniatlah di dalam hati untuk mengangkat hadas besar (janabah).",
      },
      {
        title: "Baca Bismillah dan basuh tangan",
        body: "Mulakan dengan nama Allah dan basuh kedua-dua tangan.",
      },
      {
        title: "Basuh kemaluan",
        body: "Hilangkan sebarang najis daripada kemaluan dengan tangan kiri.",
      },
      {
        title: "Berwuduk dengan sempurna",
        body: "Berwuduklah seperti untuk solat. Anda boleh menangguhkan membasuh kaki hingga ke akhir jika berdiri dalam air yang bertakung.",
      },
      {
        title: "Curahkan air ke atas kepala tiga kali",
        body: "Ratakan air hingga ke kulit kepala dan pangkal rambut.",
      },
      {
        title: "Basuh bahagian kanan, kemudian kiri",
        body: "Curah dan gosokkan air ke seluruh badan, bermula dengan bahagian kanan.",
      },
      {
        title: "Pastikan air meliputi sepenuhnya",
        body: "Jangan tinggalkan bahagian yang kering — ketiak, pusat, belakang lutut dan telinga, serta celah-celah jari kaki.",
        tip: "Wanita tidak perlu merungkaikan rambut yang dijalin, asalkan air sampai ke kulit kepala.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Apabila Nabi ﷺ mandi kerana janabah, baginda membasuh tangannya, berwuduk seperti untuk solat, menyelati rambutnya dengan jari, kemudian mencurahkan air ke atas kepalanya tiga kali dan ke seluruh badannya. ('Aisyah)",
      },
    ],
  },
  {
    title: "Kesilapan Lazim dalam Mandi Wajib",
    summary:
      "Elakkan bahagian yang kering, niat yang tertinggal, dan menyangka mandi biasa sebagai mandi wajib.",
    body: [
      "Kesilapan yang paling asas ialah menganggap mandi biasa sebagai mandi wajib. Mandi wajib memerlukan niat untuk mengangkat hadas besar; tanpanya, walau selama mana pun anda mandi, hadas itu tidak terangkat. Berniatlah sebelum anda memulakannya.",
      "Kesilapan lazim yang kedua ialah meninggalkan bahagian yang kering. Kewajipannya ialah air menyentuh seluruh bahagian luar badan, maka mengabaikan pangkal rambut di kulit kepala, telinga, pusat, bahagian bawah belakang, atau celah-celah jari kaki menjadikan mandi wajib tidak lengkap. Gosokkan air ke bahagian-bahagian ini untuk memastikannya.",
      "Tentang rambut: wanita yang rambutnya dijalin tidak diwajibkan merungkaikan jalinannya, asalkan air sampai ke pangkal kulit kepala — Nabi ﷺ memberitahu Ummu Salamah bahawa mencurahkan tiga cedok air ke atas kepala sudah memadai. Rambut lelaki, yang biasanya tidak diikat, hendaklah diselati supaya air sampai ke pangkalnya.",
    ],
    hadith: [
      {
        excerpt:
          "Cukuplah bagimu mencurahkan tiga cedok air ke atas kepalamu, kemudian curahkan air ke seluruh badanmu, maka kamu telah suci — kamu tidak perlu merungkaikan jalinan rambutmu. (Ummu Salamah)",
      },
    ],
    actions: [
      "Berniatlah sebelum curahan pertama, supaya basuhan itu dikira sebagai mandi wajib.",
      "Gosokkan air ke bahagian yang mudah tertinggal; apabila tidak pasti, basuh semula bahagian itu daripada menyudahkannya dalam keraguan.",
    ],
  },
  {
    title: "Apakah Tayamum?",
    summary: "Bersuci tanpa air menggunakan tanah yang bersih apabila air tidak dapat digunakan.",
    body: [
      "Tayamum (تيمم) ialah pengganti yang penuh rahmat bagi wuduk atau mandi wajib apabila air benar-benar tiada atau tidak dapat digunakan. Sebagai ganti membasuh, seseorang menepuk tapak tangannya pada tanah yang bersih lalu menyapu muka dan tangan — dan ini menggantikan sepenuhnya bersuci dengan air, sehingga solat menjadi sah.",
      "Tayamum ialah anugerah khusus kepada umat ini: Nabi ﷺ bersabda, 'Bumi telah dijadikan bagiku sebagai tempat solat dan alat untuk bersuci,' dengan menyenaraikannya antara keistimewaan yang diberikan kepada baginda dan tidak kepada nabi-nabi terdahulu. Ia menzahirkan satu prinsip utama agama ini — kewajipan tetap kekal, tetapi kesukaran diangkat.",
      "Ia ialah langkah sementara: apabila air sudah ada dan boleh digunakan, bersuci seperti biasa dengan air disambung semula. Menurut sesetengah mazhab, seseorang perlu memperbaharui tayamum bagi setiap solat.",
    ],
    quran: [
      {
        excerpt:
          "…lalu kamu tidak mendapat air, maka bertayamumlah dengan tanah yang bersih, dan sapulah muka dan tangan kamu dengannya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Bumi telah dijadikan bagiku sebagai tempat solat dan alat untuk bersuci. (Jabir — antara lima perkara yang dikurniakan khusus kepada Nabi ﷺ)",
      },
    ],
  },
  {
    title: "Bilakah Tayamum Dibenarkan",
    summary:
      "Dibenarkan apabila air tiada, memudaratkan, atau sangat diperlukan untuk kelangsungan hidup.",
    body: [
      "Tayamum dibenarkan dalam tiga keadaan umum. Pertama, apabila tiada air yang dapat ditemui selepas mencari dengan munasabah — musafir di padang pasir, atau sesiapa sahaja yang benar-benar tidak mempunyai akses kepada air. Kedua, apabila menggunakan air akan mendatangkan mudarat: bagi orang sakit yang luka atau penyakitnya akan bertambah teruk, atau dalam kesejukan yang melampau tanpa cara untuk memanaskan air dan terdapat risiko mudarat yang sebenar.",
      "Ketiga, apabila sedikit air yang ada diperlukan untuk keperluan yang lebih mendesak — seperti untuk diminum, bagi memelihara nyawa, sama ada nyawa sendiri, orang lain atau haiwan. Dalam setiap keadaan, syariat meletakkan pemeliharaan nyawa dan kesihatan mengatasi cara bersuci yang lebih utama.",
      "Para fuqaha berbeza pendapat tentang had-had yang lebih halus — sejauh mana seseorang mesti mencari air, setakat mana kebimbangan akan mudarat dianggap memadai — tetapi mereka sebulat suara tentang rahmat yang mendasarinya: ibadah tidak pernah digugurkan, hanya dipermudahkan.",
    ],
    hadith: [
      {
        excerpt:
          "Diriwayatkan dalam bab-bab tayamum: kelonggaran untuk bersuci dengan tanah yang bersih ketika tiada air yang boleh digunakan.",
      },
    ],
    actions: [
      "Carilah air dengan munasabah sebelum beralih kepada tayamum.",
      "Jika doktor menasihatkan agar luka atau penyakit dijaga supaya kekal kering, ikutilah nasihat itu dan bertayamumlah.",
    ],
  },
  {
    title: "Tayamum Langkah demi Langkah",
    summary: "Urutan yang ringkas dan mudah untuk bersuci tanpa air dengan sah.",
    body: [
      "Tayamum sengaja dijadikan ringkas — mencerminkan tujuannya sebagai rukhsah ketika kesukaran. Ia dilakukan dengan permukaan tanah semula jadi yang bersih: tanah, pasir, batu atau debu. Intipatinya, berdasarkan tunjuk ajar Nabi ﷺ sendiri kepada 'Ammar ibn Yasir, ialah sekali tepukan tapak tangan pada tanah yang bersih, kemudian menyapu muka dan tangan.",
      "Ia sengaja dijadikan lebih ringan daripada wuduk, maka janganlah merumitkannya.",
    ],
    steps: [
      { title: "Berniat", body: "Berniatlah untuk mengangkat hadas supaya dapat beribadah." },
      { title: "Baca Bismillah", body: "Mulakan dengan nama Allah." },
      {
        title: "Tepuk tanah yang bersih sekali dengan kedua-dua tapak tangan",
        body: "Letakkan tapak tangan dengan ringan pada permukaan semula jadi yang bersih dan berdebu.",
      },
      { title: "Sapu muka", body: "Sapu seluruh muka sekali dengan kedua-dua tangan." },
      {
        title: "Sapu tangan",
        body: "Sapu belakang tapak tangan — hingga ke pergelangan tangan menurut kebanyakan ulama.",
        tip: "Ikutilah kaedah satu mazhab (hingga pergelangan tangan atau hingga lengan) secara konsisten.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Nabi ﷺ menepuk tanah dengan kedua-dua tapak tangannya, kemudian menyapu muka dan tangannya — mengajar 'Ammar bahawa itu sudah memadai. ('Ammar ibn Yasir)",
      },
    ],
  },
  {
    title: "Apakah yang Membatalkan Tayamum?",
    summary:
      "Terbatal oleh perkara yang biasa membatalkan wuduk — dan apabila air yang boleh digunakan kembali ada.",
    body: [
      "Tayamum yang dilakukan sebagai ganti wuduk terbatal oleh semua perkara yang membatalkan wuduk: membuang air, keluar angin, tidur lena dan seumpamanya. Tayamum sebagai ganti mandi wajib pula turut terbatal oleh apa sahaja yang menyebabkan hadas besar.",
      "Secara khusus, tayamum juga berakhir apabila sebab yang mengharuskannya telah hilang — iaitu apabila air yang boleh digunakan sudah ada. Sebaik sahaja air ditemui dan boleh digunakan, rukhsah itu tamat dan seseorang kembali kepada wuduk atau mandi wajib.",
      "Satu perkara praktikal yang penuh rahmat: jika anda telah solat dengan tayamum secara sah dan hanya menemui air selepas itu, majoriti ulama berpendapat solat yang telah selesai itu tidak perlu diulang — ia dilakukan dengan betul mengikut hukum yang terpakai pada ketika itu. Tetapi jika air didapati sebelum solat, anda mesti menggunakannya.",
    ],
    actions: [
      "Periksa semula sama ada air ada pada awal setiap waktu solat.",
      "Sebaik sahaja air boleh digunakan, kembalilah bersuci dengan air tanpa berlengah.",
    ],
    disclaimer:
      "Sebahagian butiran — seperti sama ada solat perlu diulang jika air ditemui dalam waktunya — berbeza mengikut mazhab.",
  },
  {
    title: "Najis (Najasah)",
    summary: "Kekotoran fizikal yang mesti dihilangkan daripada badan, pakaian dan tempat solat.",
    body: [
      "Najis (نجاسة) ialah kekotoran yang nyata dari sudut syarak, berbeza daripada keadaan hadas. Contoh-contoh jelas yang disepakati termasuklah air kencing dan tahi manusia, darah yang mengalir, daging dan lelehan babi, serta air liur anjing (yang memerlukan basuhan khusus). Menghilangkan najis daripada badan, pakaian yang dipakai dan tempat solat ialah syarat sah solat.",
      "Najis dihilangkan dengan air apabila kekotorannya nyata, dibasuh sehingga zat dan kesannya hilang. Islam juga memandang serius punca-punca najis: Nabi ﷺ memberi amaran bahawa kebanyakan azab kubur berpunca daripada kecuaian terhadap air kencing — terkena percikannya dan tidak membersihkannya dengan sempurna.",
      "Mazhab-mazhab berbeza pendapat dalam mengklasifikasikan sebahagian bahan (contohnya, sama ada sedikit cecair tertentu dimaafkan) dan tentang kadar sisa yang dimaafkan. Prinsip yang praktikal untuk kehidupan seharian: bersihkan dengan teliti, dan jangan mereka-reka keraguan tentang kesucian apabila tiada bukti adanya najis.",
    ],
    hadith: [
      {
        excerpt:
          "Nabi ﷺ melalui dua kubur lalu bersabda bahawa penghuninya sedang diazab — seorang kerana menyebarkan fitnah, dan seorang lagi kerana dia tidak memelihara dirinya daripada air kencingnya. (Ibnu 'Abbas; juga Sahih Muslim 292)",
      },
    ],
  },
  {
    title: "Membersihkan Pakaian daripada Najis",
    summary: "Cara membasuh pakaian supaya sah solat dengan memakainya.",
    body: [
      "Apabila najis terkena pakaian, basuhlah bahagian yang terkena dengan air sehingga zat najis itu dan kesannya yang kelihatan hilang. Nabi ﷺ mengarahkan seorang wanita yang pakaiannya terkena darah haid supaya mengikisnya, kemudian menggosoknya dengan air, kemudian membasuhnya, lalu solat dengan memakainya.",
      "Jika, selepas usaha yang ikhlas dan bersungguh-sungguh, masih tinggal sedikit kesan warna atau sedikit bau yang tidak dapat ditanggalkan, majoriti ulama memaafkan apa yang benar-benar sukar dihilangkan — kewajipannya ialah menghilangkan zat najis, bukan menjamin kain itu bebas sepenuhnya daripada sebarang tompok.",
      "Sesetengah kes mempunyai butirannya sendiri yang terkenal, seperti air kencing bayi lelaki yang hanya menyusu (direnjis air, bukan dibasuh sepenuhnya, berdasarkan rukhsah yang diriwayatkan) — maka pelajarilah hukum praktikal mazhab anda bagi keadaan yang benar-benar anda hadapi.",
    ],
    hadith: [
      {
        excerpt:
          "Tentang darah haid pada pakaian: kikislah, kemudian gosoklah dengan air, kemudian basuhlah, dan solatlah dengan memakainya. (Asma' binti Abi Bakr)",
      },
    ],
    actions: [
      "Simpan sekurang-kurangnya satu set pakaian yang bersih khusus untuk solat.",
      "Jika najis terkena pakaian anda ketika di luar rumah, bilaslah apa yang mampu dan tukar pakaian apabila berpeluang.",
    ],
  },
  {
    title: "Membersihkan Badan",
    summary: "Menghilangkan najis daripada badan, serta adab istinjak dan kebersihan diri.",
    body: [
      "Najis pada badan mesti dibasuh sebelum solat, sekadar kemampuan. Keadaan yang paling kerap ialah membersihkan diri selepas menggunakan tandas — istinjak — yang dilakukan dengan air, atau dengan bahan kering yang sesuai, sehingga tempat itu bersih. Nabi ﷺ mengajar cara membersihkan diri dengan teliti selepas membuang air dan melarang penggunaan tangan kanan untuknya.",
      "Selain menghilangkan najis, Islam menggalakkan kebersihan asas yang selaras dengan fitrah, yang memastikan badan bersih dan bersedia untuk beribadah: memotong kuku, membuang bulu ketiak dan bulu ari-ari, dan seumpamanya, secara berkala.",
      "Amalan-amalan ini bukan sekadar adat budaya — ia sebahagian daripada maruah dan kebersihan yang dengannya seorang mukmin menghadap Allah dalam solat.",
    ],
    hadith: [
      {
        excerpt: "Nabi ﷺ biasa membersihkan dirinya dengan air selepas membuang air. (Anas)",
      },
    ],
    actions: [
      "Sentiasa sempurnakan istinjak sebelum berwuduk selepas menggunakan tandas.",
      "Bawalah tisu dan, jika boleh, bekas untuk membawa air ketika bermusafir.",
    ],
  },
  {
    title: "Membersihkan Tempat Solat",
    summary:
      "Tempat solat mesti bebas daripada najis yang diketahui — tanpa keraguan yang tidak berasas.",
    body: [
      "Tempat solat mesti bebas daripada najis yang diketahui. Nabi ﷺ mengajar perkara ini dengan jelas: apabila seorang Arab Badwi kencing di sudut masjid, baginda menghalang para Sahabat daripada memarahinya dengan keras, membiarkannya selesai, kemudian memerintahkan agar setimba air dicurahkan ke atas tempat itu — mengajar kebersihan dan kelembutan sekali gus.",
      "Kaedah yang menjadi pegangan ialah keyakinan. Bumi secara umumnya dijadikan tempat solat, maka sesuatu permukaan dianggap bersih melainkan anda mempunyai bukti sebenar adanya najis. Jika anda tahu ada najis, hilangkannya atau berpindahlah ke tempat yang bersih; jika anda sekadar membayangkan mungkin ada najis, abaikan bisikan itu dan teruskan.",
      "Keseimbangan ini memelihara ibadah daripada dua keterlaluan: solat secara cuai di atas tanah yang jelas kotor, dan menjadi lumpuh kerana syak wasangka yang tidak berasas terhadap setiap permukaan.",
    ],
    hadith: [
      {
        excerpt:
          "Apabila seorang Arab Badwi kencing di dalam masjid, Nabi ﷺ memerintahkan agar setimba air dicurahkan ke atasnya. (Abu Hurairah)",
      },
    ],
    actions: [
      "Tinjau sejadah dan lantai anda sebelum solat.",
      "Tanpa bukti sebenar adanya najis, tolaklah was-was yang tidak berasas dan teruskan solat.",
    ],
  },
  {
    title: "Haid dan Kesucian",
    summary: "Haid dan nifas mempunyai hukum bersucinya yang tersendiri.",
    body: [
      "Semasa haid dan nifas, wanita tidak bersolat, dan — sebagai rahmat agama ini — solat yang ditinggalkan dalam tempoh itu tidak perlu diqada kemudiannya. Perkara ini telah muktamad: apabila 'Aisyah ditanya mengapa wanita yang haid mengqada puasanya tetapi tidak solatnya, beliau menegaskan bahawa itulah yang diperintahkan kepada mereka.",
      "Puasa berbeza: puasa Ramadan yang ditinggalkan kerana haid diqada kemudian, manakala solat digugurkan terus. Apabila darah berhenti dan tanda suci kelihatan, wanita itu mandi wajib lalu kembali bersolat dan berpuasa.",
      "Tempoh minimum dan maksimum haid dan nifas yang tepat, serta cara membaca tanda-tanda suci yang tidak jelas, merupakan perkara yang butirannya berbeza antara mazhab. Kaum wanita akan mendapat manfaat dengan mempelajari hukum praktikal satu mazhab yang muktabar bersama guru yang berkelayakan.",
    ],
    hadith: [
      {
        excerpt:
          "Apabila ditanya mengapa wanita yang haid mengqada puasa tetapi tidak solat, 'Aisyah berkata: kami diperintahkan mengqada puasa dan tidak diperintahkan mengqada solat. (Mu'azah, daripada 'Aisyah; juga Sahih Muslim 335)",
      },
    ],
    appLinks: [{ label: "Modul haid" }],
  },
  {
    title: "Soalan Lazim",
    summary: "Jawapan ringkas kepada kebimbangan dan keraguan yang paling lazim tentang bersuci.",
    body: [
      "Adakah keraguan membatalkan wuduk saya? Tidak. Jika anda sudah berwuduk dan hanya tidak pasti sama ada ia telah terbatal, wuduk anda kekal sehingga anda yakin berlakunya perkara yang membatalkannya. Berpegang pada keyakinan dan bukan pada sangkaan ialah prinsip yang diajar oleh Nabi ﷺ, yang melindungi anda daripada keraguan yang berlebihan (waswas).",
      "Bagaimana dengan simen (plaster) tulang, pembalut dan luka? Terdapat rukhsah. Apabila membasuh anggota yang berbalut memudaratkan, anda boleh menyapu di atas balutan itu (mash 'ala al-jabirah) sebagai gantinya, dan tayamum meliputi bahagian yang tidak dapat dicapai — butirannya berbeza mengikut mazhab dan keadaan.",
      "Bagaimana jika saya langsung tidak boleh menggunakan air? Tayamum dengan tanah yang bersih kekal sah sepenuhnya sehingga keupayaan menggunakan air kembali.",
      "Bagaimana dengan keadaan kronik — pendarahan berterusan (istihadah) atau tidak dapat menahan kencing? Orang itu dianggap sebagai seorang yang mempunyai uzur berterusan (ma'dhur): dia membersihkan diri dan berwuduk bagi setiap waktu solat, kemudian solat walaupun lelehan itu berterusan, dan ia tidak membatalkan solat tersebut.",
    ],
    actions: [
      "Jangan biarkan keraguan yang berterusan menghalang ibadah anda — ikutilah keyakinan, bukan sangkaan.",
      "Bagi keadaan kronik atau kes yang rumit, dapatkan hukum yang khusus untuk anda daripada ulama yang berkelayakan.",
    ],
    appLinks: [{ label: "Panduan solat" }, { label: "Bersuci dan wanita" }],
    disclaimer:
      "Jawapan soalan lazim ini ialah ringkasan pendidikan, bukan fatwa peribadi. Kes yang rumit atau kronik hendaklah dirujuk kepada ulama tempatan.",
  },
  {
    title: "Rujukan dan Kajian Lanjut",
    summary: "Ayat-ayat al-Quran dan bab-bab hadis yang utama tentang bersuci.",
    body: [
      "Nas al-Quran yang menjadi asas bagi bersuci ialah ayat wuduk, Surah al-Ma'idah 5:6, yang menghuraikan wuduk, mandi wajib dan tayamum sekali gus; di sampingnya, 2:222 ('Allah mengasihi orang-orang yang menyucikan diri') dan ayat-ayat tentang kesucian air (25:48) menjadi sandaran tajuk ini.",
      "Dalam Sunnah, sumber utamanya ialah Kitab-kitab Bersuci (Kitab al-Taharah / al-Wudu / al-Ghusl / al-Hayd) yang menjadi pembuka Sahih al-Bukhari dan Sahih Muslim, diikuti oleh bab-bab yang sama dalam empat kitab Sunan (Abu Dawud, at-Tirmizi, an-Nasa'i, Ibnu Majah), yang menghimpunkan hukum-hakam yang lebih terperinci berserta penilaian darjatnya.",
      "Untuk hukum yang praktikal, kitab-kitab fiqh klasik empat mazhab Sunni memberikan pandangan yang terperinci — dan perbezaan antara mereka ialah sebahagian yang sah daripada tradisi ini, bukan suatu kecacatan. Gunakan modul ini sebagai gambaran keseluruhan yang tersusun, kemudian dalami kajian anda bersama guru yang berkelayakan dan teks-teks sumber asal.",
    ],
    hadith: [
      {
        excerpt:
          "Bab-bab yang menyeluruh tentang wuduk, mandi wajib, tayamum dan haid yang menjadi pembuka kitab ini.",
      },
      {
        excerpt: "Kitab Bersuci — riwayat-riwayat sahih tentang hukum, adab dan prinsip taharah.",
      },
    ],
    actions: [
      "Ikutilah satu kurikulum yang dipercayai untuk mengelakkan kekeliruan akibat hukum yang berselerak.",
      "Ulang kaji tajuk-tajuk ini secara berkala sehingga keyakinan praktikal anda benar-benar mantap.",
    ],
    appLinks: [{ label: "Laluan pembelajaran solat" }, { label: "Doa-doa solat" }],
  },
];

// Malay overlay for TAHARAH_CHECKLIST (index-aligned with ../taharah-checklist.ts).
export const TAHARAH_CHECKLIST_MS: DeepPartial<TaharahChecklistItem>[] = [
  {
    title: "Wuduk sebelum Subuh",
    hint: "Mulakan hari dalam keadaan suci apabila boleh.",
  },
  {
    title: "Bersugi / memberus gigi",
    hint: "Sunat sebelum wuduk dan sebelum solat.",
  },
  {
    title: "Pakaian solat bebas daripada najis",
    hint: "Periksa najis yang kelihatan sebelum solat.",
  },
  {
    title: "Tempat solat yang bersih",
    hint: "Alihkan apa-apa yang bernajis dari tempat anda solat.",
  },
  {
    title: "Perbaharui wuduk selepas perkara yang membatalkannya",
    hint: "Angin, tidur, tandas — ketahui perkara yang membatalkan wuduk.",
  },
  {
    title: "Mandi wajib apabila diperlukan",
    hint: "Selepas hadas besar, berakhirnya haid, atau nifas.",
  },
];
