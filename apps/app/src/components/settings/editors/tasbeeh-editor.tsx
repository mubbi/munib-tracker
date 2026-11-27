import { TasbeehAppearanceEditor } from "@/components/tasbeeh/tasbeeh-appearance-editor";

/**
 * Hadith, duas & adhkar › Tasbeeh counter (NF-3.19, §4.5.8): the counter's own
 * "Counter style" editor is this section's detail editor, so Settings and the
 * counter's style sheet share one component and one write path.
 */
export function TasbeehAppearanceSettingsEditor() {
  return <TasbeehAppearanceEditor />;
}
