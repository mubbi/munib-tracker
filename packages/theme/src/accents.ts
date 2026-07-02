import type { AccentColorId } from "./types";

export interface AccentDefinition {
  id: AccentColorId;
  label: string;
  light: string;
  dark: string;
  foreground: string;
}

export const accentColors: Record<AccentColorId, AccentDefinition> = {
  gold: {
    id: "gold",
    label: "Gold",
    light: "#B8956A",
    dark: "#D4C5A0",
    foreground: "#152921",
  },
  emerald: {
    id: "emerald",
    label: "Emerald",
    light: "#059669",
    dark: "#34d399",
    foreground: "#ffffff",
  },
  teal: {
    id: "teal",
    label: "Teal",
    light: "#0d9488",
    dark: "#2dd4bf",
    foreground: "#ffffff",
  },
  amber: {
    id: "amber",
    label: "Amber",
    light: "#d97706",
    dark: "#fbbf24",
    foreground: "#1c1917",
  },
  slate: {
    id: "slate",
    label: "Slate",
    light: "#475569",
    dark: "#94a3b8",
    foreground: "#ffffff",
  },
};

export const accentColorIds = Object.keys(accentColors) as AccentColorId[];

export const defaultAccentColorId: AccentColorId = "gold";
