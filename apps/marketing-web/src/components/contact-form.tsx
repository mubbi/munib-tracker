"use client";

import { useId, useState } from "react";
import { FormInput } from "@/components/form-input";

export function ContactForm() {
  const formId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!name.trim()) nextErrors.name = "Please enter your name.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (!message.trim()) nextErrors.message = "Please enter a message.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) throw new Error("Request failed");

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrors({ form: "Something went wrong. Please try again." });
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-[var(--radius-card)] border border-border/60 bg-card p-6"
      >
        <p className="font-semibold">Message sent.</p>
        <p className="mt-1 text-sm text-muted">Thank you — we will respond as soon as we can.</p>
      </div>
    );
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <FormInput
        id={`${formId}-name`}
        label="Name"
        name="name"
        value={name}
        onChange={setName}
        error={errors.name}
        required
        autoComplete="name"
      />
      <FormInput
        id={`${formId}-email`}
        label="Email"
        type="email"
        name="email"
        value={email}
        onChange={setEmail}
        error={errors.email}
        required
        autoComplete="email"
      />
      <FormInput
        id={`${formId}-message`}
        label="Message"
        type="textarea"
        name="message"
        value={message}
        onChange={setMessage}
        error={errors.message}
        placeholder="How can we help?"
        required
      />
      {errors.form ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {errors.form}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex h-12 w-fit items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold text-accent-foreground transition-[transform,opacity] hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
