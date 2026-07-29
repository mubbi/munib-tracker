import { FILTER_CONTROL_CLASS, FilterField } from "@/components/ui/filter-bar";
import { Input, Select } from "@/components/ui/input";

type DateRangeFieldsProps = {
  period?: string;
  from?: string;
  to?: string;
  /** Shorter preset label for tight filter bars. */
  anyTimeLabel?: string;
};

export function DateRangeFields({
  period,
  from,
  to,
  anyTimeLabel = "Any time",
}: DateRangeFieldsProps) {
  return (
    <>
      <FilterField label="Period">
        <Select
          name="period"
          defaultValue={period ?? ""}
          className={FILTER_CONTROL_CLASS}
          aria-label="Period"
        >
          <option value="">{anyTimeLabel}</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="custom">Custom range</option>
        </Select>
      </FilterField>
      <FilterField label="From">
        <Input
          type="date"
          name="from"
          defaultValue={from ?? ""}
          className={FILTER_CONTROL_CLASS}
          aria-label="From date"
        />
      </FilterField>
      <FilterField label="To">
        <Input
          type="date"
          name="to"
          defaultValue={to ?? ""}
          className={FILTER_CONTROL_CLASS}
          aria-label="To date"
        />
      </FilterField>
    </>
  );
}
