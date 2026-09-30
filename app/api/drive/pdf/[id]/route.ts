import { getContentItem } from "@/lib/data";
import { fetchFileMedia, isDriveConfigured } from "@/lib/integrations/google-drive";

export const dynamic = "force-dynamic";

// يمرّر ملف PDF من Drive إلى الطالب داخل StudyCore.
// يبحث بمعرّف عنصر المحتوى (يعتمد على RLS: المنشور فقط) فلا يمكن طلب أي ملف Drive عشوائي عبر هذا المسار.
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const found = await getContentItem(params.id);
  if (!found || found.item.type !== "pdf" || !found.item.driveFileId) return new Response("Not found", { status: 404 });
  if (!isDriveConfigured()) return new Response("Drive is not configured", { status: 503 });

  const up = await fetchFileMedia(found.item.driveFileId, req.headers.get("range"));
  if (up.status !== 200 && up.status !== 206) return new Response("Unavailable", { status: up.status === 404 ? 404 : 502 });
  if (!(up.headers.get("content-type") ?? "").includes("pdf")) return new Response("Unsupported file type", { status: 415 });

  const headers = new Headers({ "Cache-Control": "private, max-age=300", "Accept-Ranges": "bytes" });
  for (const h of ["content-type", "content-length", "content-range"]) {
    const v = up.headers.get(h);
    if (v) headers.set(h, v);
  }
  return new Response(up.body, { status: up.status, headers });
}
