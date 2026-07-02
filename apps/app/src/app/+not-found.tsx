import { Link } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function NotFoundScreen() {
  return (
    <ThemedView style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 16 }}>
      <ThemedText type="subtitle">Page not found</ThemedText>
      <Link href="/">
        <ThemedText type="linkPrimary">Go home</ThemedText>
      </Link>
    </ThemedView>
  );
}
