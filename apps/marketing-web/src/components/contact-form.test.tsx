import { fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactForm } from "@/components/contact-form";
import { renderWithIntl } from "@/test-support/intl";

function fillAndSubmit() {
  fireEvent.change(screen.getByLabelText(/^Name/), { target: { value: "Aisha" } });
  fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: "aisha@example.com" } });
  fireEvent.change(screen.getByLabelText(/^Message/), { target: { value: "Salaam" } });
  fireEvent.click(screen.getByRole("button", { name: "Send message" }));
}

describe("ContactForm", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows translated validation messages", () => {
    renderWithIntl(<ContactForm />);
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect(screen.getByText("Please enter your name.")).toBeInTheDocument();
    expect(screen.getByText("Please enter a valid email address.")).toBeInTheDocument();
    expect(screen.getByText("Please enter a message.")).toBeInTheDocument();
  });

  it("maps an API error code to catalog copy", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json(
          { error: "server text", code: "rate_limited_email", limit: 2 },
          { status: 429 },
        ),
      ),
    );
    renderWithIntl(<ContactForm />);
    fillAndSubmit();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "You have reached the limit of 2 messages per day for this email. Please try again tomorrow.",
    );
  });

  it("falls back to the generic message for an unknown error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ error: "boom" }, { status: 500 })),
    );
    renderWithIntl(<ContactForm />);
    fillAndSubmit();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Something went wrong. Please try again.",
    );
  });

  it("confirms a sent message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ ok: true })),
    );
    renderWithIntl(<ContactForm />);
    fillAndSubmit();
    expect(await screen.findByRole("status")).toHaveTextContent("Message sent.");
  });
});
