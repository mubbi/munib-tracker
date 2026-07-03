import { PlaceholderScreen } from "@/components/placeholder-screen";

export default function DuaHomeScreen() {
  return (
    <PlaceholderScreen
      eyebrow="Supplication"
      title="Duas"
      subtitle="Sunnah, Quranic, and daily duas"
      icon={{
        ios: "hands.and.sparkles.fill",
        android: "volunteer_activism",
        web: "volunteer_activism",
      }}
      emptyTitle="Dua library is on the way"
      description="A categorized dua library with audio arrives in Phase 6."
    />
  );
}
