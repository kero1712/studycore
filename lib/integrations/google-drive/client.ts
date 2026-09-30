// وصول server-only إلى Google Drive API عبر API key (الملفات يجب أن تكون مشاركة "أي شخص لديه الرابط").
// المفتاح يُرسل في الـheader ولا يظهر في أي URL أو استجابة.
import { driveApiKey, isDriveConfigured } from "./config";
import { safeRange } from "./range";

const API = "https://www.googleapis.com/drive/v3/files";

export type DriveMetadata = { id: string; name: string; mimeType: string; size?: string };

export async function getFileMetadata(id: string): Promise<DriveMetadata | null> {
  if (!isDriveConfigured()) return null;
  const r = await fetch(`${API}/${encodeURIComponent(id)}?fields=id,name,mimeType,size`, {
    headers: { "x-goog-api-key": driveApiKey() },
    cache: "no-store",
  });
  return r.ok ? ((await r.json()) as DriveMetadata) : null;
}

export async function fetchFileMedia(id: string, range?: string | null): Promise<Response> {
  const headers: Record<string, string> = { "x-goog-api-key": driveApiKey() };
  const rg = safeRange(range);
  if (rg) headers.Range = rg;
  return fetch(`${API}/${encodeURIComponent(id)}?alt=media`, { headers, cache: "no-store" });
}
