"use client";

import { useId } from "react";

type FormInputProps = {
  id: string;
  label: string;
  type?: "text" | "email" | "textarea";
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
};

export function FormInput({
  id,
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  placeholder,
  required,
  autoComplete,
}: FormInputProps) {
  const errorId = useId();
  const describedBy = error ? errorId : undefined;

  const inputClass =
    "w-full rounded-xl border border-border/80 bg-background px-4 py-3 text-sm transition-colors placeholder:text-muted/70 focus:border-brand";

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required ? <span className="text-brand"> *</span> : null}
      </label>
      {type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          rows={5}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={inputClass}
        />
      ) : (
        <input
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={inputClass}
        />
      )}
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
