import type { CreateContentReportPayload } from "@munib-tracker/shared/types/content-report";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { DB_KEYS } from "@/db/keys";
import type { ReportAttachmentInput } from "@/lib/content-report-api";
import { submitContentReport } from "@/lib/content-report-api";

export type QueuedContentReport = {
  id: string;
  createdAt: string;
  payload: CreateContentReportPayload;
  /** Base64 data URLs for offline persistence. */
  attachments: Array<{
    dataUrl: string;
    mimeType: string;
    filename: string;
  }>;
};

async function readQueue(): Promise<QueuedContentReport[]> {
  const raw = await AsyncStorage.getItem(DB_KEYS.contentReportQueue);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as QueuedContentReport[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeQueue(items: QueuedContentReport[]): Promise<void> {
  await AsyncStorage.setItem(DB_KEYS.contentReportQueue, JSON.stringify(items));
}

export async function enqueueContentReport(
  payload: CreateContentReportPayload,
  attachments: ReportAttachmentInput[],
): Promise<void> {
  const dataUrls = await Promise.all(
    attachments.map(async (attachment) => ({
      dataUrl: attachment.uri,
      mimeType: attachment.mimeType,
      filename: attachment.filename,
    })),
  );

  const queue = await readQueue();
  queue.push({
    id: `queued-${Date.now()}`,
    createdAt: new Date().toISOString(),
    payload,
    attachments: dataUrls,
  });
  await writeQueue(queue);
}

export async function flushContentReportQueue(accessToken: string): Promise<number> {
  const queue = await readQueue();
  if (queue.length === 0) return 0;

  const remaining: QueuedContentReport[] = [];
  let sent = 0;

  for (const item of queue) {
    try {
      await submitContentReport(
        accessToken,
        item.payload,
        item.attachments.map((attachment) => ({
          uri: attachment.dataUrl,
          mimeType: attachment.mimeType,
          filename: attachment.filename,
        })),
      );
      sent += 1;
    } catch {
      const failedIndex = queue.indexOf(item);
      remaining.push(...queue.slice(failedIndex));
      break;
    }
  }

  await writeQueue(remaining);
  return sent;
}

export async function getQueuedReportCount(): Promise<number> {
  return (await readQueue()).length;
}

/** Test helper — exposes queue read for assertions. */
export async function readContentReportQueueForTests(): Promise<QueuedContentReport[]> {
  return readQueue();
}

export async function clearContentReportQueueForTests(): Promise<void> {
  await AsyncStorage.removeItem(DB_KEYS.contentReportQueue);
}
