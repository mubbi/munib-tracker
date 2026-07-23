/**
 * Metro resolves `expo-document-picker` here when `EXPO_TV=1`.
 */

export type DocumentPickerResult =
  | { canceled: true; assets: null }
  | {
      canceled: false;
      assets: Array<{
        uri: string;
        name: string;
        mimeType?: string;
        size?: number;
      }>;
    };

export async function getDocumentAsync(_options?: unknown): Promise<DocumentPickerResult> {
  return { canceled: true, assets: null };
}

export default { getDocumentAsync };
