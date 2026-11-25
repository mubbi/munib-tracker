import {
  DEVICE_ROWS,
  type DeviceKey,
  MUNIB_DEVICES,
  NOT_ON_APP_STORE,
} from "@/content/compare/devices";
import { cell } from "@/content/compare/shared";
import type { CompareCell, ComparePage } from "@/content/types";

/**
 * Urdu copy of `compare/devices.ts`. Munib Tracker's device cells (and the
 * "not on its App Store listing" cell) are mapped from the English values,
 * replacing only the note, so statuses stay in step with the English file.
 */
const ROW_LABELS: Readonly<Record<DeviceKey, string>> = {
  web: "ویب ایپ (کوئی بھی براؤزر)",
  pwa: "انسٹال ہونے والی ویب ایپ (PWA)",
  ios: "iPhone اور iPad",
  android: "Android فونز اور ٹیبلیٹس",
  appleWatch: "Apple Watch",
  wearOs: "Wear OS",
  appleTv: "Apple TV",
  androidTv: "Android TV",
  widgets: "ہوم اسکرین وجیٹس",
  liveActivities: "Live Activities / Live Updates",
};

const NOTES: Readonly<Record<string, string>> = {
  "Full app in any modern browser": "کسی بھی جدید براؤزر میں مکمل ایپ",
  "Installs from the browser and works offline": "براؤزر سے انسٹال ہوتی ہے اور آف لائن چلتی ہے",
  "iPhone and iPad, with wide-screen layouts": "iPhone اور iPad، چوڑی اسکرین کے لے آؤٹس کے ساتھ",
  "Phones, tablets and foldables": "فونز، ٹیبلیٹس اور فولڈ ہونے والے فونز",
  "Companion: today's schedule, mark Salah, tasbeeh and complications; needs the iPhone app":
    "ساتھی ایپ: آج کا شیڈول، نماز درج کرنا، تسبیح اور کمپلیکیشنز؛ iPhone ایپ ضروری ہے",
  "Tiles: next Salah (marks it on the phone) and a tasbeeh counter":
    "ٹائلز: اگلی نماز (فون پر درج ہوتی ہے) اور تسبیح کاؤنٹر",
  "Full app with remote navigation; phone-only features are hidden":
    "ریموٹ سے چلنے والی مکمل ایپ؛ صرف فون والی خصوصیات چھپی رہتی ہیں",
  "Full app, incl. Fire TV; phone-only features are hidden":
    "مکمل ایپ، Fire TV سمیت؛ صرف فون والی خصوصیات چھپی رہتی ہیں",
  "Home and lock screen on iPhone; home screen on Android":
    "iPhone پر ہوم اور لاک اسکرین؛ Android پر ہوم اسکرین",
  "iPhone Live Activities and Android Live Updates":
    "iPhone پر Live Activities اور Android پر Live Updates",
  "Not on its App Store listing": "اس کی App Store لسٹنگ میں درج نہیں",
};

function localizeDeviceCell(value: CompareCell): CompareCell {
  if ("text" in value) return value;
  if (!value.note) return value;
  const note = NOTES[value.note];
  if (note === undefined) throw new Error(`Missing Urdu for device cell "${value.note}"`);
  return { ...value, note };
}

const MUNIB_DEVICES_UR = Object.fromEntries(
  Object.entries(MUNIB_DEVICES).map(([key, value]) => [key, localizeDeviceCell(value)]),
) as Readonly<Record<DeviceKey, CompareCell>>;

/** App Store "Compatibility" lists no such device (status from the English cell). */
export const NOT_ON_APP_STORE_UR = localizeDeviceCell(NOT_ON_APP_STORE);

type Row = ComparePage["table"][number]["rows"][number];

/** Urdu `devicesGroup()`: same rows, order and statuses as the English helper. */
export function devicesGroupUr(
  competitors: Readonly<Record<string, Partial<Record<DeviceKey, CompareCell>>>>,
  extraRows: readonly Row[] = [],
): ComparePage["table"][number] {
  return {
    group: "ڈیوائسز اور پلیٹ فارمز",
    rows: [
      ...DEVICE_ROWS.map(({ key }) => ({
        feature: ROW_LABELS[key],
        cells: {
          munib: MUNIB_DEVICES_UR[key],
          ...Object.fromEntries(
            Object.entries(competitors).map(([id, cells]) => [id, cells[key] ?? cell.unverified()]),
          ),
        },
      })),
      ...extraRows,
    ],
  };
}
