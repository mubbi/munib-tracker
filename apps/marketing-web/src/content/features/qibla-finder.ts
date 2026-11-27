import type { FeaturePage } from "@/content/types";

export const qiblaFinder: FeaturePage = {
  slug: "qibla-finder",
  icon: "qibla",
  navLabel: "Qibla finder",
  navHint: "Compass, bearing and distance",
  group: "everyday",
  title: "Find the Qibla direction from wherever you are",
  seoTitle: "Qibla Finder — Qibla Direction Compass for iPhone & Android",
  seoDescription:
    "Find the Qibla with a live compass that tells you which way to turn, the bearing in degrees and the distance to the Kaaba. Worked out on your device. Free.",
  description:
    "A Qibla compass that guides you turn by turn, with the bearing in degrees, the distance to the Kaaba and nine dial styles.",
  keywords: [
    "qibla finder",
    "qibla direction",
    "qibla compass",
    "find qibla direction",
    "kaaba direction",
  ],
  cluster: "prayer-times",
  published: "2026-11-27",
  updated: "2026-11-27",
  eyebrow: "Qibla finder",
  intro:
    "Open the Qibla screen, hold your phone flat and turn until it tells you that you're facing the Kaaba. The direction is worked out on your device from your location, so it is ready in a hotel room, an office or a friend's house.",
  hero: {
    key: "qibla",
    caption: "The Qibla compass, with the bearing in degrees and the distance to the Kaaba.",
  },
  whatItDoes: {
    title: "What it includes",
    groups: [
      {
        title: "A compass that guides you",
        items: [
          "A live dial on iPhone and Android phones that turns as you turn",
          "Plain directions: turn left or right, slightly left or right, then a final nudge",
          "How many degrees you are off, updated as you move",
          "An Aligned with the Qibla message and a gentle haptic when you're within 5 degrees",
        ],
      },
      {
        title: "The numbers behind it",
        items: [
          "The Qibla bearing in degrees for your location",
          "The distance to the Kaaba in kilometres",
          "A compass accuracy reading (high, medium, low or unreliable) when your phone reports one",
          "An Approximate badge while no location has been set",
        ],
      },
      {
        title: "Your location, your choice",
        items: [
          "Uses GPS if you've allowed it, or a city you picked by hand",
          "Opening the Qibla screen never triggers a permission prompt",
          "The same location drives your [Salah times](/features/prayer-times-qibla), so you set it once",
        ],
      },
      {
        title: "Compass styles",
        items: [
          "Nine dial designs, from Classic and Minimal to Astrolabe, Mihrab and Night sky",
          "A Bold arrow style that is easy to read at a glance",
          "The direction is identical in every style; only the look changes",
        ],
      },
      {
        title: "Without a compass sensor",
        items: [
          "In a web browser, the arrow shows the Qibla bearing from north for you to line up with a physical compass",
          "On Apple TV and Android TV, the bearing for your chosen city",
          "On a phone with no compass sensor, the bearing measured clockwise from true north",
        ],
      },
    ],
  },
  why: {
    title: "Why a compass that tells you which way to turn?",
    paragraphs: [
      "At home you know where the Qibla is. The question comes up everywhere else: a new flat, an airport, a room with no window. An arrow that only points leaves you guessing how far to turn.",
      "Munib Tracker reads it out in words, such as slightly left and the degrees still to go, and tells you clearly when you're aligned. You can stop looking at the screen once you feel the haptic.",
      "Phone compasses are easily thrown off by metal furniture, speakers and magnetic cases. The app tells you when the reading looks unreliable and how to calibrate, so you know when to trust it.",
    ],
  },
  howItWorks: {
    title: "How it works",
    steps: [
      {
        title: "Set your location",
        text: "Allow location access or pick your city. Until you do, the compass is marked Approximate.",
      },
      {
        title: "Open the Qibla screen",
        text: "Hold the phone flat, away from metal and magnets. If the reading seems off, move the phone in a figure of eight to calibrate.",
      },
      {
        title: "Follow the directions",
        text: "Turn the way the screen tells you and watch the degrees count down.",
      },
      {
        title: "Stop when it says aligned",
        text: "You'll feel a haptic and see Aligned with the Qibla. Hold steady: you're facing the Kaaba.",
      },
    ],
  },
  benefits: [
    {
      title: "Clear guidance",
      text: "Words and degrees as well as an arrow, so you know how far is left to turn.",
    },
    {
      title: "Worked out on your device",
      text: "The bearing is calculated on the phone from your coordinates, so finding the direction doesn't depend on a connection.",
    },
    {
      title: "Honest about accuracy",
      text: "The screen says when the compass reading is weak or when it is using an approximate location.",
    },
    {
      title: "Your own look",
      text: "Pick the dial you find easiest to read; the direction stays the same.",
    },
  ],
  gallery: [
    {
      key: "qibla",
      device: "android",
      caption: "The Qibla compass on an Android phone.",
    },
    {
      key: "qibla",
      device: "ipad",
      caption: "The Qibla screen on iPad, with the bearing and distance.",
    },
  ],
  examples: {
    title: "Ways to use it",
    items: [
      {
        title: "In a hotel room",
        text: "Update your location when you arrive, open the compass and turn until you feel the haptic.",
      },
      {
        title: "At your desk",
        text: "Check the bearing in the web app, then line it up with a physical compass or a landmark you know.",
      },
      {
        title: "In a new home",
        text: "Find the direction once, away from appliances, and note which wall or window it lines up with.",
      },
      {
        title: "Before Salah on the road",
        text: "Refresh your location at a rest stop, find the direction, and log the [Salah](/features/salah-tracker) once you've prayed.",
      },
    ],
  },
  notes: [
    {
      tone: "info",
      title: "Compass accuracy",
      text: "A phone compass is affected by nearby metal, magnets and electronics. Calibrate with a figure-of-eight motion, step away from interference and, where you can, check against a Masjid's direction or a known landmark.",
    },
    {
      tone: "info",
      title: "Web and TV",
      text: "The live compass and the haptic need a phone with a compass sensor. In a browser and on TV the app shows the bearing from north for your location, not a live dial.",
    },
    {
      tone: "info",
      title: "Location",
      text: "Until you set a location, the app uses a default one and marks the compass Approximate. Set your city or allow GPS for a bearing that is right for where you are.",
    },
  ],
  faqs: [
    {
      question: "How do I find the Qibla direction on my phone?",
      answer:
        "Open the Qibla screen in Munib Tracker, hold your phone flat and turn the way the screen tells you until it says Aligned with the Qibla. The app needs your location, from GPS or a city you choose, to work out the bearing.",
    },
    {
      question: "How accurate is a phone Qibla compass?",
      answer:
        "The bearing itself is calculated from your coordinates; what varies is your phone's compass sensor. Metal, magnets and electronics can pull it off, so the app shows an accuracy reading when the phone provides one and reminds you to calibrate.",
    },
    {
      question: "How do I calibrate the compass?",
      answer:
        "Hold the phone flat and move it in a figure of eight a few times, away from metal objects and magnets. Magnetic phone cases and car mounts are common causes of a wrong reading.",
    },
    {
      question: "Can I find the Qibla without internet?",
      answer:
        "Yes. The Qibla bearing is calculated on your device from your location, and the compass uses your phone's own sensor. If you chose your city earlier, the app already has what it needs.",
    },
    {
      question: "Does the Qibla finder work in a web browser?",
      answer:
        "Partly. The web app shows the Qibla bearing in degrees from north and the distance to the Kaaba for your location, but compass sensors aren't available in the browser, so there is no live dial. Use the phone app for turn-by-turn alignment.",
    },
    {
      question: "What does the Qibla bearing in degrees mean?",
      answer:
        "It is the angle of the Qibla measured clockwise from north at your location. If you have a physical compass, turn until it reads that number and you're facing the Qibla.",
    },
  ],
  related: [
    "prayer-times-qibla",
    "salah-tracker",
    "masjid-finder",
    "umrah-mode",
    "widgets-and-devices",
  ],
  guides: ["/resources/salah/how-to-build-a-consistent-salah-habit"],
  cta: {
    title: "Know which way to face, wherever you are",
    text: "Download Munib Tracker, set your location once and open the Qibla compass whenever you need it.",
  },
};
