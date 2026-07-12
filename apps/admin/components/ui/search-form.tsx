import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormPanel } from "@/components/ui/field";
import { InputGroup, InputLeadingIcon, InputWithLeading } from "@/components/ui/input";

type SearchFormProps = {
  /** Form GET action (the page path). */
  action: string;
  name?: string;
  defaultValue?: string;
  placeholder?: string;
  buttonLabel?: string;
  /** Wrap in a bordered panel (default true). */
  bordered?: boolean;
};

/** Shared GET search form — Catalyst-style bordered search input. */
export function SearchForm({
  action,
  name = "q",
  defaultValue,
  placeholder,
  buttonLabel = "Search",
  bordered = true,
}: SearchFormProps) {
  const form = (
    <form className="flex flex-col gap-3 sm:flex-row sm:items-stretch" action={action} method="get">
      <InputGroup className="flex-1">
        <InputLeadingIcon>
          <Search className="h-4 w-4" />
        </InputLeadingIcon>
        <InputWithLeading
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          aria-label={placeholder ?? "Search"}
        />
      </InputGroup>
      <Button type="submit" className="sm:w-auto">
        {buttonLabel}
      </Button>
    </form>
  );

  if (!bordered) return form;
  return <FormPanel className="p-4 sm:p-5">{form}</FormPanel>;
}
