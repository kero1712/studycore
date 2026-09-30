import { parseDriveUrl } from "./integrations/google-drive/parse";

// يحوّل رابط فيديو إلى رابط embed آمن، أو null إذا لم يكن مدعومًا
export function videoEmbedUrl(input: string): string | null {
  let u: URL;
  try { u = new URL(input.trim()); } catch { return null; }
  if (u.protocol !== "https:") return null;
  const host = u.hostname.replace(/^www\./, "");
  const yt = /^[\w-]{11}$/;
  let id: string | null = null;
  if (host === "youtu.be") id = u.pathname.slice(1).split("/")[0];
  else if (host === "youtube.com" || host === "m.youtube.com") {
    id = u.searchParams.get("v") ?? u.pathname.match(/^\/(?:embed|shorts)\/([^/?#]+)/)?.[1] ?? null;
  }
  if (id && yt.test(id)) return `https://www.youtube-nocookie.com/embed/${id}`;
  const d = parseDriveUrl(input);
  if (d?.kind === "file") return `https://drive.google.com/file/d/${d.id}/preview`;
  return null;
}
