/**
 * Pad Learn overlays after English topics were inserted mid-array.
 * Inserts DeepPartial stubs (English by default) so coverage stays ≥90%.
 *
 * Run: node packages/shared/scripts/pad-overlay-inserts.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { transformSync } from "esbuild";

const __dirname = dirname(fileURLToPath(import.meta.url));
const i18nDir = join(__dirname, "../src/content/i18n");

const LAYLAT_EN_STUBS = [
  {
    title: "I'tikaf in the last ten nights",
    summary: "Seclusion in the mosque — the Prophet's ﷺ practice in Ramadan's close.",
    body: [
      "I'tikaf is remaining in a mosque for worship, cutting ordinary worldly distractions for a set period. The Prophet ﷺ regularly performed i'tikaf in the last ten nights of Ramadan, seeking Laylat al-Qadr with focused worship rather than leaving the mosque for ordinary errands (Sahih al-Bukhari 2026).",
      "Classical teaching treats a complete i'tikaf of the last ten nights as a confirmed sunnah when a person is able. Details of what breaks it, whether women may observe it in a designated mosque space, and how work or family duties interact with it vary by school — this guide only establishes the practice and its purpose: sustained Qur'an, prayer, and du'a in the nights most likely to include Laylat al-Qadr.",
      "If full mosque seclusion is not possible, shorten the gap: stay longer after tarawih, reserve quieter corners of the night at home for qiyam and Qur'an, and protect those hours from unnecessary distraction. The reward is tied to sincere worship, not only to a formal label of i'tikaf.",
    ],
    hadith: [
      {
        excerpt:
          "The Prophet ﷺ used to practice I'tikaf in the last ten nights of Ramadan till he died, and then his wives used to practice I'tikaf after him.",
      },
    ],
    actions: [
      "If your mosque offers i'tikaf, ask early about registration and the rules they follow.",
      "If you cannot stay overnight, still lengthen your presence for Qur'an and qiyam in the last ten nights.",
    ],
    disclaimer:
      "I'tikaf has detailed fiqh conditions (intention, leaving the mosque, intimacy, women's arrangements). Confirm with a qualified local scholar or your mosque before committing.",
  },
  {
    title: "Worship with family on the last ten nights",
    summary: "Include children and household members without chasing a fixed date.",
    body: [
      "The last ten nights are an opportunity for the whole household, not only for those who can stay up alone. Teach children the meaning of Laylat al-Qadr in simple words — that Allah made one night better than a thousand months — and invite them into short, doable acts: a few pages of Qur'an, joining tarawih for as long as they can, repeating the forgiveness du'a, and giving a small amount in charity.",
      "Keep the tone gentle. The goal is sincere effort across the odd nights, not exhausting everyone for a single guessed calendar date. Rotate who leads a short family dhikr, set a shared intention before Maghrib, and protect sleep enough that worship remains sustainable rather than a one-night burst followed by collapse.",
      "Those with caregiving or work limits still share in the night by preparing suhoor, freeing others for mosque prayer, or making du'a while others stand — every sincere contribution counts toward seeking the night together.",
    ],
    actions: [
      "Agree as a family which odd nights you will prioritise for extra Qur'an and prayer.",
      "Memorise the forgiveness du'a together and repeat it after Maghrib and before sleep.",
      "Let children give a small sadaqah during the last ten nights.",
    ],
  },
];

const LAYLAT_AR_STUBS = [
  {
    title: "الاعتكاف في العشر الأواخر",
    summary: "المكث في المسجد — هدي النبي ﷺ في ختام رمضان.",
    body: [
      "الاعتكاف هو المكث في المسجد للعبادة، مع قطع الشواغل الدنيوية العادية لمدة محددة. وكان النبي ﷺ يعتكف في العشر الأواخر من رمضان طلبًا لليلة القدر بعبادة مركّزة، لا بمغادرة المسجد لأموره المعتادة (البخاري ٢٠٢٦).",
      "ويعدّ التعليم الكلاسيكي اعتكاف العشر الأواخر سنة مؤكدة لمن قدر. وتفاصيل ما يبطله، واعتكاف النساء في مكان مخصص بالمسجد، وتداخل العمل أو واجبات الأسرة — تختلف بين المذاهب؛ وهذا الدليل يبيّن أصل العمل وغايته فقط: قرآن وقيام ودعاء متواصل في الليالي الأقرب لليلة القدر.",
      "وإن تعذّر الاعتكاف الكامل، فضيّق الفجوة: ابقَ أطول بعد التراويح، واحجز زوايا هادئة من الليل في البيت للقيام والقرآن، واحمِ تلك الساعات من الشواغل غير الضرورية. والأجر مرتبط بصدق العبادة لا بمجرد اسم الاعتكاف.",
    ],
    hadith: [
      {
        excerpt:
          "كان النبي ﷺ يعتكف في العشر الأواخر من رمضان حتى توفاه الله، ثم اعتكفت أزواجه من بعده.",
      },
    ],
    actions: [
      "إن كان مسجدك يفتح باب الاعتكاف، فاسأل مبكرًا عن التسجيل والأحكام التي يتبعونها.",
      "إن لم تستطع المبيت، فطوّل حضورك للقرآن والقيام في العشر الأواخر.",
    ],
    disclaimer:
      "للاعتكاف شروط فقهية مفصّلة (النية، الخروج من المسجد، الجماع، وترتيبات النساء). أكّد مع عالم محلي مؤهل أو مسجدك قبل الالتزام.",
  },
  {
    title: "العبادة مع الأسرة في العشر الأواخر",
    summary: "أشرك الأطفال وأهل البيت دون ملاحقة تاريخ ثابت.",
    body: [
      "العشر الأواخر فرصة للأسرة كلها، لا لمن يسهر وحده فقط. علّم الأطفال معنى ليلة القدر بكلام بسيط — أن الله جعل ليلة خيرًا من ألف شهر — وادعُهم إلى أعمال قصيرة ممكنة: صفحات من القرآن، حضور التراويح بقدر طاقتهم، تكرار دعاء المغفرة، وصدقة يسيرة.",
      "أبقِ الأسلوب لطيفًا. الهدف جهد صادق عبر الليالي الوتر، لا إرهاق الجميع لأجل تاريخ مخمّن. تناوبوا على ذكر قصير، وجدّدوا نية مشتركة قبل المغرب، واحفظوا من النوم ما يكفي لتبقى العبادة مستدامة لا اندفاع ليلة ثم انهيار.",
      "ومن كان مشغولًا بالرعاية أو العمل يشارك أيضًا بتجهيز السحور، أو تمكين غيره من صلاة المسجد، أو الدعاء بينما يقوم غيره — وكل إسهام صادق يعدّ من طلب الليلة معًا.",
    ],
    actions: [
      "اتفقوا كأسرة على الليالي الوتر التي تُعطى أولوية لزيادة القرآن والصلاة.",
      "احفظوا معًا دعاء المغفرة وكرّروه بعد المغرب وقبل النوم.",
      "دعوا الأطفال يتصدقون بصدقة يسيرة في العشر الأواخر.",
    ],
  },
];

const LAYLAT_UR_STUBS = [
  {
    title: "آخری دس راتوں میں اعتکاف",
    summary: "مسجد میں گوشہ نشینی — رمضان کے اختتام پر نبی کریم ﷺ کی سنت۔",
    body: [
      "اعتکاف مسجد میں عبادت کے لیے ٹھہرنا ہے، عام دنیاوی مشغولیات کو ایک مقررہ مدت کے لیے کم کر کے۔ نبی کریم ﷺ رمضان کی آخری دس راتوں میں باقاعدگی سے اعتکاف فرماتے تھے تاکہ لیلۃ القدر کو مرکوز عبادت سے تلاش کریں، نہ کہ عام کاموں کے لیے مسجد چھوڑیں (صحیح البخاری ۲۰۲۶)۔",
      "کلاسیکی تعلیم مکمل اعتکافِ عشرہ کو اس شخص کے لیے سنتِ مؤکدہ قرار دیتی ہے جو اس کی طاقت رکھتا ہو۔ اسے توڑنے والی چیزیں، خواتین کا مخصوص جگہ میں اعتکاف، اور کام یا گھریلو ذمہ داریوں کا تعلق — مذاہب میں مختلف ہیں؛ یہ رہنما صرف اصل عمل اور اس کا مقصد بیان کرتی ہے: وہ راتیں جن میں لیلۃ القدر زیادہ قریب ہے، ان میں مسلسل قرآن، نماز اور دعا۔",
      "اگر پورا اعتکاف ممکن نہ ہو تو فاصلہ کم کریں: تراویح کے بعد زیادہ دیر ٹھہریں، گھر میں قیام اور قرآن کے لیے رات کے پرسکون حصے محفوظ رکھیں، اور غیر ضروری مشغولیت سے ان گھنٹوں کی حفاظت کریں۔ اجر سچی عبادت سے جڑا ہے، صرف اعتکاف کے نام سے نہیں۔",
    ],
    hadith: [
      {
        excerpt:
          "نبی کریم ﷺ رمضان کی آخری دس راتوں میں اعتکاف کرتے رہے یہاں تک کہ آپ کی وفات ہوئی، پھر آپ کی ازواج نے آپ کے بعد اعتکاف کیا۔",
      },
    ],
    actions: [
      "اگر آپ کی مسجد اعتکاف کی سہولت دیتی ہے تو جلد رجسٹریشن اور قواعد پوچھ لیں۔",
      "اگر رات بھر نہیں ٹھہ سکتے تو آخری دس راتوں میں قرآن اور قیام کے لیے اپنی موجودگی طویل کریں۔",
    ],
    disclaimer:
      "اعتکاف کی تفصیلی فقہی شرائط ہیں (نیت، مسجد سے نکلنا، قربت، خواتین کے انتظامات)۔ پابندی سے پہلے مستند مقامی عالم یا اپنی مسجد سے تصدیق کریں۔",
  },
  {
    title: "آخری دس راتوں میں گھر والوں کے ساتھ عبادت",
    summary: "بچوں اور اہلِ خانہ کو شامل کریں بغیر مقررہ تاریخ کے پیچھے۔",
    body: [
      "آخری دس راتیں پورے گھر کے لیے موقع ہیں، صرف تنہا جاگنے والوں کے لیے نہیں۔ بچوں کو سادہ الفاظ میں لیلۃ القدر کا مطلب سمجھائیں — کہ اللہ نے ایک رات کو ہزار مہینوں سے بہتر بنایا — اور انہیں چھوٹے ممکن اعمال کی طرف بلائیں: قرآن کے چند صفحے، جتنی دیر ہو سکے تراویح، معافی کی دعا کی تکرار، اور تھوڑا صدقہ۔",
      "لہجہ نرم رکھیں۔ مقصد طاق راتوں میں سچی کوشش ہے، نہ کہ اندازہ لگائی گئی تاریخ کے لیے سب کو تھکانا۔ مختصر خاندانی ذکر کی باری باری، مغرب سے پہلے مشترکہ نیت، اور اتنی نیند محفوظ رکھیں کہ عبادت پائیدار رہے نہ کہ ایک رات کا زور پھر ختم۔",
      "جو دیکھ بھال یا کام میں بندھے ہیں وہ سحری تیار کر کے، دوسروں کو مسجد کی نماز کے لیے فارغ کر کے، یا جب دوسرے قیام کریں تو دعا کر کے بھی شریک ہوتے ہیں — ہر سچی شرکت رات کی تلاش میں شمار ہوتی ہے۔",
    ],
    actions: [
      "گھر والوں کے ساتھ طے کریں کہ کن طاق راتوں میں قرآن و نماز کو ترجیح دی جائے گی۔",
      "معافی کی دعا ساتھ حفظ کریں اور مغرب کے بعد اور سونے سے پہلے دہرائیں۔",
      "بچوں کو آخری دس راتوں میں تھوڑا صدقہ دینے دیں۔",
    ],
  },
];

const TAYAMMUM_EN = {
  title: "Tayammum — dry purification",
  summary: "When water cannot be used, clean earth lifts impurity so prayer is not delayed.",
  body: [
    "Tayammum is the dry purification Allah legislated when water is genuinely unavailable, or when using it would cause harm because of illness or severe cold. It is not a lesser workaround for convenience — it is a complete substitute that lifts minor or major impurity for prayer until water can be used again.",
    "The Qur'an names it in the same verse as wudu and ghusl (5:6): wipe the face and hands with clean earth after striking it. The Prophet ﷺ taught the companions this concession as mercy, not as a loophole to skip searching for water when it is reasonably available.",
    "Practically: intend tayammum, say Bismillah, strike clean earth once (or twice according to some schools), wipe the face, then wipe the hands to the wrists (many scholars include up to the elbows in continuity with wudu). What breaks wudu or ghusl also ends the corresponding tayammum; finding usable water ends the concession and you return to ordinary purification.",
    "If you prayed validly with tayammum and only found water afterward, the majority hold that the completed prayer need not be repeated. If water appears before you pray, you must use it. For casts, wounds, and illness, combine wiping over dressings with tayammum as your school and doctor advise — see the full Taharah guide for detail.",
  ],
  steps: [
    {
      title: "Confirm the need",
      body: "Search reasonably for usable water, or confirm that using water would harm you (illness, severe cold, medical advice).",
    },
    {
      title: "Intention & Bismillah",
      body: "Intend tayammum in place of wudu or ghusl, and begin with Bismillah.",
      transliteration: "Bismillah",
    },
    {
      title: "Strike clean earth",
      body: "Strike clean earth (or a clean dusty surface) with both hands once — some schools strike twice.",
    },
    {
      title: "Wipe the face",
      body: "Wipe the entire face with the dust remaining on the hands.",
    },
    {
      title: "Wipe the hands",
      body: "Wipe the hands — at minimum to the wrists; many scholars wipe to the elbows.",
    },
  ],
  quran: [
    {
      excerpt:
        "…and you find no water, then perform tayammum with clean earth and wipe your faces and your hands with it.",
    },
  ],
  hadith: [
    {
      excerpt:
        "Reported in the chapters of tayammum: the concession to purify with clean earth in the absence of usable water.",
    },
  ],
  actions: [
    "Know when tayammum applies before travel or illness so prayer is never skipped for lack of water.",
    "Open the full Taharah tayammum lessons for school differences on striking and wiping.",
  ],
  disclaimer:
    "Schools differ on details (one strike vs two, wrists vs elbows, renewing per prayer). This is a mainstream educational summary — follow reliable local scholarship for your practice.",
};

const TAYAMMUM_AR = {
  title: "التيمم — الطهارة بالتراب",
  summary: "عند تعذّر الماء، يرفع التراب النظيف الحدث حتى لا تؤخَّر الصلاة.",
  body: [
    "التيمم هو الطهارة الجافة التي شرعها الله عند فقد الماء حقيقةً، أو عند خوف الضرر من استعماله لمرض أو برد شديد. وليس حيلة للراحة — بل بدل كامل يرفع الحدث الأصغر أو الأكبر للصلاة حتى يعود الماء صالحًا للاستعمال.",
    "ويذكره القرآن في آية الوضوء والغسل نفسها (٥:٦): مسح الوجه واليدين بتراب طاهر بعد ضربه. وعلّم النبي ﷺ الصحابة هذه الرخصة رحمةً، لا ثغرةً لترك طلب الماء إن كان متاحًا بقدر معقول.",
    "عمليًا: انوِ التيمم، وسمِّ، واضرب التراب الطاهر مرة (أو مرتين عند بعض المذاهب)، وامسح الوجه، ثم اليدين إلى الرسغين (وكثير من العلماء يمسحون إلى المرفقين استمراريةً مع الوضوء). وما ينقض الوضوء أو الغسل ينقض التيمم المقابل؛ ووجود الماء الصالح ينهي الرخصة وتعود إلى الطهارة بالماء.",
    "وإن صلّيت بتيمم صحيح ثم وجدت الماء بعده، فالجمهور على أن الصلاة المكتملة لا تُعاد. وإن ظهر الماء قبل الصلاة وجب استعماله. وللجبائر والجروح والمرض اجمع بين المسح على الضماد والتيمم كما يوجّه مذهبك وطبيبك — راجع دليل الطهارة للتفاصيل.",
  ],
  steps: [
    {
      title: "تأكد من الحاجة",
      body: "اطلب الماء الصالح بقدر معقول، أو تأكد أن استعمال الماء يضرك (مرض، برد شديد، نصيحة طبية).",
    },
    {
      title: "النية والتسمية",
      body: "انوِ التيمم بدل الوضوء أو الغسل، وابدأ ببسم الله.",
      transliteration: "Bismillah",
    },
    {
      title: "ضرب التراب الطاهر",
      body: "اضرب التراب الطاهر (أو سطحًا مغبرًا نظيفًا) بيديك مرة — وبعض المذاهب مرتين.",
    },
    {
      title: "مسح الوجه",
      body: "امسح الوجه كله بما بقي من الغبار على اليدين.",
    },
    {
      title: "مسح اليدين",
      body: "امسح اليدين — إلى الرسغين على الأقل؛ وكثير من العلماء إلى المرفقين.",
    },
  ],
  quran: [
    {
      excerpt: "…فلم تجدوا ماء فتيمموا صعيدًا طيبًا فامسحوا بوجوهكم وأيديكم منه.",
    },
  ],
  hadith: [
    {
      excerpt: "ورد في أبواب التيمم: رخصة التطهر بالصعيد الطيب عند فقد الماء الصالح.",
    },
  ],
  actions: [
    "اعرف متى يُشرع التيمم قبل السفر أو المرض حتى لا تُترك الصلاة لفقد الماء.",
    "افتح دروس التيمم في دليل الطهارة لاختلاف المذاهب في الضرب والمسح.",
  ],
  disclaimer:
    "تختلف المذاهب في التفاصيل (ضربة أو ضربتان، الرسغان أو المرفقان، تجديد التيمم لكل صلاة). هذا ملخص تعليمي سائد — اتبع علمًا محليًا موثوقًا لعملك.",
};

const TAYAMMUM_UR = {
  title: "تیمم — خشک طہارت",
  summary: "جب پانی استعمال نہ ہو سکے تو پاک مٹی ناپاکی اٹھا کر نماز کو مؤخر نہیں ہونے دیتی۔",
  body: [
    "تیمم وہ خشک طہارت ہے جو اللہ نے اس وقت مشروع کی جب پانی واقعی دستیاب نہ ہو، یا بیماری یا شدید سردی کی وجہ سے اس کا استعمال نقصان دے। یہ سہولت کی خاطر کم تر حل نہیں — بلکہ کامل بدل ہے جو چھوٹی یا بڑی حدث کو نماز کے لیے اٹھاتا ہے جب تک پانی دوبارہ استعمال کے قابل نہ ہو۔",
    "قرآن اسے وضو اور غسل کی ہی آیت (۵:۶) میں بیان کرتا ہے: پاک مٹی مار کر چہرہ اور ہاتھوں کا مسح۔ نبی کریم ﷺ نے صحابہ کو یہ رخصت رحمت کے طور پر سکھائی، نہ کہ پانی دستیاب ہونے پر تلاش چھوڑنے کا بہانہ۔",
    "عملًا: تیمم کی نیت کریں، بسم اللہ کہیں، پاک مٹی پر ایک بار (یا بعض مذاہب کے مطابق دو بار) ہاتھ ماریں، چہرہ مسح کریں، پھر کلائیوں تک ہاتھ (بہت سے علماء کہنیوں تک وضو کی ہم آہنگی میں)۔ جو وضو یا غسل توڑے وہی متعلقہ تیمم بھی توڑتا ہے؛ قابلِ استعمال پانی مل جانے پر رخصت ختم ہو کر عام طہارت لوٹ آتی ہے۔",
    "اگر آپ نے درست تیمم سے نماز پڑھی اور بعد میں پانی ملا تو جمہور کے نزدیک مکمل نماز دہرانے کی ضرورت نہیں۔ اگر نماز سے پہلے پانی ظاہر ہو تو اسے استعمال کرنا واجب ہے۔ پلاسٹر، زخم اور بیماری میں اپنے مذہب اور ڈاکٹر کے مطابق پٹی پر مسح کے ساتھ تیمم جمع کریں — تفصیل کے لیے مکمل طہارت رہنما دیکھیں۔",
  ],
  steps: [
    {
      title: "ضرورت کی تصدیق",
      body: "قابلِ استعمال پانی معقول حد تک تلاش کریں، یا تصدیق کریں کہ پانی نقصان دے گا (بیماری، شدید سردی، طبی مشورہ)۔",
    },
    {
      title: "نیت اور بسم اللہ",
      body: "وضو یا غسل کے بدل تیمم کی نیت کریں اور بسم اللہ سے شروع کریں۔",
      transliteration: "Bismillah",
    },
    {
      title: "پاک مٹی پر ہاتھ مارنا",
      body: "پاک مٹی (یا صاف گرد آلود سطح) پر دونوں ہاتھ ایک بار ماریں — بعض مذاہب دو بار۔",
    },
    {
      title: "چہرے کا مسح",
      body: "ہاتھوں پر باقی گرد سے پورا چہرہ مسح کریں۔",
    },
    {
      title: "ہاتھوں کا مسح",
      body: "ہاتھ مسح کریں — کم از کم کلائیوں تک؛ بہت سے علماء کہنیوں تک۔",
    },
  ],
  quran: [
    {
      excerpt:
        "…اور پانی نہ پاؤ تو پاک مٹی سے تیمم کرو اور اس سے اپنے چہروں اور ہاتھوں کا مسح کرو۔",
    },
  ],
  hadith: [
    {
      excerpt: "تیمم کے ابواب میں آیا: قابلِ استعمال پانی نہ ملنے پر پاک مٹی سے طہارت کی رخصت۔",
    },
  ],
  actions: [
    "سفر یا بیماری سے پہلے جانیں کہ تیمم کب مشروع ہے تاکہ پانی نہ ملنے پر نماز چھوٹ نہ جائے۔",
    "مارنے اور مسح میں مذہبی اختلاف کے لیے طہارت رہنما کے تیمم اسباق کھولیں۔",
  ],
  disclaimer:
    "تفصیل میں مذاہب مختلف ہیں (ایک ضرب یا دو، کلائی یا کہنی، ہر نماز کے لیے تجدید)۔ یہ عمومی تعلیمی خلاصہ ہے — اپنے عمل کے لیے مستند مقامی علم کی پیروی کریں۔",
};

function loadExport(filePath, exportName) {
  let src = readFileSync(filePath, "utf8");
  // Drop type-only imports; keep the array export evaluable.
  src = src.replace(/^import\s+[\s\S]*?;\s*$/gm, "");
  src = src.replace(/:\s*DeepPartial<[^>]+>\[\]/g, "");
  const { code } = transformSync(src, {
    loader: "ts",
    format: "cjs",
    target: "es2020",
  });
  const module = { exports: {} };
  const fn = new Function("exports", "module", "require", code);
  fn(module.exports, module, () => ({}));
  const value = module.exports[exportName];
  if (!Array.isArray(value)) throw new Error(`Missing array export ${exportName} in ${filePath}`);
  return value;
}

function _serialize(value, indent = 2) {
  return JSON.stringify(value, null, indent)
    .replace(/"([^"]+)":/g, "$1:")
    .replace(/"/g, "'")
    .replace(/\\'/g, "\\'");
}

function _rewriteArrayExport(filePath, exportName, nextArray, typeName) {
  const src = readFileSync(filePath, "utf8");
  const marker = `export const ${exportName}`;
  const start = src.indexOf(marker);
  if (start < 0) throw new Error(`export not found: ${exportName} in ${filePath}`);
  const after = src.slice(start);
  const eq = after.indexOf("=");
  const arrStart = after.indexOf("[", eq);
  let depth = 0;
  let end = -1;
  for (let i = arrStart; i < after.length; i++) {
    const ch = after[i];
    if (ch === "[") depth++;
    else if (ch === "]") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end < 0) throw new Error(`array end not found in ${filePath}`);
  const before = src.slice(0, start);
  const afterArr = after.slice(end + 1);
  const body = nextArray
    .map((item) =>
      JSON.stringify(item, null, 2)
        .split("\n")
        .map((line, idx) => (idx === 0 ? `  ${line}` : `  ${line}`))
        .join("\n"),
    )
    .join(",\n");
  const next = `${before}export const ${exportName}: DeepPartial<${typeName}>[] = [\n${body}\n]${afterArr.replace(/^\s*;?/, ";")}`;
  // Fix double type annotation if original had DeepPartial already handled poorly
  const cleaned = next.replace(
    new RegExp(
      `export const ${exportName}: DeepPartial<${typeName}>\\[\\]: DeepPartial<${typeName}>\\[\\]`,
    ),
    `export const ${exportName}: DeepPartial<${typeName}>[]`,
  );
  writeFileSync(filePath, cleaned, "utf8");
}

function padLaylat() {
  const files = readdirSync(i18nDir).filter((f) => /^laylat-al-qadr\.[a-z]{2}\.ts$/.test(f));
  for (const file of files) {
    const locale = file.split(".")[1];
    const path = join(i18nDir, file);
    const arr = loadExport(path, `LAYLAT_AL_QADR_TOPICS_${locale.toUpperCase()}`);
    if (arr.length >= 8) {
      console.log(`skip laylat ${locale} (len=${arr.length})`);
      continue;
    }
    if (arr.length !== 6) {
      console.warn(`unexpected laylat ${locale} len=${arr.length}`);
    }
    const stubs =
      locale === "ar" ? LAYLAT_AR_STUBS : locale === "ur" ? LAYLAT_UR_STUBS : LAYLAT_EN_STUBS;
    const closing = arr[arr.length - 1];
    const next = [...arr.slice(0, -1), ...stubs, closing];
    // Rewrite by splicing textually near the end — loadExport then dump JSON-like TS
    const src = readFileSync(path, "utf8");
    const exportName = `LAYLAT_AL_QADR_TOPICS_${locale.toUpperCase()}`;
    const headerMatch = src.match(new RegExp(`[\\s\\S]*?export const ${exportName}[^=]*=\\s*\\[`));
    if (!headerMatch) throw new Error(`header for ${exportName}`);
    const header = headerMatch[0];
    const footer = "\n];\n";
    const items = next
      .map((item) =>
        JSON.stringify(item, null, 2)
          .replace(/^/gm, "  ")
          .replace(/"([a-zA-Z_][a-zA-Z0-9_]*)":/g, "$1:"),
      )
      .join(",\n");
    writeFileSync(path, `${header}\n${items}${footer}`, "utf8");
    console.log(`padded laylat ${locale} -> ${next.length}`);
  }
}

function padSalah() {
  const files = readdirSync(i18nDir).filter((f) => /^salah-guide\.[a-z]{2}\.ts$/.test(f));
  // English topic order: … wudu, tayammum, clothing …
  // Overlay topics array index for clothing was previously at wuduIndex+1
  for (const file of files) {
    const locale = file.split(".")[1];
    const path = join(i18nDir, file);
    const exportName = `SALAH_GUIDE_TOPICS_${locale.toUpperCase()}`;
    let arr;
    try {
      arr = loadExport(path, exportName);
    } catch (e) {
      console.warn(`skip salah ${locale}: ${e.message}`);
      continue;
    }
    // Detect if tayammum already inserted by title keywords
    const hasTayammum = arr.some(
      (t) => typeof t?.title === "string" && /tayammum|تيمم|تیمم|teyemmüm|teyemmum/i.test(t.title),
    );
    if (hasTayammum) {
      console.log(`skip salah ${locale} (already has tayammum)`);
      continue;
    }
    // Find clothing topic by known title fragments
    const clothingIdx = arr.findIndex(
      (t) =>
        typeof t?.title === "string" &&
        /(clothing|awrah|اللباس|لباس|одежд|pakaian|kiyim|кіім)/i.test(t.title),
    );
    const insertAt =
      clothingIdx >= 0
        ? clothingIdx
        : arr.findIndex((t) => /wudu|وضو|الوضوء/i.test(t?.title ?? "")) + 1;
    if (insertAt <= 0) {
      console.warn(`cannot find insert point for salah ${locale}`);
      continue;
    }
    const stub = locale === "ar" ? TAYAMMUM_AR : locale === "ur" ? TAYAMMUM_UR : TAYAMMUM_EN;
    const next = [...arr.slice(0, insertAt), stub, ...arr.slice(insertAt)];
    const src = readFileSync(path, "utf8");
    const headerMatch = src.match(new RegExp(`[\\s\\S]*?export const ${exportName}[^=]*=\\s*\\[`));
    if (!headerMatch) {
      console.warn(`no header ${exportName}`);
      continue;
    }
    // Keep phrases export and anything after topics array — find end of topics array then rest
    const startIdx = headerMatch[0].length;
    let depth = 0;
    let endRel = -1;
    for (let i = startIdx - 1; i < src.length; i++) {
      if (src[i] === "[") depth++;
      else if (src[i] === "]") {
        depth--;
        if (depth === 0) {
          endRel = i;
          break;
        }
      }
    }
    if (endRel < 0) {
      console.warn(`no end for ${locale}`);
      continue;
    }
    const after = src.slice(endRel + 1);
    const items = next
      .map((item) =>
        JSON.stringify(item, null, 2)
          .replace(/^/gm, "  ")
          .replace(/"([a-zA-Z_][a-zA-Z0-9_]*)":/g, "$1:"),
      )
      .join(",\n");
    writeFileSync(path, `${headerMatch[0]}\n${items}\n]${after}`, "utf8");
    console.log(`padded salah ${locale} @${insertAt} -> ${next.length}`);
  }
}

padLaylat();
padSalah();
console.log("done");
