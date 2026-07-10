import { useRouter } from "expo-router";
import { useEffect } from "react";

import { nativeEnqueueCommand } from "@/lib/external-commands/native-bridge";

/** App Actions deep link: munib-tracker://mark-current */
export default function MarkCurrentDeepLinkScreen() {
  const router = useRouter();

  useEffect(() => {
    void (async () => {
      await nativeEnqueueCommand({ type: "mark-current-obligatory", source: "assistant" });
      router.replace("/(tabs)/tracker");
    })();
  }, [router]);

  return null;
}
