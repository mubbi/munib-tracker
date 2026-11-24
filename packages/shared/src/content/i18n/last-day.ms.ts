import type {
  LastDayHadithEntry,
  LastDayQuizQuestion,
  LastDayReferenceEntry,
  LastDayTimelineEvent,
  LastDayTopic,
  LastDayVerseEntry,
} from "../../types/last-day";
import type { DeepPartial } from "./localize";

// Malay translation overlay for the Learn "The Last Day" content. Mirrors the order
// of the English arrays in ../last-day*.ts (index-aligned); untranslated entries
// fall back to English. Only human-readable text is translated.

export const LAST_DAY_TOPICS_MS: DeepPartial<LastDayTopic>[] = [
  {
    title: "Pengenalan",
    summary: "Apakah Hari Akhirat, dan mengapa ia mengubah cara kita menjalani hidup hari ini?",
    body: [
      "Yaum al-Qiyamah — Hari Kebangkitan, Hari Berdiri dan Hari Pengadilan — ialah hari ketika setiap jiwa kembali kepada Allah untuk diperlihatkan amalannya dan diberi tempat kembalinya yang terakhir. Ia bukan legenda yang jauh atau gambaran puitis semata-mata. Al-Quran menyebutnya hampir pada setiap halaman, dan surah-surah Makkiyah yang terawal dipenuhi dengannya, tepat kerana keyakinan terhadapnya menyusun semula seluruh kehidupan seseorang. Apabila anda benar-benar menjangka akan berdiri di hadapan Allah, kejujuran, solat, kebaikan dan sikap menahan diri tidak lagi menjadi hiasan pilihan, tetapi menjadi inti diri anda yang sebenar.",
      "Modul ini menelusuri perjalanan itu peringkat demi peringkat: kematian dan pemergian roh, tempoh barzakh di alam kubur, tanda-tanda kecil dan besar yang mendahului Kiamat, tiupan Sangkakala, kebangkitan jasad, perhimpunan di sebuah padang yang luas, penyerahan kitab catatan amalan, Mizan (neraca), hisab, Telaga Haudh Nabi ﷺ dan syafaat, penyeberangan Titian Sirat, dan akhirnya dua tempat tinggal yang kekal — Syurga dan Neraka. Setiap peringkat diambil daripada Al-Quran dan hadis yang sahih.",
      "Dua prinsip menguasai segala-galanya di sini. Pertama, hakikat peristiwa-peristiwa ini adalah pasti dan merupakan perkara akidah; mengingkari kebangkitan atau pertanggungjawaban bermakna mengingkari agama itu sendiri. Kedua, waktu sebenar Kiamat hanya diketahui oleh Allah — tiada ulama, kalendar atau kiraan yang dapat meramalkannya, dan setiap dakwaan tentang tarikhnya adalah palsu. Nabi ﷺ tidak pernah memberikan kiraan detik kepada para sahabat baginda; baginda memberikan mereka cara untuk hidup. Maka tujuan mempelajari Hari Akhirat ialah persediaan, bukan ramalan: untuk melembutkan hati, membetulkan keutamaan, dan berlumba-lumba menuju kebaikan sebelum detik yang ditetapkan itu tiba.",
      "Nota tentang sumber: ceramah popular tentang 'tanda-tanda akhir zaman' penuh dengan riwayat yang lemah malah palsu. Modul ini hanya memuatkan yang sahih, dan apabila ulama Ahli Sunnah yang ikhlas benar-benar berbeza pendapat — contohnya tentang susunan sebahagian tanda besar — perbezaan itu dibentangkan sebagai perbezaan, tidak disembunyikan dan tidak pula dibesar-besarkan.",
    ],
    appLinks: [{ label: "Garis masa Akhirat" }, { label: "Belajar Akidah" }],
  },
  {
    title: "Mengapa beriman kepada Hari Akhirat?",
    summary: "Salah satu daripada enam rukun iman — pendorong, harapan dan keadilan yang muktamad.",
    body: [
      "Beriman kepada Hari Akhirat ialah salah satu daripada enam rukun Iman yang disebut oleh Nabi ﷺ ketika Malaikat Jibril datang untuk mengajarkan agama: beriman kepada Allah, para malaikat-Nya, kitab-kitab-Nya, rasul-rasul-Nya, Hari Akhirat, dan kepada qada dan qadar, baik dan buruknya (Sahih Muslim 8). Tanpa keimanan ini, seluruh binaan pertanggungjawaban akan runtuh — kerana jika tiada kembali kepada Allah, maka si zalim dan si soleh berakhir sama sahaja, dan setiap ibadah menjadi sekadar tabiat tanpa makna yang muktamad.",
      "Al-Quran menghujahkan Hari Akhirat dari sudut moral dan juga akal. Dari sudut moral: ia adalah jawapan kepada ketidakadilan, kerana dunia di mana orang zalim mati dengan selesa di atas katilnya dan orang yang dizalimi mati tanpa terbela tidak mungkin menjadi pengakhiran cerita jika Allah benar-benar Maha Adil. Dari sudut akal: Dia yang menciptakan anda daripada tiada pada kali pertama tidaklah lemah untuk mengembalikan anda pada kali kedua (Al-Quran 36:78–79). Kebangkitan adalah lebih mudah, bukan lebih sukar, berbanding penciptaan yang pertama.",
      "Keyakinan ini juga mendisiplinkan dua penggerak hati — rasa takut dan harapan — dan memastikan kedua-duanya seimbang. Amaran-amaran itu benar, maka orang beriman tidak menjadi sombong atau lalai; namun rahmat Allah amat luas dan pintu taubat kekal terbuka hingga kematian, maka orang beriman tidak pernah berputus asa. Hati yang hidup di antara takut dan harap ialah hati yang terus berusaha tanpa patah.",
      "Dari segi amalan, Hari Akhirat memberikan maruah kepada yang tidak berdaya dan kawalan diri kepada yang berkuasa. Ia memberitahu orang yang dizalimi bahawa tiada satu luka pun yang dilupakan oleh Allah, dan ia memberitahu yang kuat bahawa tiada harta, kedudukan atau pengaruh yang akan melindungi mereka ketika hisab. Oleh itu, beriman kepadanya bukanlah sekadar ketenangan peribadi, tetapi sumber keadilan, kesabaran dan integriti di dunia ini.",
    ],
    actions: [
      "Perbaharui niat anda setiap hari: amalanku untuk Allah dan untuk Hari aku akan bertemu dengan-Nya.",
      "Apabila ketidakadilan menyakiti anda dan tiada mahkamah dunia yang menjawabnya, serahkanlah ia kepada Mahkamah Hari Akhirat.",
      "Satukan rasa takut dan harapan — jangan biarkan rasa takut menghimpit anda hingga berputus asa, dan jangan biarkan harapan membuai anda hingga lalai.",
    ],
    appLinks: [{ label: "Enam rukun iman" }],
  },
  {
    title: "Kematian",
    summary:
      "Setiap jiwa akan merasai mati — husnul khatimah dan apa yang memberi manfaat kepada si mati.",
    body: [
      "Kematian ialah satu-satunya janji temu yang tidak pernah terlepas oleh sesiapa pun. Al-Quran menyatakannya dengan jelas: setiap jiwa akan merasai mati, dan balasan yang sempurna hanya diberikan pada Hari Kiamat (Al-Quran 3:185). Kematian bukanlah kemusnahan tetapi satu perpindahan — roh meninggalkan jasad dan beralih ke peringkat seterusnya dalam perjalanannya. Malaikat Maut, yang diamanahkan oleh Allah, mengambil roh, kemudian kepada Tuhan anda, anda dikembalikan (Al-Quran 32:11).",
      "Oleh kerana cara seseorang meninggal dunia itu penting, orang beriman berusaha ke arah pengakhiran yang baik — husnul khatimah — melalui taubat yang ikhlas, solat yang istiqamah dan akhlak yang baik, dengan harapan meninggal dunia dalam keadaan yang diredai Allah. Pengakhiran yang buruk — su'ul khatimah — dibimbangi bagi orang yang berterusan dalam dosa dan berpaling tanpa bertaubat. Namun rahmat di sebalik semua ini amat besar: pintu taubat kekal terbuka sehingga nyawa sampai ke kerongkong, maka tiada sesiapa pun patut menyimpulkan bahawa sudah terlambat selagi masih bernafas.",
      'Nabi ﷺ mengajar agar kerap mengingati mati — "Remember often the destroyer of pleasures" (maksud dalam bahasa Inggeris), iaitu kematian (Jami\' at-Tirmizi 2307, hasan) — bukan untuk menjadikan kita murung, tetapi untuk memastikan kita sentiasa sedar. Mengingati mati melonggarkan cengkaman dunia, meleraikan dendam, dan menyusun semula apa yang benar-benar penting. Butiran tentang pemergian roh yang hanya terdapat dalam riwayat lemah lebih baik ditinggalkan; bahan yang sahih sudah cukup untuk menanam rasa gerun dan kesediaan.',
      "Kematian juga menutup lembaran amalan — kecuali tiga perkara. Nabi ﷺ bersabda bahawa apabila seseorang meninggal dunia, terputuslah amalannya kecuali tiga: sedekah jariah, ilmu yang terus memberi manfaat, dan anak soleh yang mendoakannya (Sahih Muslim 1631). Ini sangat praktikal: ia bermakna apa yang anda bina, ajar dan didik semasa hidup boleh terus memberi pahala kepada anda lama selepas anda tiada.",
    ],
    actions: [
      "Perbanyakkan istighfar dan solat tepat pada waktunya — terutamanya ketika anda sihat dan sibuk, bukan hanya ketika sakit.",
      "Bertaubatlah hari ini daripada apa jua perkara tertentu yang sedang anda tangguhkan; jangan berjudi dengan hari esok.",
      "Labur dalam tiga amalan yang berkekalan: bina sedekah jariah, sebarkan ilmu yang bermanfaat, dan didik anak-anak di atas tauhid dan akhlak yang baik.",
    ],
    appLinks: [{ label: "Belajar Doa — doa-doa" }, { label: "Zakat & sedekah" }],
  },
  {
    title: "Barzakh (kehidupan di alam kubur)",
    summary: "Tempoh selepas kematian hingga kebangkitan — soal jawab dan akibatnya.",
    body: [
      'Barzakh bermaksud penghalang, dan ia ialah nama bagi seluruh tempoh antara kematian seseorang dan Hari Kebangkitan. Al-Quran menggunakan perkataan ini ketika orang zalim yang telah mati merayu untuk dikembalikan: "di hadapan mereka ada alam barzakh (yang mereka tinggal tetap padanya) hingga hari mereka dibangkitkan semula" (Al-Quran 23:100) — satu dinding yang kukuh yang tiada jalan kembali melaluinya ke kehidupan ini. Sama ada jasad dikebumikan, dibakar, lemas atau hilang, roh tetap memasuki barzakh; kubur hanyalah bentuknya yang paling biasa, dan merupakan peringkat pertama Akhirat bagi setiap manusia.',
      'Riwayat-riwayat yang sahih menggambarkan soal jawab selepas pengebumian. Dua malaikat datang dan bertanya si mati tiga soalan: Siapakah Tuhanmu? Apakah agamamu? Siapakah lelaki yang diutuskan kepadamu ini? Orang beriman yang diteguhkan oleh Allah menjawab: Tuhanku Allah, agamaku Islam, dan ini ialah Muhammad ﷺ; lalu kuburnya diluaskan dan diterangi untuknya. Orang yang lalai pula berkata, "Ah, I do not know" (maksud dalam bahasa Inggeris), lalu mengalami kesempitan (Jami\' at-Tirmizi 1071, hasan, yang menamakan kedua-dua malaikat itu Munkar dan Nakir). Inilah sebabnya Al-Quran memuji Allah yang meneguhkan orang beriman "dengan kalimah yang tetap teguh dalam kehidupan dunia dan akhirat" (Al-Quran 14:27).',
      'Nikmat atau azab kemudiannya menyusul di alam kubur, sebagaimana ditetapkan dalam nas-nas yang sahih: "The grave is either a garden from the gardens of Paradise or a pit from the pits of the Fire" (maksud dalam bahasa Inggeris) (Jami\' at-Tirmizi 2460, hasan sahih). Al-Quran mengisyaratkan bahawa kaum Firaun didedahkan kepada api neraka "pada waktu pagi dan petang" sebelum Kiamat pun tiba (Al-Quran 40:46). Ahli Sunnah menetapkan hakikat pahala dan azab kubur sambil menyerahkan sifat sebenarnya kepada Allah, kerana ia termasuk perkara ghaib yang tidak dapat dicerap oleh orang yang hidup.',
      "Terdapat kesepakatan bahawa soal jawab kubur serta nikmat atau azab kubur adalah benar; para ulama membincangkan butiran yang lebih halus — seperti sama ada ia mengenai jasad, roh atau kedua-duanya, dan bagaimana ia sampai kepada mereka yang tiada kubur biasa — tanpa membiarkan persoalan itu mengalihkan perhatian daripada intinya. Barzakh ialah pendorong yang besar: ia mengubah kubur daripada sekadar lubang di dalam tanah menjadi cermin amalan diri sendiri, dan ia menjelaskan bahawa apa yang anda hantar terlebih dahulu itulah yang akan menyambut anda di sana.",
    ],
    misconceptions: [
      "Salah faham: Azab kubur ialah kepercayaan rakyat yang tiada asas. Pembetulan: Hakikat soal jawab serta nikmat atau azab kubur ditetapkan dalam hadis sahih dan diisyaratkan dalam Al-Quran; ia adalah perkara akidah Ahli Sunnah yang telah mantap.",
      "Salah faham: Kita patut berbahas tentang rupa dan nama sebenar para malaikat itu. Pembetulan: Penamaan Munkar dan Nakir datang dalam riwayat yang hasan; keyakinan terasnya ialah soal jawab itu sendiri. Bersedia untuk menjawabnya dengan benar jauh lebih penting daripada membahaskan butirannya.",
    ],
    actions: [
      "Berpeganglah teguh kepada tauhid dan Sunnah sekarang — jawapan di kubur tidak dihafaz di sana, tetapi dihayati di sini.",
      "Jagalah zikir pagi dan petang, yang diajar oleh Nabi ﷺ sebagai perlindungan dan peneguh.",
    ],
    appLinks: [{ label: "Zikir pagi & petang" }],
  },
  {
    title: "Tanda-tanda Hari Akhirat",
    summary: "Tanda kecil dan tanda besar — Kiamat itu pasti, waktunya tidak diketahui.",
    body: [
      "Kedatangan Kiamat adalah pasti, tetapi waktunya ialah rahsia yang Allah simpan untuk diri-Nya. Apabila Nabi ﷺ sendiri ditanya bilakah ia akan datang, jawapan yang diberikan ialah orang yang ditanya tidak lebih mengetahui daripada orang yang bertanya — pengetahuannya hanya di sisi Allah (Al-Quran 7:187). Maka perkara pertama yang mesti dimuktamadkan sebelum mempelajari apa-apa 'tanda' ialah ini: tanda-tanda diberikan untuk menyediakan kita, bukan sekali-kali untuk membolehkan kita mengira tarikhnya. Sesiapa yang menetapkan satu tahun bagi Kiamat telah bercanggah dengan Al-Quran.",
      "Para ulama membahagikan petanda-petanda ini kepada dua jenis. Tanda-tanda kecil (al-'alamat al-sughra) ialah perubahan sosial, moral dan keduniaan secara beransur-ansur yang terkumpul sepanjang berabad-abad sebelum pengakhiran. Tanda-tanda besar (al-'alamat al-kubra) ialah sekumpulan peristiwa luar biasa yang tidak dapat disangkal, yang datang berturut-turut berhampiran pengakhiran. Al-Quran menyebut bahawa \"telah lahirlah tanda-tanda kedatangannya\" (Al-Quran 47:18) — rujukan yang difahami merangkumi kedatangan Nabi ﷺ sendiri dan peristiwa terbelahnya bulan.",
      "Nas utama bagi tanda-tanda besar ialah hadis Huzaifah bin Usaid, yang di dalamnya Nabi ﷺ menyenaraikan sepuluh: asap (Dukhan), Dajjal, binatang bumi (Dabbat al-Ardh), terbitnya matahari dari tempat terbenamnya (barat), turunnya Nabi Isa bin Maryam a.s., Ya'juj dan Ma'juj, serta tiga peristiwa tanah terbenam (khasf) yang besar — satu di timur, satu di barat dan satu di Semenanjung Tanah Arab — diakhiri dengan api yang menghalau manusia ke tempat perhimpunan mereka (Sahih Muslim 2901). Al-Mahdi dan Dajjal disebut dalam riwayat-riwayat sahih yang lain dan diletakkan sebelum turunnya Nabi Isa a.s.",
      "Pendirian ilmiah yang jujur ialah walaupun setiap tanda itu diakui, susunan tepatnya tidak ditetapkan sepenuhnya oleh nas, dan ulama Ahli Sunnah yang muktabar berbeza pendapat tentang urutan yang tepat. Perbezaan itu adalah sebahagian biasa daripada tradisi ilmu dan bukan punca pertelingkahan. Sambutan Nabi ﷺ terhadap semua ini bukanlah menakut-nakutkan atau spekulasi tanpa henti tentang peristiwa semasa, tetapi menambah iman, taubat dan amal yang bermanfaat.",
    ],
    appLinks: [{ label: "Tanda-tanda kecil" }, { label: "Tanda-tanda besar" }],
  },
  {
    title: "Tanda-tanda kecil",
    summary: "Perubahan beransur-ansur yang digambarkan oleh Nabi ﷺ — bersedia, bukan panik.",
    body: [
      'Tanda-tanda kecil ialah perubahan yang perlahan dan terkumpul dalam masyarakat, akhlak dan keadaan ilmu yang digambarkan oleh Nabi ﷺ sebagai semakin bertambah apabila Kiamat semakin hampir. Jumlahnya banyak, dan secara tabiinya ia berlaku sepanjang tempoh masa yang panjang, bukan dalam satu detik yang dramatik. Malah, tanda kecil yang paling besar telah pun berlaku: diutusnya Nabi Muhammad ﷺ sendiri, yang bersabda, "I and the Hour were sent like these two" (maksud dalam bahasa Inggeris), sambil merapatkan dua jari baginda — bermaksud rasul yang terakhir dan zaman yang terakhir telah bermula.',
      'Antara tanda yang disebut dalam hadis sahih: hilangnya amanah, sehingga urusan diserahkan kepada orang yang tidak layak — "When trust is lost, then await the Hour" (maksud dalam bahasa Inggeris), dan ini berlaku "when authority is given to those who do not deserve it" (maksud dalam bahasa Inggeris) (Sahih al-Bukhari 6496). Dalam hadis Jibril yang masyhur, Nabi ﷺ menyebut dua tanda yang jelas: "that the slave-girl will give birth to her mistress, and that you will see barefoot, naked, destitute shepherds competing in constructing tall buildings" (maksud dalam bahasa Inggeris) (Sahih Muslim 8).',
      'Tanda-tanda lain termasuklah masa terasa semakin cepat berlalu, bertambahnya gempa bumi dan pembunuhan, serta lenyapnya ilmu. Tentang ilmu, Nabi ﷺ menjelaskan mekanismenya dengan tepat: "The Hour will not be established until knowledge is taken away, earthquakes increase, time passes quickly, tribulations appear, and killing increases" (maksud dalam bahasa Inggeris) (Sahih al-Bukhari 1036). Baginda juga menerangkan bagaimana ilmu itu hilang: "Allah does not remove knowledge by snatching it from people, but by taking away the scholars, until none is left, and people take the ignorant as leaders who are asked and give verdicts without knowledge, so they go astray and lead others astray" (maksud dalam bahasa Inggeris) (Sahih al-Bukhari 100). Maka \'hilangnya ilmu\' bukanlah kekurangan maklumat — sesuatu zaman boleh tenggelam dalam lautan data — tetapi hilangnya ulama yang benar dan amalan yang dihayati.',
      "Satu disiplin yang penting di sini: mengisytiharkan bahawa sesuatu peristiwa moden tertentu 'adalah' penzahiran sesuatu hadis tertentu merupakan tafsiran, bukan kepastian. Perlumbaan membina bangunan pencakar langit atau jenayah yang semakin meningkat mungkin selari dengan sabda Nabi ﷺ, tetapi mengaitkan wahyu dengan tajuk berita secara yakin bukanlah cara ulama yang berhati-hati. Sambutan yang betul terhadap setiap tanda kecil adalah dari dalam diri: bacalah ia sebagai seruan untuk kembali kepada Allah, untuk mempelajari dan mengamalkan agama, dan untuk berpegang teguh kepada amanah dan kejujuran — bukan sebagai bahan kebimbangan atau tontonan.",
    ],
    disclaimer:
      "Mengaitkan tanda-tanda kecil tertentu dengan peristiwa semasa tertentu adalah tafsiran, bukan kepastian. Modul ini membentangkan hadis-hadis sahih tanpa menegaskan fenomena moden yang mana secara pasti menzahirkannya.",
    actions: [
      "Tuntutlah ilmu yang bermanfaat daripada guru yang berkelayakan, amalkannya dan sampaikannya — ini secara langsung menentang tanda lenyapnya ilmu.",
      "Jagalah amanah dan kejujuran dalam pertuturan, pekerjaan dan urusan anda.",
      "Bacalah setiap tanda ke dalam diri sebagai seruan untuk bertaubat, bukan sebagai bahan bakar kepanikan atau spekulasi di alam maya.",
    ],
  },
  {
    title: "Tanda-tanda besar",
    summary:
      "Sepuluh tanda besar dalam Sahih Muslim — al-Mahdi, Dajjal, Nabi Isa a.s. dan lain-lain.",
    body: [
      "Tanda-tanda besar ialah peristiwa-peristiwa agung yang tidak dapat disangkal, yang berhimpun berhampiran penghujung zaman. Piagamnya ialah hadis Huzaifah bin Usaid: Nabi ﷺ mendapati para sahabat baginda sedang membincangkan tentang Kiamat lalu bersabda bahawa ia tidak akan datang sehingga mereka melihat sepuluh tanda — asap (Dukhan), Dajjal, binatang bumi (Dabbat al-Ardh), terbitnya matahari dari barat, turunnya Nabi Isa bin Maryam a.s., Ya'juj dan Ma'juj, tiga peristiwa tanah terbenam (di timur, di barat dan di Tanah Arab), dan akhir sekali api yang menghalau manusia ke tempat perhimpunan mereka (Sahih Muslim 2901). Tidak seperti tanda-tanda kecil, apabila tanda-tanda ini bermula, ia datang susul-menyusul dengan rapat.",
      "Al-Mahdi disebut dalam riwayat-riwayat sahih sebagai pemimpin yang adil daripada keluarga Nabi ﷺ yang akan memenuhi bumi dengan keadilan sebagaimana ia telah dipenuhi dengan kezaliman (Sunan Abi Daud 4282, hasan). Beliau bukan pembawa syariat atau nabi baharu — beliau menghidupkan semula, bukan mencipta — dan Ahli Sunnah mengakui keimanan kepadanya sambil mengetepikan butiran tambahan dalam riwayat-riwayat yang lemah.",
      "Dajjal (al-Masih palsu) ialah ujian duniawi yang paling besar. Nabi ﷺ menggambarkannya dengan panjang lebar dalam hadis an-Nawwas bin Sam'an yang panjang (Sahih Muslim 2937): seorang penipu yang buta sebelah mata dengan tulisan 'Kafir' di antara kedua-dua matanya, diberi kuasa untuk menguji iman, dan setiap nabi telah memperingatkan kaumnya tentangnya. Fitnahnya dikalahkan bukan dengan hujah tetapi dengan iman yang teguh, dan Nabi ﷺ mengajar agar menghafaz ayat-ayat awal Surah al-Kahfi sebagai perlindungan.",
      "Nabi Isa bin Maryam a.s. kemudian akan turun — satu perkara akidah Ahli Sunnah yang teguh. Nabi ﷺ bersabda: \"By the One in whose Hand is my soul, the son of Maryam will soon descend among you as a just ruler; he will break the cross, kill the swine, and abolish the jizyah, and wealth will overflow until no one accepts it\" (maksud dalam bahasa Inggeris) (Sahih al-Bukhari 3448). Baginda turun sebagai pengikut Nabi Muhammad ﷺ, solat di belakang imam umat ini (Sahih al-Bukhari 3439), membunuh Dajjal, dan memerintah dengan syariat Nabi Muhammad ﷺ. Ya'juj dan Ma'juj kemudian dilepaskan, dan tanda-tanda yang selebihnya berlaku satu demi satu sehingga api yang menghimpunkan umat manusia.",
      "Dua perkara demi kejujuran. Pertama, para ulama sepakat tentang hakikat setiap tanda dalam hadis sepuluh tanda itu tetapi berbeza pendapat tentang susunan tepatnya, dan perbezaan itu sah serta telah lama wujud. Kedua, Dukhan dan binatang bumi adalah sebahagian daripada hadis sahih ini sendiri; sebahagian riwayat lain yang memperincikannya satu per satu berbeza-beza kekuatannya, maka modul ini menyandarkan keyakinan kepada riwayat sepuluh tanda yang kukuh, bukan kepada tambahan-tambahan yang lebih lemah.",
    ],
    disclaimer:
      "Hakikat tanda-tanda besar diakui, tetapi susunan dan waktu tepatnya tidak disepakati sepenuhnya oleh para ulama. Elakkan menetapkan tarikh dan elakkan mendakwa mana-mana tokoh masa kini sebagai al-Mahdi, Dajjal atau Nabi Isa a.s.",
    appLinks: [{ label: "Belajar Akidah — tanda-tanda" }],
  },
  {
    title: "Sangkakala",
    summary: "Israfil — tiupan pertama, tiupan kedua, dan kebangkitan.",
    body: [
      'Apabila Allah menetapkan pengakhiran, malaikat yang diamanahkan memegang Sangkakala (as-Sur) akan meniupnya. Penamaannya sebagai Israfil datang melalui tradisi ilmu para ulama; apa yang ditetapkan dengan teguh oleh Al-Quran ialah peristiwa itu sendiri dan kengeriannya. Nabi ﷺ menyampaikan betapa dekatnya ia pada setiap masa: "How can I be at ease when the bearer of the Trumpet has placed it to his mouth, bent his forehead, and is waiting for the command to blow?" (maksud dalam bahasa Inggeris) — dan apabila hal ini menggelisahkan para sahabat, baginda mengajar mereka menyebut, "Hasbunallah wa ni\'mal wakil" (Jami\' at-Tirmizi 2431, hasan).',
      'Terdapat dua tiupan, dan Al-Quran membezakan keduanya. Pada tiupan pertama, "akan ditiup sangkakala, maka pada waktu itu matilah makhluk-makhluk yang ada di langit dan yang ada di bumi, kecuali sesiapa yang dikehendaki Allah" (Al-Quran 39:68) — tiupan kengerian dan kematian yang menamatkan alam ciptaan. Kemudian datang tiupan kedua: "kemudian ditiup sangkakala sekali lagi, maka dengan serta merta mereka bangun berdiri menunggu" (sambungan ayat yang sama) — tiupan kebangkitan, yang dengannya seluruh makhluk bangkit daripada kematian.',
      'Ramai ulama, berdasarkan ayat yang sama dan riwayat-riwayat yang menyokongnya, menyebut tentang satu pengecualian — mereka yang "dikehendaki Allah" yang tidak mati — dan tentang satu tempoh di antara dua tiupan itu, walaupun panjang tempoh dan butirannya bersandarkan riwayat-riwayat yang berbeza kekuatannya dan diserahkan kepada Allah. Yang pasti ialah sepasang tiupan itu: satu pengakhiran, kemudian satu kebangkitan. Ia disebut "hari berlakunya amaran" (Al-Quran 50:20) kerana ia ialah seruan terakhir, yang dibunyikan ketika tiada lagi masa untuk bersedia — dan tepat kerana itulah seruan ini mesti disahut sekarang.',
    ],
  },
  {
    title: "Kebangkitan",
    summary: "Jasad dikembalikan — semua manusia tanpa kecuali berdiri di hadapan Allah.",
    body: [
      'Pada tiupan kedua, orang-orang yang mati dibangkitkan, jasad dan roh, dan kebangkitan ini benar-benar berlaku secara jasmani, bukan semata-mata rohani. Al-Quran menjawab secara langsung ejekan orang yang ragu: seorang lelaki mengangkat sekeping tulang yang reput lalu bertanya siapakah yang dapat menghidupkannya; jawapannya ialah: Katakanlah, "Tulang-tulang yang hancur itu akan dihidupkan oleh Tuhan yang telah menciptakannya pada awal mula wujudnya; dan Ia Maha Mengetahui akan segala keadaan makhluk-makhluk" (Al-Quran 36:78–79). Jika mewujudkan anda daripada tiada berada dalam kekuasaan Allah, mengembalikan anda tidaklah lebih sukar.',
      'Kebangkitan ini menyeluruh — setiap manusia dari yang pertama hingga yang terakhir, daripada setiap bangsa, akan dibangkitkan. Nabi ﷺ menggambarkan keadaan manusia ketika bangkit: "People will be gathered barefoot, naked and uncircumcised" (maksud dalam bahasa Inggeris). Apabila Aisyah r.a. bertanya dengan cemas sama ada lelaki dan perempuan akan saling memandang, baginda bersabda bahawa urusan Hari itu terlalu dahsyat untuk sesiapa pun mempedulikan hal tersebut (Sahih al-Bukhari 6527). Baginda juga bersabda, "You will be gathered barefoot, naked and uncircumcised — and the first to be clothed on the Day of Resurrection will be Ibrahim" (maksud dalam bahasa Inggeris) (Sahih al-Bukhari 3349).',
      'Inti akidah ini bukanlah tontonannya, tetapi tanggungjawab yang ditegakkannya. Oleh kerana kembali kepada Allah itu pasti, tiada amalan yang benar-benar tersembunyi dan tiada kematian yang benar-benar menjadi jalan lari. "Dan bahawa sesungguhnya hari kiamat itu tetap akan datang, tidak ada sebarang syak padanya, dan bahawa sesungguhnya Allah akan membangkitkan (menghidupkan semula) orang-orang yang di dalam kubur" (Al-Quran 22:7). Beriman kepada kebangkitan jasad itulah yang menjadikan beban moral kehidupan ini nyata, bukan sementara.',
    ],
  },
  {
    title: "Perhimpunan (Mahsyar)",
    summary: "Berdiri di hadapan Allah — matahari didekatkan, peluh, dan keadaan manusia.",
    body: [
      'Selepas kebangkitan, seluruh makhluk dihalau ke sebuah padang yang luas lagi rata — Mahsyar — untuk menunggu pengadilan. Bumi itu sendiri diubah: "masa hari bumi ini diganti dengan yang lain, demikian juga langit; dan manusia semuanya keluar berhimpun mengadap Allah, Yang Maha Esa, lagi Maha Kuasa" (Al-Quran 14:48). Tiada mercu tanda, tiada orang ramai untuk menyorok, tiada kedudukan untuk bersandar — hanya setiap jiwa, terdedah dan menunggu.',
      'Keadaan berdiri itu amat berat. Nabi ﷺ bersabda, "On the Day of Resurrection the sun will be brought so near to people that it will be a mile away, and they will sink in their sweat according to their deeds — some to their ankles, some to their knees, some to their waists, and some the sweat will bridle" (maksud dalam bahasa Inggeris) (Sahih Muslim 2864). Namun riwayat-riwayat yang sama turut menggambarkan rahmat yang diagihkan menurut amalan: satu golongan yang disebut oleh Nabi ﷺ akan dinaungi di bawah naungan Arasy Allah pada hari yang tiada naungan selain naungan-Nya — antaranya pemimpin yang adil, pemuda yang membesar dalam ibadah, dan orang yang bersedekah secara sembunyi sehingga tangan kirinya tidak mengetahui apa yang dibelanjakan oleh tangan kanannya.',
      "Penantian itu panjang — Al-Quran menyebut tentang suatu hari yang kadarnya lima puluh ribu tahun (Al-Quran 70:4) — tetapi panjangnya tidak sama bagi semua orang. Riwayat-riwayat yang sahih menyatakan ia akan diringankan bagi orang beriman, sesingkat masa di antara dua solat, sedangkan ia amat menekan bagi yang lain. Maka Mahsyar ialah tempat lembaran peribadi sesebuah kehidupan menjadi kenyataan yang terbuka: matahari yang sama, padang yang sama, tetapi pengalaman yang sama sekali berbeza, yang seluruhnya berpunca daripada apa yang telah dihantar terlebih dahulu oleh setiap orang.",
    ],
  },
  {
    title: "Syafaat",
    summary: "Hanya dengan izin Allah — jenis-jenisnya dan syafaat yang paling agung.",
    body: [
      'Syafaat ialah perantaraan — satu pihak memohon kepada Allah bagi pihak yang lain. Ia benar dan ia adalah rahmat, tetapi ia tidak pernah berdiri sendiri: tiada sesiapa yang memberi syafaat kecuali dengan izin Allah terlebih dahulu dan hanya untuk orang yang Dia redai. Al-Quran menyatakan kaedah ini dua kali: "Tiada sesiapa yang dapat memberi syafaat (pertolongan) di sisiNya melainkan dengan izinNya" (Al-Quran 2:255), dan "Dan tidak berfaedah syafaat di sisi Allah kecuali bagi orang yang telah diizinkan Allah" (Al-Quran 34:23). Syarat tunggal inilah yang memisahkan akidah Islam tentang syafaat daripada segala penyelewengannya.',
      "Syafaat yang paling agung ialah asy-Syafa'ah al-'Uzma, yang khusus bagi Nabi Muhammad ﷺ. Di Mahsyar, ketika manusia tertekan oleh berdiri yang lama, mereka akan pergi dari seorang nabi kepada seorang nabi — Adam, Ibrahim, Musa, Isa a.s. — setiap seorang memohon uzur, sehingga mereka datang kepada Nabi Muhammad ﷺ. Baginda akan sujud di bawah Arasy lalu dikatakan kepada baginda, \"Raise your head, ask and you will be given, intercede and your intercession will be accepted\" (maksud dalam bahasa Inggeris) (Sahih al-Bukhari 7440; rangkaian penuh para nabi terdapat dalam Sahih Muslim 195). Dengannya baginda memohon kepada Allah agar memulakan hisab dan meringankan penantian itu — satu kedudukan terpuji yang dijanjikan kepada baginda seorang sahaja.",
      "Bentuk-bentuk lain yang sahih menyusul: syafaat agar sebahagian orang beriman masuk Syurga tanpa hisab; syafaat yang mengangkat darjat; dan yang terutama, syafaat bagi pelaku dosa besar dalam kalangan orang beriman, sehingga manusia dikeluarkan dari Neraka melalui syafaat Nabi ﷺ, para nabi yang lain, para malaikat, orang-orang beriman, dan akhirnya rahmat Allah, Yang Maha Penyayang daripada segala yang penyayang. Para nabi, para syuhada, orang-orang soleh, malah kanak-kanak yang meninggal dunia ketika kecil boleh memberi syafaat dengan izin-Nya, walaupun kekuatan riwayat-riwayat tertentu berbeza-beza.",
      "Peringatan yang penting: syafaat di Akhirat sama sekali tidak membenarkan menyeru orang yang telah mati atau yang ghaib untuk meminta pertolongan sekarang. Menyeru seorang nabi atau wali di dalam kubur, meminta mereka menghilangkan kesusahan atau menunaikan hajat, ialah menghalakan ibadah kepada selain Allah — itu ialah syirik, dan ia bertentangan dengan syafaat yang digambarkan di sini, iaitu kurniaan yang Allah berikan pada Hari itu kepada sesiapa yang Dia kehendaki. Ia juga tidak menggantikan keperluan kepada iman dan taubat dalam kehidupan ini; ia adalah rahmat Allah kepada mereka yang hidup dan mati di atas tauhid.",
    ],
    misconceptions: [
      "Salah faham: Memohon syafaat bermakna Nabi ﷺ atau orang-orang soleh disembah. Pembetulan: Ibadah hanya milik Allah; syafaat pada Hari Akhirat ialah rahmat yang Allah kurniakan dengan izin-Nya, dan ia tidak membenarkan menyeru orang yang telah mati dalam kehidupan ini.",
    ],
  },
  {
    title: "Kitab Catatan Amalan",
    summary: "Malaikat pencatat — tangan kanan, tangan kiri, tiada yang tertinggal.",
    body: [
      'Setiap manusia mempunyai dua malaikat pencatat yang mulia yang ditugaskan merekodkan amalannya: "Semasa dua malaikat (yang mengawal dan menjaganya) menerima dan menulis segala perkataan dan perbuatannya; yang satu duduk di sebelah kanannya, dan yang satu lagi di sebelah kirinya. Tidak ada sebarang perkataan yang dilafazkannya (atau perbuatan yang dilakukannya) melainkan ada di sisinya malaikat pengawas yang sentiasa sedia (menerima dan menulisnya)" (Al-Quran 50:17–18). Pada Hari Akhirat, catatan-catatan ini diserahkan, dan cara seseorang menerima kitabnya itu sendiri merupakan keputusan yang pertama — dengan tangan kanan bagi yang berjaya, dengan tangan kiri atau dari belakang badan bagi yang binasa (Al-Quran 84:7–12; 69:19–37).',
      'Tiada apa yang tertinggal daripada catatan ini — tidak juga amalan yang paling kecil, tidak juga lintasan fikiran yang menjadi perbuatan. Orang-orang yang zalim akan terpinga-pinga melihat kelengkapannya: "Aduhai celakanya kami, mengapa kitab ini demikian keadaannya? Ia tidak meninggalkan yang kecil atau yang besar, melainkan semua dihitungnya! Dan mereka dapati segala yang mereka kerjakan itu sedia (tertulis di dalamnya); dan (ingatlah) Tuhanmu tidak berlaku zalim kepada seseorangpun" (Al-Quran 18:49). Dengan rahmat Allah, niat-niat yang baik dan dosa-dosa yang ditinggalkan juga dicatat sebagai kebaikan bagi orang beriman.',
      'Oleh kerana lidah dan anggota badanlah yang mengisi halaman-halaman itu, menjaga kedua-duanya bermakna menjaga catatan itu. Nabi ﷺ menjadikan lidah sebagai teras keselamatan: "Whoever guarantees me what is between his jaws and what is between his legs, I guarantee him Paradise" (maksud dalam bahasa Inggeris) (Sahih al-Bukhari 6474) — iaitu sesiapa yang memelihara lidah dan kehormatan dirinya. Tabiat harian bermuhasabah dengan jujur — bertanya apakah yang ditambah oleh hari ini ke dalam kitab itu — ialah antara amalan yang paling menginsafkan dan bermanfaat yang boleh dipegang oleh seorang mukmin.',
    ],
    actions: [
      "Jagalah lidah melebihi hampir segala-galanya — kebanyakan yang mengisi catatan amalan, baik atau buruk, melaluinya.",
      "Muhasabah hari anda sebelum tidur: tanyalah apa yang anda ingin, dan apa yang anda takut, lihat tertulis dalam kitab anda.",
    ],
    appLinks: [{ label: "Jurnal solat" }],
  },
  {
    title: "Mizan (Neraca)",
    summary: "Amalan ditimbang — keikhlasan, akhlak dan zikir memberatkan neraca.",
    body: [
      'Mizan ialah neraca yang menimbang amalan dengan keadilan yang mutlak: "Kami akan mengadakan neraca timbangan yang adil untuk (menimbang amal makhluk-makhluk pada) hari kiamat; maka tidak ada diri sesiapa akan teraniaya sedikitpun; dan jika (amalnya) itu seberat biji sawi (sekalipun), nescaya Kami akan mendatangkannya (untuk ditimbang dan dihitung); dan cukuplah Kami sebagai Penghitung" (Al-Quran 21:47). Ahli Sunnah menetapkannya sebagai neraca yang sebenar, bukan sekadar kiasan — amalan, atau catatan amalan itu, benar-benar ditimbang. Nasib seseorang bergantung pada dulang yang mana lebih berat: "adapun orang yang berat timbangan amal baiknya, maka ia berada dalam kehidupan yang senang lenang. Sebaliknya orang yang ringan timbangan amal baiknya, maka tempat kembalinya ialah Haawiyah" (Al-Quran 101:6–9).',
      'Yang memberatkan neraca bukanlah semata-mata banyaknya aktiviti, tetapi beratnya di sisi Allah — dan berat itu datang daripada keikhlasan. Nabi ﷺ menunjukkan amalan yang mudah tetapi besar nilainya: "Two words light on the tongue, heavy on the Scale, beloved to the Most Merciful: SubhanAllahi wa bihamdih, SubhanAllahil-\'Azim" (maksud dalam bahasa Inggeris) (Sahih al-Bukhari 6406). Baginda juga bersabda, "Nothing is heavier on the believer\'s Scale on the Day of Resurrection than good character" (maksud dalam bahasa Inggeris) (Jami\' at-Tirmizi 2002, hasan). Maka zikir yang ringkas yang diulang dengan ikhlas, atau budi pekerti yang sabar, boleh mengatasi segunung aktiviti yang menunjuk-nunjuk.',
      "Sebaliknya ialah bahaya amalan yang kosong. Perbuatan yang dilakukan untuk dilihat orang (riyak) atau yang dicemari oleh kemunafikan boleh tiba di neraca tanpa berat — besar pada zahirnya, kosong pada batinnya. Inilah sebabnya keikhlasan bukan sekadar satu kebaikan antara banyak kebaikan, tetapi ialah perkara yang memberikan berat kepada setiap amalan yang lain. Pengajarannya ialah membina hari di sekeliling amalan-amalan kecil yang ikhlas dan berterusan, serta membersihkan niat di sebalik amalan-amalan yang zahir.",
      "Al-Quran dan Sunnah tidak memberikan senarai kedudukan bernombor yang lengkap bagi setiap amalan. Kedua-duanya menggunakan ungkapan seperti 'berat di Mizan', 'memenuhi Mizan' dan 'tiada yang lebih berat'. Lihat pelajaran pengiring Berat di Mizan untuk katalog amalan yang digambarkan oleh nas-nas sahih dengan bahasa sedemikian — sentiasa bersama sumber rujukannya — supaya anda dapat mengamalkan apa yang dijadikan berat oleh Nabi ﷺ tanpa mencipta papan kedudukan yang tidak pernah diwahyukan oleh Allah.",
    ],
    appLinks: [{ label: "Berat di Mizan" }, { label: "Tasbih" }, { label: "Zikir" }],
  },
  {
    title: "Hisab (Pertanggungjawaban)",
    summary:
      "Hisab yang mudah, hisab yang terperinci, dan hak-hak yang terhutang kepada orang lain.",
    body: [
      "Hisab ialah perhitungan, ketika setiap orang dipanggil untuk mempertanggungjawabkan hidupnya. Al-Quran menggambarkan dua pengalaman yang sangat berbeza: \"Kemudian sesiapa yang diberi menerima surat amalnya dengan tangan kanannya, maka ia akan dihisab dengan cara yang mudah dan ringan, dan ia akan pergi kepada keluarganya (yang beriman) dengan sukacita. Dan sesiapa yang diberi menerima surat amalnya (dengan tangan kiri), dari sebelah belakangnya, maka ia akan meraung menyebut-nyebut kebinasaannya\" (Al-Quran 84:7–11). 'Hisab yang mudah' itu ialah rahmat, bukan ketiadaan pemeriksaan — Nabi ﷺ memperingatkan bahawa soal siasat yang teliti itu sendiri adalah sejenis azab.",
      'Isteri Nabi ﷺ sendiri meriwayatkan perbezaan yang penting ini. Aisyah r.a. meriwayatkan baginda bersabda, "Whoever is called to account will be destroyed" (maksud dalam bahasa Inggeris). Beliau bertanya: Bukankah Allah berfirman, "Maka ia akan dihisab dengan cara yang mudah dan ringan"? Baginda menjawab, "That is only the presenting of deeds; but whoever is interrogated over the account will be destroyed" (maksud dalam bahasa Inggeris) (Sahih al-Bukhari 6537). Maka harapan orang beriman bukanlah terlepas daripada segala pemeriksaan, tetapi diperlihatkan amalannya, ditutup dosa-dosanya dan diampunkan — bukannya disoal siasat satu demi satu.',
      'Ada satu jenis hutang yang tidak dipadamkan begitu sahaja walaupun dengan keampunan Allah: hak-hak sesama manusia (huquq al-\'ibad). Nabi ﷺ bertanya, "Do you know who is bankrupt?" (maksud dalam bahasa Inggeris) Para sahabat menjawab: Orang yang tidak mempunyai wang. Baginda bersabda, "The bankrupt of my ummah is one who comes on the Day of Resurrection with prayer, fasting and charity, but who insulted this one, slandered that one, took the wealth of another, and shed the blood of another — so his good deeds are handed over to them, and when his good deeds run out their sins are loaded onto him, and he is thrown into the Fire" (maksud dalam bahasa Inggeris) (Sahih Muslim 2581). Ibadah tidak membatalkan kezaliman; hanya menyelesaikan kezaliman itu yang dapat membatalkannya.',
      "Kesimpulan praktikalnya mendesak dan khusus: hutang yang belum dibayar, harta yang dicuri, fitnah dan amanah yang dikhianati mesti diperbetulkan dalam kehidupan ini — melalui taubat kepada Allah serta ganti rugi dan permohonan maaf kepada manusia — kerana jauh lebih murah untuk menyelesaikannya sekarang dengan mata wang harta dan kerendahan hati berbanding nanti dengan mata wang amal kebaikan. Dan dalam semua ini, keadilan Allah adalah sempurna dan rahmat-Nya meliputi setiap orang yang berusaha dengan ikhlas dan bertaubat.",
    ],
    actions: [
      "Langsaikan hutang dan pulangkan apa sahaja yang diambil secara zalim, walau sekecil mana pun, sebelum hari yang ditetapkan itu tiba.",
      "Carilah dan mohonlah maaf daripada sesiapa yang pernah anda zalimi dari segi kata-kata, harta atau maruah — menebusnya sekarang jauh lebih murah daripada menebusnya nanti.",
      "Bertaubatlah kepada Allah atas hak-hak-Nya, dan pastikan kedua-dua lembaran — hak Allah dan hak manusia — sentiasa bersih.",
    ],
    appLinks: [{ label: "Qada & hutang" }],
  },
  {
    title: "Telaga (Haudh)",
    summary: "Telaga Nabi ﷺ — siapa yang dapat minum dan siapa yang dihalau.",
    body: [
      'Haudh ialah telaga besar yang dikurniakan kepada Nabi Muhammad ﷺ pada Hari Kiamat, satu rahmat bagi umat baginda yang kehausan pada Hari yang terik dan meletihkan itu. Gambaran tentangnya banyak dan sahih: "My Hawd is a month\'s journey across; its water is whiter than milk, its fragrance sweeter than musk, and its cups are like the stars of the sky. Whoever drinks from it will never thirst again" (maksud dalam bahasa Inggeris) (Sahih al-Bukhari 6579). Beriman kepada Haudh ialah sebahagian daripada akidah Ahli Sunnah, yang ditetapkan oleh riwayat-riwayat yang mutawatir.',
      'Nabi ﷺ sendiri akan menyambut para pengikut baginda di sana: "I will reach the Hawd before you, and I will be watching for those of you who come to me" (maksud dalam bahasa Inggeris) (Sahih Muslim 2292). Baginda mengenali umatnya melalui cahaya pada wajah, tangan dan kaki mereka daripada kesan wuduk. Sampai kepadanya bermakna hilang dahaga selama-lamanya; menurut pemahaman yang kukuh, ia disalurkan oleh al-Kautsar, sungai yang Allah kurniakan kepada Nabi-Nya ﷺ di Syurga.',
      'Namun ada yang akan dihalau dari Haudh. Nabi ﷺ menggambarkan bahawa baginda diberitahu tentang sebahagian orang, "They are not of you; they changed and altered the religion after you" (maksud dalam bahasa Inggeris), atau mereka berpaling ke belakang selepas pemergian baginda. Para ulama amat berhati-hati dalam hal ini: ia merujuk kepada golongan tertentu yang disebut dalam hadis — seperti murtad dan bidaah yang berat dan disengajakan dalam agama selepas petunjuk yang jelas — dan ia sama sekali bukan lesen bagi umat Islam biasa untuk saling melemparkan tuduhan itu. Jalan yang selamat menuju Haudh ialah berpegang kepada Sunnah, menjaga wuduk dan solat, serta memelihara perpaduan orang-orang beriman.',
    ],
    disclaimer:
      "Riwayat-riwayat tentang mereka yang dihalau dari Haudh merujuk kepada golongan tertentu yang disebut dalam hadis, terutamanya murtad dan bidaah yang berat dalam agama. Ia bukan lesen bagi umat Islam untuk saling menyesatkan antara satu sama lain.",
  },
  {
    title: "Titian (Sirat)",
    summary: "Menyeberangi Neraka — kelajuan menurut amalan dan rahmat.",
    body: [
      'Sirat ialah titian yang terbentang di atas Neraka, dan setiap orang mesti melaluinya — orang beriman dan orang kafir sama sahaja. Al-Quran menetapkan penyeberangan ini tanpa kecuali: "Dan tiada seorangpun di antara kamu melainkan akan sampai kepadanya; (yang demikian) adalah satu perkara yang mesti (berlaku) yang telah ditetapkan oleh Tuhanmu. Kemudian Kami akan selamatkan orang-orang yang bertaqwa, dan kami akan biarkan orang-orang yang zalim (dengan kekufurannya dan maksiatnya) tinggal berlutut di dalam neraka itu" (Al-Quran 19:71–72). Melaluinya adalah untuk semua; sampai dengan selamat ke seberang itulah perkara yang sebenar, dan ia dikurniakan oleh Allah kepada mereka yang Dia lindungi.',
      'Cara seseorang menyeberang ditentukan oleh amalan yang dibawanya. Nabi ﷺ menggambarkannya: "The bridge will be placed over Hell… and the first of you will pass like lightning, then like the wind, then like birds, then like a running man — according to their deeds — while your Prophet stands on the bridge saying: O Lord, keep them safe, keep them safe. Some are saved unscathed, some are scratched and let go, and some are cast into the Fire" (maksud dalam bahasa Inggeris) (Sahih al-Bukhari 6573). Di sisi titian itu, dalam riwayat yang sama, berdiri amanah dan tali silaturahim — gambaran yang menyentuh bahawa kesetiaan dalam amanah dan ikatan kekeluargaan benar-benar menemani seseorang ketika menyeberang.',
      "Cahaya dan kelajuan di atas Sirat diusahakan dalam kehidupan ini. Solat yang ditunaikan tepat pada waktunya, sedekah yang diberikan secara berterusan, kejujuran dalam urusan, dan akhlak yang baik pada hakikatnya menjadi pijakan dan cahaya yang dengannya seseorang menyeberang. Nabi ﷺ akan memberi syafaat kepada orang-orang beriman di sana, dan hanya dengan rahmat Allah sesiapa pun dapat sampai ke seberang.",
      "Seperti peringkat-peringkat ghaib yang lain, jalan yang bijak bukanlah berspekulasi tentang ukuran fizikal titian itu — betapa halus, betapa tajam, betapa panjang — melebihi apa yang dinyatakan oleh wahyu, tetapi menumpukan sepenuhnya kepada amalan yang meringankan penyeberangan itu. Apa yang tidak dapat anda bayangkan, tetap dapat anda bersedia untuknya.",
    ],
    actions: [
      "Tunaikan solat lima waktu tepat pada waktunya — solat ialah cahaya yang memimpin menyeberangi titian.",
      "Bersedekahlah secara berterusan, walaupun dalam jumlah yang kecil.",
      "Sambunglah silaturahim dan jagalah amanah anda — dalam hadis, kedua-duanya berdiri di sisi Sirat itu sendiri.",
    ],
  },
  {
    title: "Syurga",
    summary: "Ganjaran yang kekal — nikmatnya dan, yang paling utama, melihat Allah.",
    body: [
      'Syurga (Jannah) ialah tempat tinggal kekal yang Allah sediakan untuk orang-orang beriman, satu hakikat yang melampaui jangkauan khayalan. Dalam sebuah hadis qudsi, Nabi ﷺ menyampaikan bahawa Allah berfirman tentangnya: "I have prepared for My righteous servants what no eye has seen, no ear has heard, and no human heart has ever conceived" (maksud dalam bahasa Inggeris) (Sahih al-Bukhari 3244). Sungai-sungainya, taman-tamannya, istana-istananya dan teman-temannya digambarkan dalam Al-Quran untuk menarik hati, tetapi gambaran itu hanyalah petunjuk kepada kebahagiaan yang jauh melampauinya.',
      'Ganjaran yang paling agung bukanlah mana-mana taman atau sungai, tetapi keredaan Allah dan melihat Wajah-Nya. "Pada hari akhirat itu, muka (orang-orang yang beriman) berseri-seri, melihat kepada Tuhannya" (Al-Quran 75:22–23) — difahami oleh Ahli Sunnah sebagai orang-orang beriman melihat Allah di Akhirat, kemuncak nikmat Syurga, yang dikurniakan dengan cara yang layak dengan keagungan-Nya dan tanpa menyerupai makhluk. Allah berjanji: "Untuk orang-orang yang berusaha menjadikan amalnya baik dikurniakan segala kebaikan serta satu tambahan yang mulia" (Al-Quran 10:26) — dan \'tambahan\' itu dijelaskan dalam hadis sahih sebagai melihat Wajah-Nya yang mulia.',
      "Masuk ke Syurga adalah dengan rahmat Allah, yang dicapai melalui iman dan amal soleh — kedua-duanya tidak pernah bertentangan: rahmat ialah sebabnya, dan amalan ialah tanda serta jalan yang Allah kaitkan dengannya. Bagi ahli Syurga, Hari Akhirat berakhir dengan nikmat yang tidak pernah pudar dan tidak pernah berakhir. Modul ini sengaja membincangkan Syurga secara ringkas; panduan penuh Perjalanan ke Syurga membincangkan pintu-pintunya, darjat-darjatnya, amalan yang membawa kepadanya, dan doa-doa untuknya dengan mendalam.",
    ],
    appLinks: [{ label: "Perjalanan ke Syurga" }, { label: "Belajar Akidah — Syurga" }],
  },
  {
    title: "Neraka",
    summary: "Amaran yang benar — azab yang nyata, dan pintu keselamatan selagi masih hidup.",
    body: [
      'Neraka Jahanam ialah tempat azab yang nyata, bukan simbol atau kiasan bagi keadaan jiwa yang buruk. Beriman kepadanya ialah sebahagian daripada beriman kepada perkara ghaib dan kepada keadilan Allah. Al-Quran memberi amaran dengan jelas dan tegas: "Dan bagi orang-orang yang kufur ingkar terhadap Tuhan mereka, disediakan azab neraka Jahannam, dan itulah seburuk-buruk tempat kembali" (Al-Quran 67:6). Kedahsyatannya digambarkan untuk menyedarkan, bukan untuk memuaskan rasa ingin tahu: "api neraka yang bahan-bahan bakarannya: manusia dan batu-batu (berhala)" (Al-Quran 2:24), yang dijaga oleh malaikat-malaikat yang keras yang tidak menderhakai Allah dalam apa yang Dia perintahkan.',
      "Tujuan amaran-amaran ini ialah rahmat yang tersembunyi. Ia wujud untuk mematahkan kesombongan, menghentikan penolakan kebenaran yang berterusan, dan mengembalikan seseorang sebelum terlambat. Itulah sebabnya amaran dalam Al-Quran hampir selalu digandingkan dengan pintu taubat yang terbuka — tujuan menggambarkan api neraka ialah tepat supaya manusia menjauhinya selagi mereka masih mampu. Azabnya adil: tiada sesiapa yang memasukinya kecuali melalui pilihannya sendiri yang berterusan menentang petunjuk yang jelas, dan Allah tidak menzalimi sesiapa pun.",
      "Bagi orang-orang beriman yang membawa dosa, akidah Ahli Sunnah yang benar ialah keseimbangan antara takut dan harap: pelaku dosa berada di bawah kehendak Allah — Dia boleh mengampunkannya, atau menyucikannya di dalam api neraka lalu, melalui syafaat dan rahmat yang telah digambarkan sebelum ini, mengeluarkan daripadanya setiap orang yang memiliki iman walau sebesar zarah. Modul ini sengaja membincangkan Neraka secara ringkas dan sederhana. Kajian yang lebih lengkap tentang amaran-amarannya, dosa-dosa besar, serta pintu taubat dan rahmat yang luas terdapat dalam modul Memahami Jahanam dan topik-topik akidah yang berkaitan — sentiasa didekati dengan harapan, tidak pernah dengan putus asa.",
    ],
    appLinks: [{ label: "Memahami Jahanam" }, { label: "Belajar Akidah — Neraka" }],
  },
  {
    title: "Siapakah yang masuk tanpa hisab?",
    summary:
      "Hadis sahih tentang mereka yang terlepas daripada hisab terperinci — perbincangan ulama.",
    body: [
      'Antara rahmat Hari Akhirat ialah segolongan daripada umat ini akan masuk Syurga tanpa hisab sama sekali. Nabi ﷺ bersabda, "Seventy thousand of my ummah will enter Paradise without reckoning" (maksud dalam bahasa Inggeris), dan dalam lafaz yang lain, "with each thousand seventy thousand more" (maksud dalam bahasa Inggeris). Apabila para sahabat tertanya-tanya siapakah mereka, baginda menggambarkan mereka: "They are those who do not seek ruqyah from others, do not believe in evil omens, do not use cauterisation, and who place their trust in their Lord" (maksud dalam bahasa Inggeris) (Sahih al-Bukhari 6541).',
      "Teras gambaran itu ialah tawakal — pergantungan yang mendalam dan aktif kepada Allah — disertai kebebasan daripada khurafat dan daripada pergantungan yang resah kepada sebab-musabab. Ia tidak mencela usaha mendapatkan rawatan perubatan yang dibenarkan; ruqyah yang dibacakan sendiri ke atas diri dan ubat yang halal kedua-duanya ditetapkan dalam Sunnah. Yang dipuji ialah orang yang pergantungannya sepenuhnya kepada Allah sehingga dia tidak berkeliling meminta azimat rohani daripada orang lain atau berpaut kepada petanda sial.",
      "Para ulama membincangkan bilangan itu sendiri: ada yang berpendapat tujuh puluh ribu itu adalah harfiah, ada yang berpendapat ia digandakan dengan banyak berdasarkan riwayat-riwayat tambahan, dan ada pula yang berpendapat ia menandakan limpahan kurniaan Allah yang tidak terhitung, bukan jumlah kepala yang tetap. Yang mereka sepakati ialah kebenaran yang mendasarinya — bahawa rahmat Allah jauh melebihi apa yang dijangkakan oleh kiraan manusia, dan keselamatan yang muktamad adalah dengan rahmat itu.",
      "Ini ialah kedudukan harapan, bukan celah untuk bermalas-malasan. Ia mendorong orang beriman ke arah pergantungan yang sebenar kepada Allah dan menjauhi khurafat, sambil terus berusaha dalam ibadah. Tiada sesiapa yang memperolehnya dengan mengabaikan amalan; seseorang ditarik ke arahnya melalui keikhlasan, tawakal, dan hati yang terikat kepada Allah, bukan kepada azimat dan ketakutan.",
    ],
    disclaimer:
      "Para ulama berbeza pendapat sama ada 'tanpa hisab' bermaksud tujuh puluh ribu yang tetap atau bilangan yang jauh lebih besar dan tidak terhitung. Semua sepakat bahawa keselamatan yang muktamad adalah dengan rahmat Allah, dan bahawa ini ialah sebab untuk berharap, bukan untuk mengabaikan amalan.",
  },
  {
    title: "Bersedia untuk Hari Akhirat",
    summary: "Ibadah yang praktikal — kaitkan setiap tabiat dengan pertemuan anda dengan Allah.",
    body: [
      "Selepas menelusuri seluruh perjalanan — kematian, kubur, tanda-tanda, Sangkakala, perhimpunan, kitab catatan amalan, Mizan, hisab, Titian Sirat, dan dua tempat tinggal itu — satu-satunya sambutan yang waras ialah bersedia. Tetapi bersedia bukan bermakna panik. Nabi ﷺ tidak pernah meninggalkan para sahabat baginda dalam ketakutan dan lumpuh; baginda meninggalkan mereka dalam keadaan beramal. Asas kepada semua ini ialah tauhid dan keikhlasan (ikhlas): sesuatu amalan hanya diterima apabila dilakukan semata-mata kerana Allah dan menepati Sunnah, maka sebelum menambah lebih banyak amalan, bersihkanlah niat di sebalik amalan yang sudah ada.",
      'Binalah hari anda di atas tiang-tiang yang dijadikan berat di Mizan oleh nas-nas. Solat tepat pada waktunya ialah sauh dan cahaya di atas Sirat. Al-Quran — dibaca, didengar dan ditadabbur, walaupun beberapa ayat sehari — memastikan hati terus hidup. Taubat membersihkan catatan amalan: "Wahai orang-orang yang beriman! Bertaubatlah kamu kepada Allah dengan Taubat Nasuha" (Al-Quran 66:8). Sedekah menyucikan harta dan kekal selepas anda tiada sebagai sedekah jariah. Zikir memastikan lidah berat di Mizan dengan kalimah yang ringan di lidah. Dan akhlak yang baik, sabda Nabi ﷺ, ialah perkara paling berat yang diletakkan di atas Mizan.',
      "Jagalah dua perkara yang dikaitkan oleh Nabi ﷺ secara langsung dengan Syurga — lidah dan kehormatan diri (Sahih al-Bukhari 6474) — kerana kedua-dua inilah, lebih daripada dosa-dosa yang dramatik, yang secara senyap mengisi atau memuflisakan sesebuah catatan amalan. Dan selesaikanlah hak-hak manusia selagi anda masih mampu: bayar hutang, pulangkan apa yang diambil, mohon maaf atas kemudaratan, dan berlaku adil dalam setiap urusan, supaya anda tidak sekali-kali tiba sebagai 'si muflis' yang solatnya habis dimakan oleh tuntutan orang-orang yang pernah dizaliminya.",
      'Segala-galanya bersandar pada satu niat, sebagaimana dinyatakan dalam hadis pertama Sahih al-Bukhari: "Actions are but by intentions" (maksud dalam bahasa Inggeris). Gunakan penjejak Munib bukan sebagai markah untuk dipertandingkan, tetapi sebagai perancah yang lembut bagi tabiat-tabiat ini — solat, Al-Quran, zikir, sedekah, taubat — yang setiap satunya secara senyap mengarahkan hari anda menuju pertemuan dengan Allah. Itulah seluruh matlamatnya: hidup sekarang sebagai seseorang yang benar-benar menjangka akan berdiri di hadapan-Nya.',
    ],
    actions: [
      "Tunaikan solat lima waktu tepat pada waktunya.",
      "Baca atau dengar Al-Quran setiap hari — walaupun beberapa ayat.",
      "Amalkan zikir pagi dan petang.",
      "Bersedekahlah secara berterusan, walaupun dalam jumlah yang kecil.",
      "Bertaubatlah setiap hari dan mohonlah keampunan dengan ikhlas.",
      "Jagalah lidah dan kehormatan diri, dan tunaikan setiap janji dan amanah.",
      "Tunaikan hak-hak yang terhutang kepada keluarga, jiran dan pemiutang.",
      "Renungkan dalam jurnal solat anda tentang khusyuk dan keikhlasan niat.",
    ],
    appLinks: [
      { label: "Papan pemuka Persediaan Saya" },
      { label: "Berat di Mizan" },
      { label: "Belajar Solat" },
      { label: "Belajar Al-Quran" },
      { label: "Belajar Doa" },
      { label: "Belajar Akidah" },
      { label: "Penjejak solat" },
    ],
  },
  {
    title: "Berat di Mizan",
    summary:
      "Amalan yang disebut oleh nas-nas sahih sebagai berat, memenuhi, atau terbaik — tanpa mencipta senarai kedudukan.",
    body: [
      "Al-Quran dan Sunnah yang sahih tidak menerbitkan papan kedudukan yang lengkap bagi setiap amalan. Sebaliknya, kedua-duanya menggambarkan sebahagian amalan dengan bahasa Mizan yang jelas — 'tiada yang lebih berat', 'berat di Mizan', 'memenuhi Mizan' — dan sebahagian yang lain sebagai 'terbaik', 'paling dikasihi', atau setara pahalanya dengan suatu amalan yang besar. Ungkapan-ungkapan itu kadangkala menjawab soalan yang berbeza dalam konteks yang berbeza, maka para ulama mengelak daripada berkata 'yang ini sentiasa nombor satu'. Berikut ialah katalog yang teliti tentang apa yang dinyatakan oleh nas-nas itu sendiri, dikumpulkan mengikut lafaz riwayatnya.",
      "Berat di Mizan datang terutamanya daripada keikhlasan. Satu ungkapan ringan yang diucapkan kerana Allah boleh mengatasi segunung amalan yang menunjuk-nunjuk; satu amalan hebat yang dilakukan untuk dilihat orang boleh tiba dalam keadaan kosong. Gunakan kad-kad di bawah untuk mengamalkan apa yang dijadikan berat oleh Nabi ﷺ — kemudian bukalah dalil Al-Quran dan hadis untuk lafaz penuhnya.",
      "Akhlak yang baik dibincangkan dalam pelajarannya sendiri di jalan menuju Syurga; topik Mizan menerangkan tentang Mizan itu sendiri. Di sini tumpuannya ialah amalan dan zikir yang beratnya disebut secara jelas oleh Sunnah.",
    ],
    mizanDeeds: [
      {
        title: "Akhlak yang baik",
        summary: "Tiada yang lebih berat di Mizan orang beriman daripada akhlak yang baik.",
      },
      {
        title: "Dua kalimah yang ringan",
        summary: "Ringan di lidah, berat di Mizan, dikasihi oleh Yang Maha Pemurah.",
      },
      {
        title: "Alhamdulillah memenuhi Mizan",
        summary: "Segala puji bagi Allah — dan ia memenuhi Mizan.",
      },
      {
        title: "Kad Syahadah (Biṭāqah)",
        summary:
          "Sekeping kad kecil berisi tauhid yang ikhlas mengatasi sembilan puluh sembilan gulungan dosa — keikhlasan amat penting.",
      },
      {
        title: "Zikir yang terbaik",
        summary: "Zikir yang terbaik ialah La ilaha illallah.",
      },
      {
        title: "Empat kalimah yang paling dikasihi",
        summary:
          "Ucapan yang paling dikasihi Allah ialah empat kalimah — mulakan dengan yang mana anda suka.",
      },
      {
        title: "SubhanAllahi wa bihamdihi ×100",
        summary:
          "Diucapkan seratus kali sehari — dosa-dosa diampunkan walaupun sebanyak buih di lautan.",
      },
    ],
    misconceptions: [
      "Riwayat-riwayat ini tidak mewujudkan papan markah yang tetap bagi setiap amalan yang mungkin — soalan yang berbeza menerima jawapan 'terbaik' yang berbeza.",
      "Mengucapkan kalimah tanpa keikhlasan tidak menepati hadis Biṭāqah; beratnya terikat kepada tauhid yang sebenar.",
    ],
    actions: [
      "Ucapkan SubhanAllahi wa bihamdih dan SubhanAllahil-'Azim dengan kerap dan dengan kehadiran hati.",
      "Basahkan lidah dengan Alhamdulillah ketika senang dan susah.",
      "Perbaiki satu sifat akhlak minggu ini — ia antara amalan yang paling berat.",
      "Perbaharui Syahadah dengan ikhlas, bukan hanya dengan lidah.",
    ],
    appLinks: [
      { label: "Mizan (Neraca)" },
      { label: "Tasbih" },
      { label: "Zikir" },
      { label: "Akhlak yang baik" },
      { label: "Jalan zikir" },
    ],
  },
];

