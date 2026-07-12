import { FILTER_CONTROL_CLASS, FilterField } from "@/components/ui/filter-bar";
import { Select } from "@/components/ui/input";
import { CLIENT_PLATFORMS, clientPlatformLabel } from "@/lib/filter-options";

type PlatformFilterFieldProps = {
  name?: string;
  defaultValue?: string;
};

/** Shared ios / android / web filter control for admin list pages. */
export function PlatformFilterField({ name = "platform", defaultValue }: PlatformFilterFieldProps) {
  return (
    <FilterField label="Platform">
      <Select
        name={name}
        defaultValue={defaultValue ?? ""}
        className={FILTER_CONTROL_CLASS}
        aria-label="Platform"
      >
        <option value="">All platforms</option>
        {CLIENT_PLATFORMS.map((value) => (
          <option key={value} value={value}>
            {clientPlatformLabel(value)}
          </option>
        ))}
      </Select>
    </FilterField>
  );
}
