import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Malay translation overlay for the Learn Eid guide. Mirrors the order of
// EID_GUIDE_TOPICS in ../eid-guide.ts (index-aligned); untranslated entries fall
// back to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const EID_GUIDE_TOPICS_MS: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Aidilfitri — perayaan berbuka puasa",
    summary: "Hari pertama Syawal, menandakan berakhirnya puasa Ramadan.",
    body: [
      "Aidilfitri jatuh pada 1 Syawal, sejurus selepas Ramadan, dan merupakan hari kegembiraan serta kesyukuran kerana dapat berpuasa dan beribadat sepanjang bulan tersebut. Al-Quran mengaitkan pengakhiran puasa secara langsung dengan zikir dan kesyukuran: '...agar kamu menyempurnakan bilangan (hari) dan mengagungkan Allah atas petunjuk-Nya kepadamu, dan agar kamu bersyukur' (Al-Baqarah 2:185).",
      "Berpuasa pada hari ini adalah dilarang secara jelas, bukan sekadar tidak digalakkan — Nabi ﷺ menamakannya, bersama Aidiladha, sebagai salah satu dari dua hari yang umat Islam diperintahkan untuk makan dan bukan berpuasa (Bukhari 1990). Hari itu bermula dengan Zakat Fitrah dan solat Aidilfitri, dan diteruskan dengan menziarahi keluarga, bertukar ucapan baik, dan meraikan secara umum dalam batas-batas syariat.",
    ],
    quran: [
      {
        excerpt:
          "...agar kamu menyempurnakan bilangan (hari) dan mengagungkan Allah atas petunjuk-Nya kepadamu, dan agar kamu bersyukur.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Inilah dua hari yang Rasulullah ﷺ melarang berpuasa padanya: hari kamu berbuka (daripada puasa Ramadan), dan hari kamu makan daripada korban kamu.",
      },
    ],
  },
  {
    title: "Aidiladha — perayaan korban",
    summary: "10 Zulhijah, mengimbau korban Nabi Ibrahim.",
    body: [
      "Aidiladha jatuh pada 10 Zulhijah, Hari Nahar semasa haji, dan mengimbau kesediaan Nabi Ibrahim mengorbankan anaknya demi taat kepada Allah, dan rahmat Allah yang menebusnya dengan haiwan korban (Al-Quran 37:102–107). Ia dianggap oleh ramai ulama sebagai yang lebih agung antara dua hari raya, bertepatan dengan kesempurnaan haji bagi mereka yang menunaikannya.",
      "Seperti Aidilfitri, berpuasa pada hari ini dilarang (Bukhari 1990). Ibadat tambahan utamanya ialah korban (udhiyah), yang dipersembahkan oleh mereka yang berkemampuan, sebagai peringatan kepatuhan Nabi Ibrahim, dan sebagai gabungan ibadat serta sedekah.",
    ],
    quran: [
      {
        excerpt:
          "Setelah anak itu meningkat besar dan dapat berusaha bersama-samanya, Nabi Ibrahim berkata: Wahai anak kesayanganku, aku bermimpi menyembelihmu... Dan Kami tebus anak itu dengan seekor binatang sembelihan (kambing) yang besar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Inilah dua hari yang Rasulullah ﷺ melarang berpuasa padanya: hari kamu berbuka (daripada puasa Ramadan), dan hari kamu makan daripada korban kamu.",
      },
    ],
  },
  {
    title: "Cara menunaikan solat Aidilfitri/Aidiladha",
    summary: "Dua rakaat dengan takbir tambahan — tanpa azan atau iqamah.",
    body: [
      "Solat hari raya adalah dua rakaat, ditunaikan secara berjemaah tanpa sebarang azan atau iqamah sebelumnya — Jabir bin Abdullah dan Ibnu Abbas kedua-duanya mengesahkan bahawa tidak ada panggilan solat diberikan untuk mana-mana hari raya pada zaman Nabi ﷺ (Sahih Muslim 886). Solat diikuti dengan khutbah, berbeza dengan solat Jumaat di mana khutbah didahulukan.",
      "Takbir tambahan (menyebut 'Allahu Akbar') ditambah sebelum bacaan pada setiap rakaat, selain daripada takbir biasa dalam solat. Aisyah meriwayatkan bahawa Nabi ﷺ bertakbir tujuh kali pada rakaat pertama dan lima kali pada rakaat kedua, untuk kedua-dua hari raya (Sunan Abu Daud 1149), bilangan yang turut diriwayatkan daripada Abdullah bin Amr (Sunan Abu Daud 1151).",
    ],
    hadith: [
      {
        excerpt:
          "Tidak ada azan pada hari Aidilfitri semasa imam keluar, atau selepas kemunculannya; tidak ada iqamah atau panggilan atau apa-apa seumpamanya pada hari itu.",
      },
      {
        excerpt:
          "Rasulullah ﷺ bertakbir tujuh kali pada rakaat pertama dan lima kali pada rakaat kedua pada hari berbuka puasa dan hari korban.",
      },
    ],
    madhhabNote:
      "Mazhab berbeza pendapat tentang jumlah tepat takbir tambahan. Ulama Syafi'i, Maliki, dan Hanbali mengikuti riwayat tujuh-lima (Abu Daud 1149/1151) — Maliki dan Hanbali mengira takbir pembukaan sebagai sebahagian daripada tujuh, lalu menyebut enam-lima. Mazhab Hanafi pula berpegang pada 3 takbir tambahan sebelum bacaan pada rakaat pertama dan 3 sebelum rukuk pada rakaat kedua (6 kesemuanya) — pendirian fuqaha Kufah yang tidak mempunyai hadis marfu' yang disahkan secara berasingan; ikutlah bilangan takbir imam jemaah anda.",
    actions: [
      "Hadirlah tepat pada waktunya — tidak ada azan atau iqamah untuk menandakan permulaan.",
      "Ikuti bilangan takbir imam anda; amalan mana-mana mazhab adalah sah.",
      "Kekallah untuk mendengar khutbah selepas solat.",
    ],
  },
  {
    title: "Amalan sunnah pada hari raya",
    summary: "Mandi, pakaian terbaik, makan sebelum/selepas, dan dua laluan berbeza.",
    body: [
      "Beberapa sunnah kecil digalakkan sebelum dan selepas solat hari raya. Pada Aidilfitri, Nabi ﷺ tidak keluar untuk solat sehingga baginda memakan beberapa biji kurma, dalam bilangan ganjil (Bukhari 953) — berbeza dengan Aidiladha, di mana digalakkan untuk menunggu dan makan daripada korban selepas pulang dari solat.",
      "Adalah sunnah untuk mandi dan memakai pakaian terbaik (bersih, sopan) untuk acara ini, mengikut amalan umum para sahabat pada kedua-dua hari raya, meskipun riwayat khusus ini kurang kukuh dibandingkan yang lain di sini, dan merupakan amalan yang diikuti secara meluas berbanding satu hadis bertaraf sahih tunggal.",
      "Satu sunnah yang tersendiri adalah mengambil laluan yang berbeza semasa pulang berbanding yang diambil semasa pergi. Jabir bin Abdullah meriwayatkan: 'Pada hari raya, Nabi ﷺ pulang (selepas menunaikan solat hari raya) melalui laluan yang berbeza daripada yang baginda pergi' (Bukhari 986) — biasanya dijelaskan sebagai memperbanyakkan tempat yang menyaksikan ibadatnya dan mempamerkan syiar Islam dengan lebih meluas.",
    ],
    hadith: [
      {
        excerpt:
          "Nabi ﷺ tidak pernah keluar (untuk solat) pada hari Aidilfitri melainkan baginda telah memakan beberapa biji kurma, yang baginda makan dalam bilangan ganjil.",
      },
      {
        excerpt:
          "Pada hari raya, Nabi ﷺ pulang (selepas menunaikan solat hari raya) melalui laluan yang berbeza daripada yang baginda pergi.",
      },
    ],
    actions: [
      "Mandilah dan pakai pakaian sopan terbaik anda.",
      "Makan kurma dalam bilangan ganjil sebelum solat Aidilfitri; tunggu untuk makan sehingga selepas solat Aidiladha.",
      "Ambil laluan berbeza semasa pulang berbanding yang anda ambil menuju solat.",
    ],
  },
  {
    title: "Zakat Fitrah — asas-asasnya",
    summary: "Satu sedekah wajib yang kecil, wajib dibayar sebelum solat Aidilfitri.",
    body: [
      "Zakat Fitrah adalah sedekah tersendiri yang lebih kecil daripada zakat harta, wajib ke atas setiap Muslim — muda atau tua, lelaki atau perempuan, merdeka atau tanggungan — dibayar bagi pihak mereka oleh ketua keluarga. Ibnu Umar meriwayatkan bahawa Nabi ﷺ mewajibkan satu sa' (kira-kira 2–3 kg) kurma atau barli ke atas setiap Muslim, untuk dibayar sebelum orang ramai keluar menunaikan solat hari raya (Bukhari 1503).",
      "Tujuannya dinyatakan secara jelas dalam sunnah: 'penyucian bagi orang yang berpuasa daripada percakapan sia-sia dan kotor, dan makanan untuk orang miskin' (Sunan Abu Daud 1609). Membayarnya sebelum solat hari raya dikira sebagai zakat khusus ini; membayarnya selepas solat masih dikira sebagai sedekah umum, tetapi kehilangan ganjaran khusus yang berkaitan dengan waktunya.",
      "Kebanyakan masyarakat hari ini mengira nilai dalam mata wang tempatan berbanding mengedar kurma atau barli secara terus, mengikut panduan ulama tempatan dan badan zakat mengenai nilai makanan asas semasa — satu penyesuaian praktikal, bukan perubahan kepada kewajipan asasnya.",
    ],
    hadith: [
      {
        excerpt:
          "Rasulullah ﷺ mewajibkan pembayaran satu Sa' kurma atau satu Sa' barli sebagai Zakat Fitrah ke atas setiap Muslim, hamba atau merdeka, lelaki atau perempuan, muda atau tua, dan baginda memerintahkan supaya dibayar sebelum orang ramai keluar menunaikan solat hari raya.",
      },
      {
        excerpt:
          "Rasulullah ﷺ mewajibkan Zakat Fitrah sebagai penyucian bagi orang yang berpuasa daripada percakapan sia-sia dan kotor, dan sebagai makanan untuk orang miskin. Sesiapa yang membayarnya sebelum solat, itu adalah zakat yang diterima; sesiapa yang membayarnya selepas solat, itu adalah sedekah (biasa).",
      },
    ],
    actions: [
      "Kira dan sisihkan Zakat Fitrah untuk diri anda dan tanggungan anda.",
      "Bayarlah sebelum keluar menunaikan solat Aidilfitri jika boleh.",
    ],
    appLinks: [{ label: "Kalkulator zakat" }],
  },
  {
    title: "Korban (udhiyah) — asas-asasnya",
    summary: "Korban haiwan yang dipersembahkan pada Aidiladha, dikongsi dengan golongan miskin.",
    body: [
      "Korban adalah penyembelihan haiwan yang layak (biri-biri, kambing, lembu, atau unta, yang memenuhi syarat umur dan kesihatan) pada Aidiladha dan hari-hari Tasyrik yang berikutnya, sebagai peringatan korban Nabi Ibrahim. Anas meriwayatkan bahawa Nabi ﷺ sendiri menyembelih dua ekor kibas hitam-putih dengan tangannya sendiri, menyebut nama Allah dan takbir ke atasnya (Bukhari 5558) — ini menetapkan bahawa melakukan sembelihan sendiri, jika berupaya, adalah amalan yang lebih mulia, meskipun mewakilkannya kepada orang lain juga adalah sah.",
      "Al-Quran mengaitkan korban secara langsung dengan perkongsian dagingnya: '...maka makanlah sebahagiannya dan berilah makan orang yang memerlukan dan yang meminta' (Al-Hajj 22:36). Daging biasanya dikongsi antara isi rumah sendiri, keluarga dan sahabat, serta golongan miskin, agar acara ini menggabungkan ibadat, kedermawanan, dan kesyukuran.",
      "Sembelihan hendaklah dilakukan selepas solat hari raya, bukan sebelumnya — seorang sahabat yang telah menyembelih awal diarah oleh Nabi ﷺ untuk mengulanginya, kerana korban yang dipersembahkan sebelum solat tidak dikira sebagai udhiyah. Ketetapan tentang siapa sebenarnya yang diwajibkan, dan tempoh masa yang tepat, berbeza mengikut mazhab; rujuk kepada ulama tempatan yang berkelayakan untuk situasi anda.",
    ],
    quran: [
      {
        excerpt:
          "...kamu beroleh kebaikan padanya. Oleh itu sebutlah nama Allah semasa kamu menyembelihnya dalam keadaan ia berdiri tegak (setelah diikat kakinya). Kemudian setelah ia tumbang (mati), makanlah sebahagian daripadanya dan berilah makan kepada orang yang tidak meminta dan yang meminta.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Nabi ﷺ menyembelih dua ekor kibas, berwarna hitam-putih, dan aku melihat baginda meletakkan kakinya pada rusuknya sambil menyebut Nama Allah dan bertakbir. Kemudian baginda menyembelih kedua-duanya dengan tangannya sendiri.",
      },
    ],
    actions: [
      "Aturkan korban anda sebelum Aidiladha jika anda berkemampuan dan ia diwajibkan ke atas anda.",
      "Pastikan sembelihan berlaku selepas solat hari raya, bukan sebelumnya.",
      "Kongsikan daging antara isi rumah anda, keluarga/sahabat, dan golongan miskin.",
    ],
    disclaimer:
      "Siapa sebenarnya yang diwajibkan korban, dan tempoh masa sah yang tepat untuk sembelihan, adalah persoalan fiqh terperinci yang berbeza mengikut mazhab. Ini adalah kandungan pendidikan umum, bukan fatwa — rujuk kepada ulama tempatan yang berkelayakan untuk situasi anda.",
  },
];
