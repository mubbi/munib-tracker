import {
  arabicWordCount,
  HANDS_FREE_MAX_WORDS,
  isHandsFreeCounter,
  isHandsFreeStep,
  isShortZikrText,
  type StepVoiceInput,
  stepVoiceDecision,
} from "./steps";

const idle: StepVoiceInput = {
  on: true,
  eligible: true,
  active: true,
  atLimit: false,
  taught: false,
  pausePreferred: false,
  busy: false,
  teaching: false,
  listeningOther: false,
  blocked: false,
};

describe("which session steps offer hands-free counting (D69)", () => {
  it("counts Arabic words only", () => {
    expect(arabicWordCount("سُبْحَانَ اللَّهِ")).toBe(2);
    expect(arabicWordCount("  الْحَمْدُ   لِلَّهِ ، ")).toBe(2);
    expect(arabicWordCount("")).toBe(0);
  });

  it("offers short repeated zikr, never single recitations or long passages", () => {
    expect(isHandsFreeStep({ arabic: "سُبْحَانَ اللَّهِ" }, 33)).toBe(true);
    expect(isHandsFreeStep({ arabic: "سُبْحَانَ اللَّهِ" }, 1)).toBe(false);
    const long = Array.from({ length: HANDS_FREE_MAX_WORDS + 1 }, () => "اللَّهُ").join(" ");
    expect(isHandsFreeStep({ arabic: long }, 10)).toBe(false);
    expect(isHandsFreeStep({ arabic: "" }, 10)).toBe(false);
  });
});

describe("what the microphone does on each step", () => {
  it("starts a taught zikr at once and an untaught one by pauses once skipping was chosen", () => {
    expect(stepVoiceDecision({ ...idle, taught: true })).toBe("start");
    expect(stepVoiceDecision({ ...idle, pausePreferred: true })).toBe("start-pause");
  });

  it("asks to teach or skip for an untaught zikr (D50)", () => {
    expect(stepVoiceDecision(idle)).toBe("choose");
  });

  it("stays closed while off, between steps, at the target, or behind a sheet", () => {
    expect(stepVoiceDecision({ ...idle, on: false, taught: true })).toBe("none");
    expect(stepVoiceDecision({ ...idle, active: false, taught: true })).toBe("none");
    expect(stepVoiceDecision({ ...idle, atLimit: true, taught: true })).toBe("none");
    expect(stepVoiceDecision({ ...idle, eligible: false, taught: true })).toBe("none");
    expect(stepVoiceDecision({ ...idle, blocked: true, taught: true })).toBe("none");
  });

  it("releases the microphone when the step stops being a counting step", () => {
    const busy = { ...idle, busy: true, taught: true };
    expect(stepVoiceDecision(busy)).toBe("none");
    expect(stepVoiceDecision({ ...busy, active: false })).toBe("stop");
    expect(stepVoiceDecision({ ...busy, on: false })).toBe("stop");
    expect(stepVoiceDecision({ ...busy, eligible: false })).toBe("stop");
    expect(stepVoiceDecision({ ...busy, listeningOther: true })).toBe("stop");
  });

  it("keeps teaching while wanted and drops it when the step goes away", () => {
    expect(stepVoiceDecision({ ...idle, teaching: true })).toBe("none");
    expect(stepVoiceDecision({ ...idle, teaching: true, active: false })).toBe("cancel-teach");
  });
});

describe("single counters follow the same one-breath rule", () => {
  const long = Array.from({ length: HANDS_FREE_MAX_WORDS + 1 }, () => "اللَّهُ").join(" ");

  it("measures Arabic text", () => {
    expect(isShortZikrText("سُبْحَانَ اللَّهِ")).toBe(true);
    expect(isShortZikrText(long)).toBe(false);
    expect(isShortZikrText("SubhanAllah")).toBe(false);
  });

  it("hides hands-free for long items and single recitations, keeps open-ended counters", () => {
    expect(isHandsFreeCounter({ arabic: "سُبْحَانَ اللَّهِ" }, 33)).toBe(true);
    expect(isHandsFreeCounter({ arabic: "سُبْحَانَ اللَّهِ" }, 0)).toBe(true);
    expect(isHandsFreeCounter({ arabic: "سُبْحَانَ اللَّهِ" }, 1)).toBe(false);
    expect(isHandsFreeCounter({ arabic: long }, 33)).toBe(false);
    // A title-only custom tasbeeh cannot be measured: still offered.
    expect(isHandsFreeCounter({ arabic: "" }, 33)).toBe(true);
    expect(isHandsFreeCounter({}, 33)).toBe(true);
  });
});
