import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookMarked,
  BookOpen,
  CalendarCheck,
  Compass,
  Footprints,
  GraduationCap,
  Hand,
  Landmark,
  ListChecks,
  Mic,
  MoonStar,
  NotebookPen,
  RotateCcw,
  Scale,
  ScrollText,
  ShieldCheck,
  Users,
  Watch,
} from "lucide-react";
import type { FeatureIconKey } from "@/content/types";

export const FEATURE_ICON: Record<FeatureIconKey, LucideIcon> = {
  salah: ListChecks,
  qaza: RotateCcw,
  zikr: Hand,
  quran: BookOpen,
  practice: Mic,
  learn: GraduationCap,
  habits: CalendarCheck,
  progress: BarChart3,
  times: Compass,
  devices: Watch,
  masjid: Landmark,
  focus: ShieldCheck,
  family: Users,
  will: ScrollText,
  hadith: BookMarked,
  madhhab: Scale,
  fasting: MoonStar,
  umrah: Footprints,
  reflection: NotebookPen,
};

export function FeatureIcon({ icon, className }: { icon: FeatureIconKey; className?: string }) {
  const Icon = FEATURE_ICON[icon];
  return <Icon aria-hidden className={className ?? "size-5"} />;
}
