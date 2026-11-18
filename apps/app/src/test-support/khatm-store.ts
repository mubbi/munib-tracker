import { act } from "@testing-library/react-native";

import type { KhatmPlan } from "@/lib/khatm";
import { khatmStore } from "@/stores/khatm-store";

/**
 * Seeds the real khatm store as loaded (so `useEnsureKhatmLoaded` skips storage).
 * `plan: null` = no active plan. Call `seedKhatm({ plan: null })` in `afterEach`.
 */
export async function seedKhatm({
  plan,
  ayahsRead = 0,
  unit = plan?.unit ?? "ayah",
}: {
  plan: KhatmPlan | null;
  ayahsRead?: number;
  unit?: "ayah" | "page";
}): Promise<void> {
  await act(async () => {
    khatmStore.setState({ plan, ayahsRead, unit, isReady: true });
  });
}
