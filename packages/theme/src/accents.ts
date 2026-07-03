import type { AccentColorId } from "./types";

export interface AccentDefinition {
  id: AccentColorId;
  label: string;
  light: string;
  dark: string;
  foreground: string;
}

/** Preset accent colours aligned with smart-expense-tracker `PRESET_ACCENT_COLORS`. */
export const accentColors: Record<AccentColorId, AccentDefinition> = {
  forest: {
    id: "forest",
    label: "Forest",
    light: "#2E7D32",
    dark: "#66BB6A",
    foreground: "#ffffff",
  },
  ocean: {
    id: "ocean",
    label: "Ocean",
    light: "#1565C0",
    dark: "#42A5F5",
    foreground: "#ffffff",
  },
  indigo: {
    id: "indigo",
    label: "Indigo",
    light: "#3730A3",
    dark: "#818CF8",
    foreground: "#ffffff",
  },
  purple: {
    id: "purple",
    label: "Purple",
    light: "#7C3AED",
    dark: "#A78BFA",
    foreground: "#ffffff",
  },
  rose: {
    id: "rose",
    label: "Rose",
    light: "#E11D48",
    dark: "#FB7185",
    foreground: "#ffffff",
  },
  coral: {
    id: "coral",
    // Light shade darkened from #E64A19 so white text on the accent fill clears WCAG AA.
    label: "Coral",
    light: "#C2410C",
    dark: "#FB923C",
    foreground: "#ffffff",
  },
  amber: {
    id: "amber",
    label: "Amber",
    light: "#D97706",
    dark: "#FBBF24",
    foreground: "#1c1917",
  },
  teal: {
    id: "teal",
    label: "Teal",
    light: "#0F766E",
    dark: "#2DD4BF",
    foreground: "#ffffff",
  },
  cyan: {
    id: "cyan",
    // Light shade darkened from #0284C7 so white text on the accent fill clears WCAG AA.
    label: "Cyan",
    light: "#0369A1",
    dark: "#38BDF8",
    foreground: "#ffffff",
  },
  slate: {
    id: "slate",
    label: "Slate",
    light: "#475569",
    dark: "#94A3B8",
    foreground: "#ffffff",
  },
  pink: {
    id: "pink",
    label: "Pink",
    light: "#DB2777",
    dark: "#F472B6",
    foreground: "#ffffff",
  },
  lime: {
    id: "lime",
    label: "Lime",
    light: "#65A30D",
    dark: "#A3E635",
    foreground: "#1c1917",
  },
};

export const accentColorIds = Object.keys(accentColors) as AccentColorId[];

/** Matches smart-expense-tracker `DEFAULT_PRIMARY_COLOR`. */
export const defaultAccentColorId: AccentColorId = "forest";

/** Maps removed Munib accent ids to the closest new preset. */
const legacyAccentColorMap: Record<string, AccentColorId> = {
  gold: "amber",
  emerald: "forest",
};

export function resolveAccentColorId(stored: string | null): AccentColorId | null {
  if (stored === null) return null;
  if (accentColorIds.includes(stored as AccentColorId)) {
    return stored as AccentColorId;
  }
  return legacyAccentColorMap[stored] ?? null;
}