export const LAST_DAY_HADITH_MS: DeepPartial<LastDayHadithEntry>[] = [
  {
    context:
      "Mengingati mati secara kerap melembutkan hati, meleraikan dendam, dan membetulkan keutamaan tanpa menimbulkan rasa putus asa.",
  },
  {
    context:
      "Pengakhiran yang baik (husnul khatimah) diharapkan melalui iman yang ikhlas, taubat, dan bersangka baik kepada Allah.",
  },
  {
    context:
      "Barzakh merangkumi pahala atau azab di alam kubur, dengan hikmah Allah — kubur mencerminkan amalan seseorang sendiri.",
  },
  {
    context:
      "Soal jawab di alam kubur ditetapkan dalam riwayat-riwayat yang sahih; dalam riwayat ini kedua-dua malaikat itu dinamakan Munkar dan Nakir.",
  },
  {
    context: "Perkara yang terus memberi manfaat kepada si mati — ditetapkan dalam hadis sahih.",
  },
  {
    context:
      "Kerendahan diri pada Hari Perhimpunan; Allah memuliakan sesiapa yang Dia kehendaki, dengan cara yang Dia kehendaki.",
  },
  {
    context:
      "Keadaan di Mahsyar — beratnya berbeza-beza mengikut amalan dalam riwayat-riwayat yang sahih.",
  },
  {
    context: "Syafaat yang paling agung — asy-Syafa'ah al-'Uzma, yang khusus bagi Nabi ﷺ.",
  },
  {
    context:
      "Hisab yang mudah itu ialah rahmat — diperlihatkan amalan dan diampunkan, bukan disoal siasat satu demi satu.",
  },
  {
    context:
      "Hak-hak manusia (huquq al-'ibad) tidak terbatal begitu sahaja dengan ibadah; ia mesti diselesaikan, atau dibayar pada Hari itu.",
  },
  {
    context:
      "Para ulama berbeza pendapat sama ada bilangan itu harfiah atau menandakan limpahan rahmat Allah yang jauh lebih besar dan tidak terhitung.",
  },
  {
    context: "Telaga Haudh — rahmat bagi umat Nabi Muhammad ﷺ pada Hari kehausan.",
  },
  {
    context: "Kelajuan menyeberang mencerminkan iman dan amalan; rahmat Allah amat luas.",
  },
  {
    context:
      "Sepuluh tanda besar, daripada Huzaifah bin Usaid. Para ulama mengakui setiap tanda tetapi berbeza pendapat tentang susunan tepatnya.",
  },
  {
    context:
      "Turunnya Nabi Isa a.s. ialah perkara akidah Ahli Sunnah yang teguh; baginda memerintah dengan syariat Nabi Muhammad ﷺ.",
  },
  {
    context:
      "Satu tanda kecil yang terkenal — hilangnya amanah. Tumpukan kepada persediaan, bukan kepanikan.",
  },
  {
    context:
      "'Hilangnya ilmu' bermaksud hilangnya ulama yang benar dan amalan yang dihayati — bukan kekurangan maklumat.",
  },
  {
    context:
      "Bahasa Mizan bagi zikir — mudah di lidah, berat apabila ikhlas. Lihat juga pelajaran Berat di Mizan.",
  },
  {
    context:
      "Riwayat hasan yang menyebut akhlak yang baik sebagai yang paling berat di Mizan — digandingkan dengan pelajaran akhlak dalam panduan Syurga.",
  },
  {
    context:
      "Pujian kepada Allah digambarkan sebagai memenuhi Mizan — satu lagi amalan berbahasa Mizan yang sahih, bukan senarai kedudukan lengkap bagi semua amalan.",
  },
];

