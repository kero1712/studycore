// تحليل روابط Google Drive. دوال نقية بلا أسرار، آمنة للاستدعاء من أي مكان.
export type DriveRef = { kind: "file" | "folder"; id: string };

const ID = /^[A-Za-z0-9_-]{10,200}$/;
const HOSTS = new Set(["drive.google.com", "docs.google.com"]);

export function parseDriveUrl(input: string): DriveRef | null {
  let u: URL;
  try { u = new URL(input.trim()); } catch { return null; }
  if (u.protocol !== "https:" || !HOSTS.has(u.hostname)) return null;
  const folder = u.pathname.match(/\/folders\/([^/?#]+)/);
  if (folder) return ID.test(folder[1]) ? { kind: "folder", id: folder[1] } : null;
  const id = u.pathname.match(/\/d\/([^/?#]+)/)?.[1] ?? u.searchParams.get("id");
  return id && ID.test(id) ? { kind: "file", id } : null;
}

// الشكل الموحّد الذي يُخزَّن في قاعدة البيانات
export const driveFileUrl = (id: string) => `https://drive.google.com/file/d/${id}/view`;
