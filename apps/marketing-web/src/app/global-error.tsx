"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-emerald-600 px-6 py-2 text-white"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
