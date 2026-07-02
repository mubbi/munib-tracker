import { Features } from "@/components/features";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Features />
    </main>
  );
}
