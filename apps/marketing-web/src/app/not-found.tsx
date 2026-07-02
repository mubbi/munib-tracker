import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="text-muted">The page you are looking for does not exist.</p>
      <Link href="/" className="text-brand underline">
        Return home
      </Link>
    </main>
  );
}
