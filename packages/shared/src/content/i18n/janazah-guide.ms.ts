import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// ms overlay for janazah-guide. Index-aligned with JANAZAH_GUIDE_TOPICS in ../janazah-guide.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const JANAZAH_GUIDE_TOPICS_MS: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Kewajipan bersama",
    summary: "Janazah adalah fardu kifayah — masyarakat wajib menunaikannya.",
    body: [
      "Solat jenazah (Solat al-Janazah) adalah fardu kifayah: jika sebahagian masyarakat menunaikannya, maka kewajipannya akan dihapuskan daripada yang lain; jika tiada, semua berkongsi kesalahan. Ia solat berdiri, tanpa ruku atau sujud - bentuk yang tersendiri di antara solat.",
      "Abu Hurairah meriwayatkan bahawa Rasulullah ﷺ bersabda: 'Sesiapa yang menghadiri jenazah sehingga solat diqadakan, maka dia akan mendapat satu qirat (pahala), dan sesiapa yang hadir sehingga pengebumian dia mendapat dua qirat.' Dia ditanya apa itu qirat, dan dia berkata: 'Seperti dua gunung yang besar' (Sahih al-Bukhari 1325; Sahih Muslim 945).",
      "Mengikuti pengebumian, membantu membasuh dan mengebumikan mengikut kemampuan seseorang, dan mendoakan si mati adalah antara hak seorang Muslim terhadap yang lain. Rawat tubuh badan dengan maruah dan elakkan pemborosan atau amalan tanpa bukti.",
    ],
    actions: [
      "Balas dengan cepat apabila pengebumian diumumkan dalam komuniti anda.",
      "Niatkan solat dan hadir kerana Allah, bukan paparan sosial.",
      "Bantu dengan keperluan praktikal keluarga apabila anda boleh melakukannya dengan penuh hormat.",
    ],
    hadith: [
      {
        excerpt:
          "Sesiapa yang menghadiri jenazah sehingga dia menyembahyangkan jenazah akan mendapat satu qirat, dan sesiapa yang menghadiri sehingga pengebumian akan mendapat dua qirats - masing-masing seperti gunung yang besar.",
      },
      {
        excerpt:
          "Barangsiapa yang mengikuti jenazah seorang muslim karena iman dan mencari pahala, dan berdiam sampai shalat dan selesai jenazahnya, maka ia akan kembali dengan dua qirath...",
      },
    ],
  },
  {
    title: "Mencuci dan mengkafankan",
    summary: "Ghusl si mati dan seorang kafan sederhana - maruah tanpa berlebih-lebihan.",
    body: [
      "Orang Islam yang mati (selain syahid di medan perang dalam ketetapan klasik) dimandikan dengan basuhan yang mensucikan, kemudian dikafankan dengan kain putih bersih. Ummu Atiyyah meriwayatkan bahawa Nabi ﷺ bersabda tentang mandian anak perempuannya: 'Basuhlah dia tiga atau lima kali, atau lebih jika kamu rasa patut, dengan air dan sidr, dan letakkan kapur barus - atau kapur barus - pada akhir' (Sahih al-Bukhari 1253).",
      "Aisyah meriwayatkan bahawa Rasulullah ﷺ diselubungi dengan tiga pakaian kapas Yaman putih, di antaranya bukan baju mahupun serban (Sahih al-Bukhari 1264; Sahih Muslim 941). Bersederhana itu sunnah; paparan mahal bercanggah dengan contoh kenabian.",
      "Siapa yang membasuh siapa, berapa banyak kain untuk lelaki dan wanita, dan butiran yang berkaitan mempunyai perbezaan mazhab. Keluarga harus mengikuti panduan tempatan yang berpengetahuan atau perkhidmatan pengebumian yang mengetahui amalan sekolah — gambaran keseluruhan ini bukan manual cucian.",
    ],
    actions: [
      "Lantik orang yang boleh dipercayai daripada jantina yang sama dengan si mati apabila boleh.",
      "Pastikan kain kafan itu sederhana dan bersih — kain putih adalah model kenabian.",
      "Elakkan mengambil gambar atau mendedahkan badan tanpa perlu.",
    ],
    hadith: [
      {
        excerpt:
          "Basuh dia tiga kali, atau lima, atau lebih jika anda melihatnya sebagai perlu, dengan air dan sidr, dan masukkan kapur barus atau beberapa kapur barus dalam basuhan terakhir.",
      },
      {
        excerpt:
          "Rasulullah ﷺ diselubungi tiga pakaian kapas Yaman putih; tidak ada baju mahupun serban di antara mereka.",
      },
    ],
  },
  {
    title: "Ketika menutup mata si mati",
    summary: "Doa kenabian pada saat kematian.",
    body: [
      "Ummu Salamah meriwayatkan bahawa Rasulullah ﷺ datang kepada Abu Salamah ketika matanya telah terpejam. Dia menutupnya dan berkata: 'Apabila jiwa diambil, penglihatan mengikutinya,' dan orang-orang dari keluarganya menangis. Dia kemudian mengajar mereka untuk mengatakan hanya yang baik, kerana para malaikat mengucapkan amin kepada apa yang mereka katakan, dan dia berdoa untuk Abu Salamah (Sahih Muslim 920).",
      "Entri Hisnul Muslim yang disertakan di bawah mengekalkan perkataan yang digunakan untuk menutup mata. Berkatalah dengan lemah lembut, elakkan ratapan yang dilarang oleh Rasulullah ﷺ, dan penuhi lidah dengan perkataan yang baik dan beristighfar.",
    ],
    actions: [
      "Pejamkan mata dengan lembut dan ucapkan doa yang sahih.",
      "Ingatkan keluarga untuk bercakap yang baik.",
    ],
    hadith: [
      {
        excerpt:
          "Apabila mata Abu Salamah terpejam, Nabi ﷺ menutupnya dan berkata bahawa apabila ruh telah diambil, penglihatan mengikutinya, kemudian mengajar rumah tangga untuk bercakap hanya yang baik.",
      },
    ],
  },
  {
    title: "Cara solat Janazah",
    summary: "Solat berdiri dengan empat takbir - tiada ruku atau sujud.",
    body: [
      "Solat jenazah dilakukan dengan berdiri. Tidak ada ruku, tidak ada sujud, dan tidak ada adzan atau iqamah. Imam berdiri di atas kepala si mati lelaki atau di tengah si mati perempuan menurut laporan dari Anas dan Samurah (lihat Abu Dawud 3194 dan riwayat yang berkaitan), dan jemaah membentuk barisan di belakang.",
      "Solat terdiri daripada empat takbir. Selepas yang pertama, surah al-Fatihah dibacakan (Bukhari 1335). Selepas takbir kemudian, selawat ke atas Nabi ﷺ dan doa untuk si mati dibuat. Solat diakhiri dengan taslim. Jabir melaporkan bahawa Nabi ﷺ menyembahyangkan jenazah Negus (raja Habsyah) dan mengucapkan empat takbir (Sahih al-Bukhari 1334).",
      "Orang yang lewat yang terlepas takbir hendaklah mengikut imam dan melengkapkan apa yang mereka terlepas mengikut peraturan sekolah mereka untuk mengejar — tanya imam atau guru tempatan jika tidak pasti.",
    ],
    actions: [
      "Berdiri dalam barisan; jangan rukuk atau sujud.",
      "Bertakbir empat kali bersama imam.",
      "Doa yang ikhlas untuk si mati selepas takbir yang sepatutnya.",
    ],
    hadith: [
      {
        excerpt: "Nabi ﷺ menyembahyangkan jenazah Negus dan mengucapkan empat takbir.",
      },
      {
        excerpt:
          "Ibn Abbas menyembahyangkan jenazah dan membaca Fatihah, mengatakan ia daripada sunnah.",
      },
    ],
  },
  {
    title: "Doa dalam solat jenazah (dewasa)",
    summary: "Lafaz Hisnul Muslim yang sahih untuk si mati.",
    body: [
      "Selepas takbir, hati Janazah adalah doa untuk si mati - memohon kepada Allah untuk mengampuni mereka, memberi mereka rahmat, dan memberikan mereka syurga. Beberapa lafaz yang sahih dipelihara dalam Hisnul Muslim dari Nabi ﷺ.",
      "Buka doa terpaut di bawah untuk membaca dengan bahasa Arab, transliterasi dan makna. Anda boleh mempelajari lebih daripada satu perkataan yang sahih; keikhlasan lebih penting daripada panjang.",
    ],
    actions: [
      "Menghafal sekurang-kurangnya satu doa Janazah yang sahih.",
      "Buat doa umum untuk semua orang Islam yang meninggal dunia apabila anda hadir.",
    ],
  },
  {
    title: "Lagi doa solat jenazah",
    summary: "Tambahan lafaz sahih daripada Hisnul Muslim.",
    body: [
      "Hisnul Muslim mengekalkan kata-kata solat jenazah yang diajarkan daripada Nabi ﷺ. Gunakannya secara bergilir-gilir atau pelajari yang paling diketahui oleh komuniti anda.",
      "Bagi anak yang telah meninggal dunia, doa-doa khusus memohon kepada Allah untuk menjadikan anak itu sebagai pendahulu dan pahala yang disimpan untuk ibu bapa — lihat topik seterusnya.",
    ],
  },
  {
    title: "Doa solat jenazah #3",
    summary: "Satu lagi perkataan sahih untuk si mati dewasa.",
    body: [
      "Lafaz Hisnul Muslim selanjutnya untuk solat jenazah. Bacalah selepas takbir yang sesuai sebagaimana yang dibenarkan oleh imam anda.",
    ],
  },
  {
    title: "Doa solat jenazah #4",
    summary: "Lafaz sahih keempat daripada korpus sunnah.",
    body: [
      "Hisnul Muslim termasuk tambahan doa jenazah ini. Pilih keaslian dan kehadiran hati daripada mengumpulkan setiap perkataan sekaligus.",
    ],
  },
  {
    title: "Doa untuk anak yang telah meninggal dunia",
    summary: "Doa kenabian khusus apabila si mati masih kanak-kanak.",
    body: [
      "Apabila si mati masih kanak-kanak, doa yang sahih memohon kepada Allah agar menjadikan anak itu sebagai harta yang tersimpan, pelopor, dan pemberi syafaat yang termakbul untuk ibu bapa. Entri Hisnul Muslim di bawah mengekalkan perkataan tersebut.",
      "Hiburkan keluarga dengan mengharapkan rahmat Allah sambil mengelakkan ritual rekaan. Struktur Janazah empat takbir yang sama berlaku; kandungan doa itulah yang berubah.",
    ],
    actions: [
      "Gunakan doa khusus kanak-kanak apabila sesuai.",
      "Sokong ibu bapa yang berduka dengan kehadiran dan bantuan halal.",
    ],
  },
  {
    title: "Doa pengebumian kanak-kanak #2",
    summary: "Lafaz Hisnul Muslim kedua untuk anak yang telah meninggal dunia.",
    body: [
      "Satu lagi lafaz sahih untuk solat jenazah seorang kanak-kanak, terpelihara dalam Hisnul Muslim.",
    ],
  },
  {
    title: "Pengebumian dan kubur",
    summary: "Menundukkan jenazah, menghadap kiblat, dan doa selepas dikebumikan.",
    body: [
      "Arwah dikebumikan di bumi menghadap kiblat, dengan martabat dan tanpa berlengah-lengah melebihi apa yang diperlukan oleh persiapan. Nabi ﷺ bersabda: 'Bersegeralah dengan pengebumian...' (Sahih al-Bukhari 1315 - menyegerakan pengebumian).",
      "Apabila meletakkan jenazah di dalam kubur, doa yang sahih dipelihara dalam Hisnul Muslim. Selepas pengebumian, Nabi ﷺ akan berdiri di kubur dan berkata: 'Mohonlah ampun untuk saudaramu, dan mintalah agar dia dikuatkan, kerana dia kini sedang ditanya' (Sunan Abi Dawud 3221 - dinilai sahih oleh ramai ulama terkemudian termasuk al-Albani).",
      "Membina struktur berhias di atas kubur, melepanya untuk hiasan, atau tulisan yang menggalakkan keterlaluan diberi amaran dalam laporan yang sahih. Pastikan tanda mudah di mana undang-undang dan adat tempatan membenarkan pengenalan.",
    ],
    hadith: [
      {
        excerpt:
          "Bersegeralah dengan pengebumian: jika ia adalah soleh, kamu menyegerakannya kepada kebaikan; jika sebaliknya, anda sedang menanggalkan kejahatan dari leher anda.",
      },
      {
        excerpt:
          "Mohonlah ampunan untuk saudaramu dan mintalah agar dia dikuatkan, kerana dia sekarang sedang ditanya.",
      },
    ],
  },
  {
    title: "Selepas mengebumikan si mati",
    summary: "Doa untuk istiqamah di kubur.",
    body: [
      "Berdiri sebentar selepas pengebumian untuk memohon keampunan dan keteguhan bagi si mati ditetapkan daripada Nabi ﷺ (Abu Dawud 3221). Lafaz Hisnul Muslim di bawah adalah untuk selepas pengebumian.",
      "Sedekah yang berterusan, doa, dan menunaikan wasiat si mati yang sah memberi manfaat kepada mereka dengan izin Allah — tanpa mengada-adakan upacara tahunan yang tiada bukti.",
    ],
    actions: [
      "Berdoa di kubur selepas dikebumikan.",
      "Teruskan doa peribadi dan sedekah untuk si mati.",
    ],
  },
  {
    title: "Menziarahi kubur",
    summary: "Salam kenabian ketika menziarahi kubur.",
    body: [
      "Menziarahi kubur mengingatkan kehidupan akhirat. Buraidah melaporkan bahawa Rasulullah ﷺ pernah mengajar mereka untuk mengatakan ketika mereka keluar ke kuburan: salam sejahtera ke atas penduduk kediaman di kalangan orang-orang mukmin dan Muslim, menegaskan bahawa kami akan — insya Allah — menyertai mereka, dan memohon kesejahteraan untuk kami dan mereka (Sahih Muslim 975; perkataan juga dalam Ibn Majah).",
      "Entri Hisnul Muslim di bawah mengekalkan salam itu. Pastikan lawatan bebas daripada ratapan, meminta pertolongan daripada orang mati, atau ritual tanpa bukti.",
    ],
    actions: [
      "Berilah salam kepada penghuni kubur dengan lafaz yang sahih.",
      "Renungkan kematian dan perbaharui amal soleh.",
    ],
    hadith: [
      {
        excerpt:
          "Salam sejahtera ke atas kamu, wahai penghuni kediaman di kalangan orang-orang mukmin dan muslimin. Kami akan - insya Allah - menyertai anda. Kami memohon kepada Allah kesejahteraan untuk kami dan untuk anda.",
      },
    ],
  },
  {
    title: "Peringatan dan kesilapan biasa",
    summary: "Elakkan meratap, menangguhkan pertunjukan, dan ritual yang tidak berasas.",
    body: [
      "Rasulullah ﷺ melarang meratap ke atas si mati sambil membiarkan kesedihan yang mencucurkan air mata. Abdullah ibn Umar melaporkan bahawa Sa'd ibn Ubadah menangis di pengebumian dan Nabi ﷺ menjelaskan bahawa Allah tidak menghukum kerana air mata atau kesedihan hati, tetapi kerana ini - dan baginda menunjukkan lidahnya (Sahih al-Bukhari 1304).",
      "Jangan tangguhkan pengebumian untuk majlis-majlis kehormatan, dan jangan berbelanja berfoya-foya untuk kain kafan dan kenduri sambil mengabaikan orang miskin. Jangan membaca atau mengamalkan bid'ah yang dikaitkan dengan pengebumian tanpa asas yang sahih. Takziah, doa tenang, dan bantuan praktikal untuk keluarga adalah jalan sunnah.",
      "Kehadiran wanita di sembahyang dan pengebumian dilayan dengan nuansa di seluruh sekolah dan era; ikuti panduan tempatan yang boleh dipercayai yang menghormati kedua-dua belas kasihan dan had kenabian.",
    ],
    disclaimer:
      "Gambaran keseluruhan pendidikan — bukan manual pengarah pengebumian atau fatwa. Amalan sekolah tempatan untuk mencuci, mengkafankan, dan peraturan tanah perkuburan mesti disahkan dengan orang yang berkelayakan.",
    actions: [
      "Berdukacita tanpa meratap atau ucapan yang dilarang.",
      "Menyegerakan pengebumian yang mulia.",
      "Bantulah keluarga dengan makanan dan urusan tanpa membebankan mereka dengan berfoya-foya.",
    ],
    hadith: [
      {
        excerpt:
          "Allah tidak menghukum kerana air mata atau kesedihan hati, tetapi Dia menghukum atau menunjukkan belas kasihan kerana ini - dan Dia menunjukkan lidahnya.",
      },
    ],
  },
];
