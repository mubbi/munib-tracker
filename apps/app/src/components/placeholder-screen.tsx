import { useRouter } from "expo-router";
import type { SymbolViewProps } from "expo-symbols";

import { ScreenLayout } from "@/components/screen-layout";
import { EmptyState } from "@/components/ui/empty-state";

type PlaceholderScreenProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  icon: SymbolViewProps["name"];
  emptyTitle: string;
  description: string;
};

/** A calm, themed placeholder for routes whose full feature lands in a later phase. */
export function PlaceholderScreen({
  eyebrow,
  title,
  subtitle,
  icon,
  emptyTitle,
  description,
}: PlaceholderScreenProps) {
  const router = useRouter();
  return (
    <ScreenLayout
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <EmptyState icon={icon} title={emptyTitle} description={description} />
    </ScreenLayout>
  );
}
