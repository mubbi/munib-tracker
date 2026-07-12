import * as Sharing from "expo-sharing";
import { InteractionManager, Linking, Platform, Share } from "react-native";

function waitForInteractions(): Promise<void> {
  return new Promise((resolve) => {
    InteractionManager.runAfterInteractions(() => {
      setTimeout(resolve, 150);
    });
  });
}

/**
 * Open or share an attachment externally (used for PDFs — no inline renderer).
 * Web uses `window.open`; native prefers the share sheet.
 */
export async function openAttachmentExternally(options: {
  uri: string;
  mimeType?: string;
  fileName: string;
  dialogTitle: string;
}): Promise<void> {
  const { uri, mimeType, fileName, dialogTitle } = options;

  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      window.open(uri, "_blank", "noopener,noreferrer");
    }
    return;
  }

  await waitForInteractions();

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      mimeType: mimeType ?? "application/octet-stream",
      dialogTitle,
      UTI: mimeType === "application/pdf" ? "com.adobe.pdf" : undefined,
    });
    return;
  }

  try {
    await Share.share({ url: uri, title: fileName });
  } catch {
    if (uri.startsWith("http")) {
      await Linking.openURL(uri);
    }
  }
}