export const LAST_DAY_VERSES_MS: DeepPartial<LastDayVerseEntry>[] = [
  {
    context:
      "Kematian berlaku kepada semua dan kehidupan ini sementara; penyelesaian hisab yang sebenar dan muktamad hanya berlaku pada Hari Akhirat.",
    tafsirSummary:
      "Ayat ini mentakrifkan semula kejayaan: bukan harta atau kedudukan di sini, tetapi diselamatkan dari Neraka dan dimasukkan ke Syurga di sana.",
  },
  {
    context:
      "Keadilan yang sempurna dan menyeluruh — amalan yang paling kecil, baik atau buruk, dicatat dan dikembalikan kepada pelakunya.",
    tafsirSummary:
      "Tiada yang terlalu kecil untuk dikira. Ayat ini ialah peringatan sepanjang hayat agar tidak meremehkan dosa 'kecil' dan galakan sepanjang hayat ke arah amal kebaikan yang 'kecil'.",
  },
  {
    context: "Mizan (neraca) itu benar dan keadilannya mutlak.",
    tafsirSummary:
      "Tiada sesiapa pada Hari itu yang dikurangkan haknya walaupun seberat biji sawi; perhitungan Allah tiada cacat cela.",
  },
  {
    context: "Kesudahan yang muktamad bergantung pada berat amal soleh seseorang di atas Mizan.",
    tafsirSummary:
      "Berat datang daripada keikhlasan, bukan semata-mata banyaknya — zikir ringkas yang diucapkan dengan ikhlas boleh mengatasi segunung aktiviti yang menunjuk-nunjuk.",
  },
  {
    context:
      "Perintah yang jelas untuk berlumba ke arah kebaikan dan keampunan sebelum bertemu Allah.",
    tafsirSummary:
      "Syurga itu luas melampaui khayalan, dan jalan kepadanya ialah bersegera — bukan menangguhkan taubat dan amal kebaikan.",
  },
  {
    context:
      "Ganjaran Syurga yang paling agung bukanlah mana-mana taman atau sungai, tetapi melihat Wajah Allah.",
    tafsirSummary:
      "Ahli Sunnah menetapkan bahawa orang-orang beriman akan melihat Tuhan mereka di Akhirat, dengan cara yang layak dengan keagungan-Nya dan tanpa menyerupai makhluk — mahkota segala nikmat.",
  },
  {
    context: "Neraka ialah akibat yang benar dan adil — tempat yang nyata, bukan simbol.",
    tafsirSummary:
      "Amaran ini ialah rahmat yang bertujuan mengembalikan seseorang selagi masih ada masa; dalam Al-Quran ia sentiasa digandingkan dengan pintu taubat yang terbuka.",
  },
  {
    context: "Walau sebesar mana pun dosa, pintu taubat yang ikhlas kekal terbuka hingga kematian.",
    tafsirSummary:
      "Berputus asa daripada rahmat Allah itu sendiri datang daripada syaitan; orang beriman mengimbangi rasa takut akan Neraka dengan harapan yang tidak goyah terhadap keampunan Allah.",
  },
  {
    context: "Kebangkitan itu pasti, walaupun waktunya tersembunyi.",
    tafsirSummary:
      "Kepastian tentang Kiamat, berserta ketidakpastian tentang waktunya, itulah yang menambat tanggungjawab moral pada masa kini.",
  },
  {
    context: "Syafaat itu benar tetapi tidak pernah terlepas daripada izin Allah.",
    tafsirSummary:
      'Syarat tunggal ini — "melainkan dengan izinNya" — itulah yang memisahkan syafaat yang benar daripada segala penyelewengannya, dan melarang menyeru orang yang telah mati dalam kehidupan ini.',
  },
  {
    context:
      "Penghibur bagi orang yang dizalimi — keadilan yang seolah-olah tertangguh bukan bermakna ia tiada.",
    tafsirSummary:
      "Tiada kezaliman yang dilupakan oleh Allah; si zalim hanya diberi tangguh sehingga suatu Hari yang tiada apa pun akan terlepas pandang.",
  },
  {
    context:
      "Melalui Sirat adalah untuk semua; sampai dengan selamat dikurniakan dengan rahmat Allah dan takwa.",
    tafsirSummary:
      "Semua orang sampai ke penyeberangan itu; bezanya ialah siapa yang diselamatkan dan siapa yang jatuh — ditentukan oleh iman dan amalan yang dihantar terlebih dahulu.",
  },
  {
    context:
      "Waktu sebenarnya hanya diketahui oleh Allah — persediaan itu penting, ramalan itu sia-sia.",
    tafsirSummary:
      "Nabi ﷺ sendiri pun tidak diberitahu tarikhnya; setiap dakwaan manusia tentang suatu tahun atau kiraan detik bercanggah dengan ayat ini.",
  },
  {
    context:
      "Cara seseorang menerima kitabnya — dengan tangan kanan atau kiri — itu sendiri ialah keputusan yang pertama.",
    tafsirSummary:
      "Kegembiraan orang yang berjaya ialah kegembiraan keyakinan yang dibalas: mereka hidup dengan menjangkakan hisab, lalu ia tiba sebagai kelegaan, bukan kejutan.",
  },
];

