import { DEVICE_ROWS, type DeviceKey, MUNIB_DEVICES } from "@/content/compare/devices";
import { cell } from "@/content/compare/shared";
import type { CompareCell, ComparePage } from "@/content/types";

/**
 * Arabic copy of `compare/devices.ts`. Munib Tracker's device cells are mapped
 * from the English `MUNIB_DEVICES`, replacing only the note, so statuses stay
 * in step with the English file.
 */
const ROW_LABELS: Readonly<Record<DeviceKey, string>> = {
  web: "تطبيق ويب (أي متصفح)",
  pwa: "تطبيق ويب قابل للتثبيت (PWA)",
  ios: "iPhone وiPad",
  android: "هواتف Android وأجهزتها اللوحية",
  appleWatch: "Apple Watch",
  wearOs: "Wear OS",
  appleTv: "Apple TV",
  androidTv: "Android TV",
  widgets: "أدوات الشاشة الرئيسية",
  liveActivities: "الأنشطة المباشرة (Live Activities / Live Updates)",
};

const NOTES: Readonly<Record<string, string>> = {
  "Full app in any modern browser": "التطبيق كاملًا في أي متصفح حديث",
  "Installs from the browser and works offline": "يُثبَّت من المتصفح ويعمل دون اتصال",
  "iPhone and iPad, with wide-screen layouts": "iPhone وiPad، مع تخطيطات للشاشات العريضة",
  "Phones, tablets and foldables": "الهواتف والأجهزة اللوحية والقابلة للطي",
  "Companion: today's schedule, mark Salah, tasbeeh and complications; needs the iPhone app":
    "تطبيق مرافق: جدول اليوم، وتسجيل الصلاة، والتسبيح، وإضافات واجهة الساعة؛ ويتطلب تطبيق iPhone",
  "Tiles: next Salah (marks it on the phone) and a tasbeeh counter":
    "مربّعات: الصلاة التالية (وتُسجَّل على الهاتف) وعدّاد تسبيح",
  "Full app with remote navigation; phone-only features are hidden":
    "التطبيق كاملًا مع التنقل بجهاز التحكم؛ وتُخفى الميزات الخاصة بالهاتف",
  "Full app, incl. Fire TV; phone-only features are hidden":
    "التطبيق كاملًا، بما في ذلك Fire TV؛ وتُخفى الميزات الخاصة بالهاتف",
  "Home and lock screen on iPhone; home screen on Android":
    "الشاشة الرئيسية وشاشة القفل على iPhone؛ والشاشة الرئيسية على Android",
  "iPhone Live Activities and Android Live Updates":
    "الأنشطة المباشرة على iPhone والتحديثات المباشرة على Android",
};

function localizeDeviceCell(value: CompareCell): CompareCell {
  if ("text" in value) return value;
  if (!value.note) return value;
  const note = NOTES[value.note];
  if (note === undefined) throw new Error(`Missing Arabic for device cell "${value.note}"`);
  return { ...value, note };
}

const MUNIB_DEVICES_AR = Object.fromEntries(
  Object.entries(MUNIB_DEVICES).map(([key, value]) => [key, localizeDeviceCell(value)]),
) as Readonly<Record<DeviceKey, CompareCell>>;

/** App Store "Compatibility" lists no such device. */
export const NOT_ON_APP_STORE_AR = cell.no("غير مذكور في صفحته على App Store");

type Row = ComparePage["table"][number]["rows"][number];

/** Arabic `devicesGroup()`: same rows, order and statuses as the English helper. */
export function devicesGroupAr(
  competitors: Readonly<Record<string, Partial<Record<DeviceKey, CompareCell>>>>,
  extraRows: readonly Row[] = [],
): ComparePage["table"][number] {
  return {
    group: "الأجهزة والمنصات",
    rows: [
      ...DEVICE_ROWS.map(({ key }) => ({
        feature: ROW_LABELS[key],
        cells: {
          munib: MUNIB_DEVICES_AR[key],
          ...Object.fromEntries(
            Object.entries(competitors).map(([id, cells]) => [id, cells[key] ?? cell.unverified()]),
          ),
        },
      })),
      ...extraRows,
    ],
  };
}
