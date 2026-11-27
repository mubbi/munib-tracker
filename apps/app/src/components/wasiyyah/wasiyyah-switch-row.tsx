import { SwitchRow } from "@/components/ui/switch-row";

/** A labelled switch row used across the wasiyyah wizard steps (the shared `SwitchRow`). */
export function WasiyyahSwitchRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return <SwitchRow title={label} value={value} onValueChange={onChange} />;
}
