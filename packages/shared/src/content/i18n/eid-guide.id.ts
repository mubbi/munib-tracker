import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Indonesian translation overlay for the Learn Eid guide. Mirrors the order of
// EID_GUIDE_TOPICS in ../eid-guide.ts (index-aligned); untranslated entries fall
// back to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const EID_GUIDE_TOPICS_ID: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Idul Fitri — hari raya berbuka puasa",
    summary: "Hari pertama Syawal, menandai akhir puasa Ramadan.",
    body: [
      "Idul Fitri jatuh pada 1 Syawal, tepat setelah Ramadan, dan merupakan hari sukacita serta rasa syukur karena telah dimampukan untuk berpuasa dan beribadah sepanjang bulan. Al-Qur'an mengaitkan akhir puasa langsung dengan zikir dan syukur: '...agar kamu menyempurnakan bilangan (hari) dan agar kamu mengagungkan Allah atas petunjuk-Nya yang diberikan kepadamu, dan supaya kamu bersyukur' (QS. Al-Baqarah 2:185).",
      "Berpuasa pada hari ini secara tegas dilarang, bukan sekadar tidak disukai — Nabi ﷺ menyebutnya, bersama Idul Adha, sebagai salah satu dari dua hari yang umat Islam diperintahkan untuk makan, bukan berpuasa (Bukhari 1990). Hari itu dimulai dengan Zakat Fitrah dan salat Id, dan berlanjut dengan mengunjungi keluarga, bertukar ucapan selamat, dan bersukaria secara umum dalam batas-batas syariat.",
    ],
    quran: [
      {
        excerpt:
          "...agar kamu menyempurnakan bilangan (hari) dan agar kamu mengagungkan Allah atas petunjuk-Nya yang diberikan kepadamu, dan supaya kamu bersyukur.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Inilah dua hari yang Rasulullah ﷺ melarang berpuasa padanya: hari kamu berbuka (dari puasa Ramadan), dan hari kamu makan dari hewan kurbanmu.",
      },
    ],
  },
  {
    title: "Idul Adha — hari raya kurban",
    summary: "Tanggal 10 Zulhijah, memperingati kurban Ibrahim.",
    body: [
      "Idul Adha jatuh pada 10 Zulhijah, Hari Nahr selama ibadah haji, dan memperingati kesediaan Ibrahim untuk mengurbankan putranya demi taat kepada Allah, serta rahmat Allah yang menebusnya dengan hewan kurban (QS. Ash-Shaffat 37:102–107). Menurut pandangan banyak ulama, ini adalah yang lebih agung dari dua hari raya, bertepatan dengan puncak ibadah haji bagi mereka yang berhaji.",
      "Seperti Idul Fitri, berpuasa pada hari ini juga dilarang (Bukhari 1990). Ritual tambahan utamanya adalah kurban (udhiyah), dipersembahkan oleh yang mampu, sebagai peringatan atas penyerahan diri Ibrahim, dan sebagai perbuatan ibadah serta sedekah sekaligus.",
    ],
    quran: [
      {
        excerpt:
          "Maka tatkala anak itu sampai (pada umur sanggup) berusaha bersama-sama Ibrahim, Ibrahim berkata: Hai anakku, sesungguhnya aku melihat dalam mimpi bahwa aku menyembelihmu... Dan Kami tebus anak itu dengan seekor sembelihan yang besar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Inilah dua hari yang Rasulullah ﷺ melarang berpuasa padanya: hari kamu berbuka (dari puasa Ramadan), dan hari kamu makan dari hewan kurbanmu.",
      },
    ],
  },
  {
    title: "Cara melaksanakan salat Id",
    summary: "Dua rakaat dengan takbir tambahan — tanpa azan atau iqamah.",
    body: [
      "Salat Id adalah dua rakaat, dilaksanakan berjamaah tanpa azan atau iqamah sebelumnya — Jabir bin Abdullah dan Ibnu Abbas keduanya menegaskan bahwa tidak ada panggilan salat yang diberikan untuk kedua hari raya pada zaman Nabi ﷺ (Sahih Muslim 886). Salat diikuti dengan khutbah, berbeda dengan salat Jumat di mana khutbah didahulukan.",
      "Takbir tambahan (mengucapkan 'Allahu Akbar') ditambahkan sebelum bacaan pada setiap rakaat, di atas takbir biasa dalam salat. Aisyah meriwayatkan bahwa Nabi ﷺ mengucapkan takbir tujuh kali pada rakaat pertama dan lima kali pada rakaat kedua, untuk kedua hari raya (Sunan Abu Dawud 1149), jumlah yang juga diriwayatkan dari Abdullah bin Amr (Sunan Abu Dawud 1151).",
    ],
    hadith: [
      {
        excerpt:
          "Tidak ada azan pada hari Idul Fitri ketika imam keluar, ataupun setelah kemunculannya; tidak ada iqamah atau panggilan atau apa pun semacam itu pada hari itu.",
      },
      {
        excerpt:
          "Rasulullah ﷺ bertakbir tujuh kali pada rakaat pertama dan lima kali pada rakaat kedua di hari berbuka puasa dan hari kurban.",
      },
    ],
    madhhabNote:
      "Mazhab berbeda pendapat tentang jumlah takbir tambahan yang tepat. Ulama Syafi'i, Maliki, dan Hambali mengikuti riwayat tujuh-lima (Abu Dawud 1149/1151) — Maliki dan Hambali menghitung takbir pembuka termasuk dalam tujuh, sehingga menyatakan enam-lima. Mazhab Hanafi justru berpegang pada 3 takbir tambahan sebelum bacaan di rakaat pertama dan 3 sebelum rukuk di rakaat kedua (6 total) — pendapat para fukaha Kufah yang tidak memiliki hadis marfu' terpisah yang otentik; ikuti jumlah takbir imam jamaah Anda.",
    actions: [
      "Datanglah tepat waktu — tidak ada azan atau iqamah yang menandakan dimulainya salat.",
      "Ikuti jumlah takbir imam Anda; praktik dari mazhab mana pun sah.",
      "Tetaplah untuk mendengarkan khutbah setelah salat.",
    ],
  },
  {
    title: "Amalan sunnah pada hari itu",
    summary: "Mandi, pakaian terbaik, makan sebelum/sesudah, dan dua jalur berbeda.",
    body: [
      "Beberapa sunnah kecil dianjurkan sebelum dan sesudah salat Id. Pada Idul Fitri, Nabi ﷺ tidak berangkat untuk salat sampai beliau makan beberapa kurma, dalam jumlah ganjil (Bukhari 953) — berbeda dengan Idul Adha, di mana dianjurkan untuk menunggu dan makan dari hewan kurban setelah kembali dari salat.",
      "Sunnah untuk mandi dan memakai pakaian terbaik (bersih, sopan) untuk acara ini, mengikuti praktik umum para sahabat pada kedua hari raya, meskipun riwayat khusus ini kurang kuat dibuktikan dibandingkan yang lain di sini, dan merupakan praktik yang diikuti secara luas daripada satu hadis bergrade sahih.",
      "Sunnah yang khas adalah mengambil rute yang berbeda saat pulang dari yang diambil saat pergi. Jabir bin Abdullah meriwayatkan: 'Pada hari Id, Nabi ﷺ biasa kembali (setelah melaksanakan salat Id) melalui jalan yang berbeda dari yang ia tempuh' (Bukhari 986) — biasanya dijelaskan sebagai memperbanyak tempat yang menjadi saksi ibadahnya dan menampilkan syiar Islam lebih luas.",
    ],
    hadith: [
      {
        excerpt:
          "Nabi ﷺ tidak pernah pergi (untuk salat) pada Hari Idul Fitri kecuali beliau telah makan beberapa kurma, yang beliau makan dalam jumlah ganjil.",
      },
      {
        excerpt:
          "Pada hari Id, Nabi ﷺ biasa kembali (setelah melaksanakan salat Id) melalui jalan yang berbeda dari yang ia tempuh.",
      },
    ],
    actions: [
      "Mandilah dan kenakan pakaian sopan terbaik Anda.",
      "Makan kurma dalam jumlah ganjil sebelum salat Idul Fitri; tunggu untuk makan sampai setelah salat Idul Adha.",
      "Ambil rute berbeda saat pulang dari yang Anda tempuh menuju salat.",
    ],
  },
  {
    title: "Zakat Fitrah — dasar-dasarnya",
    summary: "Sedekah wajib kecil, yang harus dibayar sebelum salat Idul Fitri.",
    body: [
      "Zakat Fitrah (Sadaqat al-Fitr) adalah sedekah tersendiri yang lebih kecil dari zakat harta, wajib bagi setiap Muslim — muda atau tua, laki-laki atau perempuan, merdeka atau tanggungan — dibayarkan atas nama mereka oleh kepala rumah tangga. Ibnu Umar meriwayatkan bahwa Nabi ﷺ mewajibkan satu sha' (sekitar 2–3 kg) kurma atau gandum atas setiap Muslim, untuk dibayarkan sebelum orang-orang berangkat ke salat Id (Bukhari 1503).",
      "Tujuannya dinyatakan secara eksplisit dalam sunnah: 'penyucian bagi orang yang berpuasa dari perkataan sia-sia dan kotor, dan makanan bagi orang miskin' (Sunan Abu Dawud 1609). Membayarnya sebelum salat Id dianggap sebagai zakat khusus ini; membayarnya setelah salat masih dianggap sedekah umum, tetapi kehilangan pahala khusus yang terkait dengan waktunya.",
      "Kebanyakan komunitas saat ini menghitung nilainya dalam mata uang lokal daripada mendistribusikan kurma atau gandum secara langsung, mengikuti bimbingan ulama lokal dan lembaga zakat mengenai nilai bahan pokok saat ini — sebuah penyesuaian praktis, bukan perubahan pada kewajiban yang mendasarinya.",
    ],
    hadith: [
      {
        excerpt:
          "Rasulullah ﷺ mewajibkan pembayaran satu Sha' kurma atau satu Sha' gandum sebagai Zakat Fitrah atas setiap Muslim, hamba atau merdeka, laki-laki atau perempuan, muda atau tua, dan beliau memerintahkan agar dibayarkan sebelum orang-orang berangkat untuk melaksanakan salat Id.",
      },
      {
        excerpt:
          "Rasulullah ﷺ mewajibkan Zakat Fitrah sebagai penyucian bagi orang yang berpuasa dari perkataan sia-sia dan kotor, dan sebagai makanan bagi orang miskin. Siapa yang membayarnya sebelum salat, itu adalah zakat yang diterima; siapa yang membayarnya setelah salat, itu adalah sedekah (biasa).",
      },
    ],
    actions: [
      "Hitung dan sisihkan Zakat Fitrah untuk diri Anda dan tanggungan Anda.",
      "Bayarkan sebelum berangkat untuk salat Idul Fitri jika memungkinkan.",
    ],
    appLinks: [{ label: "Kalkulator zakat" }],
  },
  {
    title: "Kurban (udhiyah) — dasar-dasarnya",
    summary: "Kurban hewan yang dipersembahkan pada Idul Adha, dibagikan kepada yang miskin.",
    body: [
      "Kurban adalah penyembelihan hewan yang memenuhi syarat (kambing, domba, sapi, atau unta, yang memenuhi ketentuan usia dan kesehatan) pada Idul Adha dan hari-hari Tasyrik berikutnya, sebagai peringatan atas kurban Ibrahim. Anas meriwayatkan bahwa Nabi ﷺ sendiri menyembelih dua ekor domba hitam-putih dengan tangannya sendiri, mengucapkan nama Allah dan takbir atas keduanya (Bukhari 5558) — menetapkan bahwa melakukan penyembelihan sendiri, jika mampu, adalah praktik yang lebih utama, meskipun mewakilkannya kepada orang lain juga sah.",
      "Al-Qur'an secara langsung mengaitkan kurban dengan pembagian dagingnya: '...maka makanlah sebagian darinya dan (sebagian lagi) berikanlah untuk dimakan orang-orang yang tidak meminta dan orang yang meminta' (QS. Al-Hajj 22:36). Daging umumnya dibagikan antara rumah tangga sendiri, keluarga dan teman, serta orang miskin, sehingga acara ini menggabungkan ibadah, kedermawanan, dan rasa syukur.",
      "Penyembelihan harus dilakukan setelah salat Id, bukan sebelumnya — seorang sahabat yang menyembelih lebih awal diperintahkan Nabi ﷺ untuk mengulanginya, karena kurban yang dipersembahkan sebelum salat tidak dihitung sebagai udhiyah. Aturan tentang siapa tepatnya yang diwajibkan, dan jendela waktu yang tepat, berbeda menurut mazhab; konsultasikan dengan ulama lokal yang berkualifikasi untuk situasi Anda.",
    ],
    quran: [
      {
        excerpt:
          "...bagi kamu terdapat kebaikan padanya. Maka sebutlah nama Allah ketika kamu menyembelihnya dalam keadaan berdiri (dan telah terikat). Kemudian apabila telah rebah (mati), maka makanlah sebagiannya dan beri makanlah orang yang rela dengan apa yang ada padanya (yang tidak meminta-minta) dan orang yang meminta.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Nabi ﷺ menyembelih dua ekor domba, berwarna hitam-putih, dan aku melihat beliau meletakkan kakinya di sisi keduanya sambil menyebut Nama Allah dan mengucapkan takbir. Kemudian beliau menyembelih keduanya dengan tangannya sendiri.",
      },
    ],
    actions: [
      "Aturlah kurban Anda sebelum Idul Adha jika Anda mampu dan wajib atas Anda.",
      "Pastikan penyembelihan terjadi setelah salat Id, bukan sebelumnya.",
      "Bagikan daging antara rumah tangga Anda, keluarga/teman, dan orang miskin.",
    ],
    disclaimer:
      "Siapa tepatnya yang diwajibkan kurban, dan jendela waktu penyembelihan yang tepat, adalah pertanyaan fikih terperinci yang berbeda menurut mazhab. Ini adalah konten pendidikan umum, bukan fatwa — konsultasikan dengan ulama lokal yang berkualifikasi untuk situasi Anda.",
  },
];
