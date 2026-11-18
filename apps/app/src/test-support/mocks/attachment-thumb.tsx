/**
 * Shared `@/components/attachments/attachment-thumb` mock — no image decoding or
 * authed fetches. Thumbs render as `thumb-<uri>` views labelled `remote-thumb`
 * (auth headers present) or `local-thumb`; the loader renders `media-loader`.
 *
 *   jest.mock("@/components/attachments/attachment-thumb", () => require("@/test-support/mocks/attachment-thumb").attachmentThumbMock);
 */
import { View } from "react-native";

function AttachmentThumb({ uri, headers }: { uri: string; headers?: Record<string, string> }) {
  return (
    <View
      testID={`thumb-${uri}`}
      accessibilityLabel={headers?.Authorization ? "remote-thumb" : "local-thumb"}
    />
  );
}

function AttachmentMediaLoader() {
  return <View testID="media-loader" />;
}

export const attachmentThumbMock = {
  __esModule: true,
  AttachmentThumb,
  AttachmentMediaLoader,
};