export const LAST_DAY_TIMELINE_MS: DeepPartial<LastDayTimelineEvent>[] = [
  {
    title: "Kehidupan di dunia",
    body: "Tempoh singkat yang ditetapkan untuk beriman, beribadah dan bersedia. Dunia ini bukan tempat tinggal yang terakhir — ia ialah ladang amalan.",
  },
  {
    title: "Kematian",
    body: "Setiap jiwa akan merasai mati. Orang beriman menghadapinya dengan harapan kepada rahmat Allah; kelalaian menjadikannya mengejut dan pahit.",
  },
  {
    title: "Kubur",
    body: "Selepas dikebumikan, roh memasuki barzakh. Kubur ialah peringkat pertama Akhirat bagi setiap orang.",
  },
  {
    title: "Barzakh",
    body: "Kehidupan antara kematian dan kebangkitan — soal jawab, nikmat atau azab menurut riwayat-riwayat yang sahih.",
  },
  {
    title: "Tanda-tanda kecil",
    body: "Perubahan sosial dan moral secara beransur-ansur yang digambarkan oleh Nabi ﷺ. Ramai ulama menyatakan beberapa daripadanya telah muncul; waktu tepatnya hanya milik Allah.",
  },
  {
    title: "Tanda-tanda besar",
    body: "Peristiwa-peristiwa dahsyat berhampiran pengakhiran — termasuk al-Mahdi, Dajjal, dan kembalinya Nabi Isa a.s. dalam hadis sahih. Butiran susunannya berbeza dalam kalangan ulama.",
  },
  {
    title: "Sangkakala",
    body: "Israfil akan meniup sangkakala. Makhluk mati pada tiupan pertama dan dibangkitkan pada tiupan kedua.",
  },
  {
    title: "Kebangkitan",
    body: "Jasad dikembalikan daripada debu; seluruh makhluk berdiri di hadapan Allah.",
  },
  {
    title: "Perhimpunan (Mahsyar)",
    body: "Semua manusia dihimpunkan tanpa alas kaki, tanpa pakaian dan tidak berkhatan — sebagaimana yang Allah kehendaki — menunggu pengadilan.",
  },
  {
    title: "Kitab Catatan Amalan",
    body: "Kitab diberikan di tangan kanan, tangan kiri, atau dari belakang badan. Tiada yang tertinggal daripada apa yang telah dicatat.",
  },
  {
    title: "Mizan (Neraca)",
    body: "Amalan ditimbang dengan keadilan yang sempurna. Neraca yang berat membawa kegembiraan; neraca yang ringan membawa kerugian.",
  },
  {
    title: "Hisab (Pertanggungjawaban)",
    body: "Hisab yang mudah bagi sebahagian; soal siasat yang terperinci bagi yang lain. Hak-hak yang terhutang kepada manusia tidak diabaikan.",
  },
  {
    title: "Syafaat",
    body: "Hanya dengan izin Allah — syafaat yang paling agung milik Nabi Muhammad ﷺ.",
  },
  {
    title: "Telaga (Haudh)",
    body: "Sebuah telaga yang luas tempat umat Nabi ﷺ minum pada Hari Kiamat.",
  },
  {
    title: "Titian (Sirat)",
    body: "Setiap orang menyeberangi Neraka — kelajuannya berbeza menurut iman dan amalan dalam riwayat-riwayat yang sahih.",
  },
  {
    title: "Syurga atau Neraka",
    body: "Tempat tinggal yang kekal — Syurga dengan rahmat Allah dan amal soleh; Neraka Jahanam sebagai amaran yang benar dan akibat yang adil.",
  },
  {
    title: "Kekekalan",
    body: "Tiada lagi kematian selepas Akhirat. Ahli Syurga kekal selama-lamanya dalam nikmat; ahli Neraka kekal sebagaimana yang Allah kehendaki.",
  },
];

