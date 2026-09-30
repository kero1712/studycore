// تحويل شكل قاعدة البيانات (Supabase) إلى أنواع الواجهة. دالة نقية قابلة للاختبار.
import type { Term } from "../data/types";
import { TONE_BY_ICON } from "../data/section-templates";

export type DbContent = { id: string; name: string; type: "pdf" | "video" | "link"; url: string; drive_file_id?: string | null; sort_order: number };
export type DbSection = { id: number; name: string; icon: string; sort_order: number; content_items: DbContent[] };
export type DbSubject = { id: number; name: string; icon: string; sort_order: number; sections: DbSection[] };
export type DbTerm = { id: number; name: string; sort_order: number; subjects: DbSubject[] };

export function mapTerms(rows: DbTerm[]): Term[] {
  return rows.map((t) => ({
    id: t.id,
    name: t.name,
    order: t.sort_order,
    subjects: (t.subjects ?? []).map((s) => ({
      id: s.id,
      name: s.name,
      icon: s.icon,
      order: s.sort_order,
      sections: (s.sections ?? []).map((x) => ({
        id: String(x.id),
        name: x.name,
        icon: x.icon,
        tone: TONE_BY_ICON[x.icon] ?? "g1",
        order: x.sort_order,
        contentItems: (x.content_items ?? []).map((c) => ({ id: c.id, name: c.name, type: c.type, url: c.url, ...(c.drive_file_id ? { driveFileId: c.drive_file_id } : {}), order: c.sort_order })),
      })),
    })),
  }));
}
