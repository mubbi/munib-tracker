"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FormInput } from "@/components/form-input";

export function ContactForm() {
  const formId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  // Honeypot: kept in state so React controls the input, but never sent by a
  // real user (the field is hidden). A filled value signals a bot.
  const [company, setCompany] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const successRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  // Move focus to the confirmation on success so keyboard and screen-reader
  // users are taken to the outcome instead of being left on the old form.
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  // On a submit failure, move focus to the alert so it is announced and reachable.
  useEffect(() => {
    if (status === "error" && errors.form) errorRef.current?.focus();
  }, [status, errors.form]);

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
        body: JSON.stringify({ name, email, message, company }),
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
        ref={successRef}
        role="status"
        tabIndex={-1}
        className="rounded-[var(--radius-card)] border border-border/60 bg-card p-6 outline-none"
      >
        <p className="font-semibold">Message sent.</p>
        <p className="mt-1 text-sm text-muted">Thank you — we will respond as soon as we can.</p>
      </div>
    );
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {/* Honeypot: hidden from users; bots that autofill it are rejected server-side. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor={`${formId}-company`}>Company</label>
        <input
          id={`${formId}-company`}
          type="text"
          name="company"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
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
        <p
          ref={errorRef}
          role="alert"
          tabIndex={-1}
          className="text-sm text-red-600 outline-none dark:text-red-400"
        >
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