export const LAST_DAY_QUIZ_MS: DeepPartial<LastDayQuizQuestion>[] = [
  {
    prompt: "Beriman kepada Hari Akhirat ialah salah satu daripada:",
    options: [
      "Lima rukun Islam",
      "Enam rukun iman (Iman)",
      "Tujuh lapis langit",
      "Sepuluh sahabat",
    ],
    explanation:
      "Iman merangkumi kepercayaan kepada Allah, para malaikat, kitab-kitab, para rasul, Hari Akhirat, dan qada dan qadar.",
  },
  {
    prompt: "Barzakh paling tepat digambarkan sebagai:",
    options: [
      "Titian di atas Neraka",
      "Kehidupan antara kematian dan kebangkitan",
      "Neraca amalan",
      "Tiupan sangkakala",
    ],
    explanation: "Barzakh ialah tempoh selepas kematian hingga Hari Kebangkitan.",
  },
  {
    prompt: "Betul atau salah: Para ulama sepakat tentang susunan tepat semua tanda besar Kiamat.",
    options: ["Betul", "Salah"],
    explanation:
      "Tanda-tanda besar diakui dalam hadis sahih, tetapi para ulama berbeza pendapat tentang sebahagian butiran susunannya. Waktu Kiamat hanya diketahui oleh Allah.",
  },
  {
    prompt: "Mizan (neraca) pada Hari Akhirat merujuk kepada:",
    options: [
      "Menimbang jasad fizikal",
      "Menimbang amalan dengan keadilan yang sempurna",
      "Mengukur masa di alam kubur",
      "Membilang para malaikat",
    ],
    explanation: "Mizan menimbang amalan — keikhlasan dan amal soleh memberatkan neraca.",
  },
  {
    prompt: "Syafaat pada Hari Akhirat:",
    options: [
      "Berlaku tanpa izin Allah",
      "Hanya dengan izin Allah",
      "Menggantikan keperluan kepada iman",
      "Dinafikan dalam Al-Quran",
    ],
    explanation: "Al-Quran 2:255 dan 20:109 menetapkan syafaat hanya dengan izin Allah.",
  },
  {
    prompt: "Yang manakah datang dahulu dalam perjalanan Akhirat?",
    options: ["Kebangkitan", "Kematian", "Perhimpunan", "Sangkakala"],
    explanation:
      "Kematian mendahului barzakh, kemudian — selepas tanda-tanda dan sangkakala — kebangkitan dan perhimpunan.",
  },
  {
    prompt: "Satu tabiat manakah yang akan anda kukuhkan minggu ini untuk bersedia bertemu Allah?",
    explanation:
      "Persediaan itu praktikal: solat, Al-Quran, taubat, sedekah, akhlak yang baik, dan menunaikan hak-hak orang lain.",
  },
  {
    prompt: "Betul atau salah: Menurut Al-Quran 19:71, setiap orang akan melalui Sirat.",
    options: ["Betul", "Salah"],
    explanation:
      "Ayat itu menyatakan semua akan melaluinya; Allah menyelamatkan orang-orang yang bertakwa. Para ulama membincangkan butiran tentang siapa yang jatuh.",
  },
  {
    prompt:
      "Kalimah manakah yang digambarkan oleh Nabi ﷺ sebagai ringan di lidah dan berat di Mizan?",
    options: [
      "Hanya solat lima waktu",
      "SubhanAllahi wa bihamdih dan SubhanAllahil-'Azim",
      "Sebarang ucapan panjang dalam bahasa Arab",
      "Diam semata-mata",
    ],
    explanation:
      "Sahih al-Bukhari 6406: dua kalimah yang ringan di lidah, berat di Mizan, dan dikasihi oleh Yang Maha Pemurah.",
  },
];

