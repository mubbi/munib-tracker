import { QiblaCompassStyleEditor as Editor } from "@/components/qibla/qibla-compass-style-editor";

/**
 * Appearance & home › Qibla compass: the Qibla screen's own style picker is this
 * section's editor, so Settings and the screen's style sheet share one
 * component and one write path.
 */
export function QiblaCompassStyleEditor() {
  return <Editor />;
}