export const LAST_DAY_REFERENCES_MS: DeepPartial<LastDayReferenceEntry>[] = [
  {
    title: "Al-Quran",
    note: "Sumber utama tentang kebangkitan, pertanggungjawaban, Syurga, Neraka dan keadilan Ilahi. Ayat-ayat dalam modul ini dirujuk mengikut surah dan ayat.",
  },
  {
    title: "Sahih al-Bukhari & Sahih Muslim",
    note: "Himpunan hadis muktabar tentang kematian, kubur, tanda-tanda, hisab, syafaat, Haudh dan Sirat.",
  },
  {
    title: "Sunan at-Tirmizi & Sunan Abi Daud",
    note: "Riwayat-riwayat sahih tambahan tentang kubur dan tanda-tanda kecil — gred dinyatakan apabila berkaitan.",
  },
  {
    title: "Ibnu Kathir — Tafsir",
    note: "Huraian klasik tentang ayat-ayat Al-Quran mengenai Akhirat. Digunakan untuk ringkasan tafsir yang ringkas, bukan sebagai dalil yang berdiri sendiri.",
  },
  {
    title: "Al-'Aqidah at-Tahawiyyah",
    note: "Akidah asas Ahli Sunnah yang menetapkan kebangkitan, Mizan, Sirat, Syurga dan Neraka.",
  },
  {
    title: "Perbezaan pendapat ulama",
    note: "Apabila para ulama berbeza pendapat — contohnya susunan tanda-tanda besar, butiran Haudh, golongan yang masuk tanpa hisab — modul ini mencatat perbezaan itu tanpa mendakwa satu pandangan sebagai satu-satunya pendapat yang sah.",
  },
  {
    title: "Wahyu berbanding tafsiran",
    note: "Ayat Al-Quran yang jelas serta hadis mutawatir atau sahih dibezakan daripada pendapat tafsiran (ijtihad) dan riwayat-riwayat yang lebih lemah.",
  },
];
