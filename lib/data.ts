// طبقة الوصول للبيانات. الصفحات تستخدم هذه الدوال فقط.
// إذا ضُبطت مفاتيح Supabase تُقرأ البيانات منه، وإلا تُقرأ من data/catalog.ts (الكتالوج الثابت).
import { unstable_noStore as noStore } from "next/cache";
import { catalog } from "../data/catalog";
import type { ContentItem, Section, Subject, Term } from "../data/types";
import { mapTerms, type DbTerm } from "./data-map";
import { getPublicClient } from "./supabase/public";

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

async function loadCatalog(): Promise<Term[]> {
  noStore(); // لا تخزين مؤقت: تعديلات الأدمن تظهر فورًا
  const sb = getPublicClient();
  if (!sb) return catalog;
  const { data, error } = await sb
    .from("terms")
    .select("id,name,sort_order,subjects(id,name,icon,sort_order,sections(id,name,icon,sort_order,content_items(id,name,type,url,sort_order)))");
  if (error) throw new Error(`Supabase: ${error.message}`);
  return mapTerms((data ?? []) as unknown as DbTerm[]);
}

export async function getTerms(): Promise<Term[]> {
  return (await loadCatalog()).sort(byOrder).map((t) => ({ ...t, subjects: [...t.subjects].sort(byOrder) }));
}

export async function getTerm(id: number): Promise<Term | undefined> {
  return (await getTerms()).find((t) => t.id === id);
}

export async function getSubject(id: number): Promise<{ term: Term; subject: Subject } | undefined> {
  for (const term of await getTerms()) {
    const subject = term.subjects.find((s) => s.id === id);
    if (subject) return { term, subject: { ...subject, sections: [...subject.sections].sort(byOrder) } };
  }
}

export async function getSection(
  subjectId: number,
  sectionId: string
): Promise<{ subject: Subject; section: Section; items: ContentItem[] } | undefined> {
  const found = await getSubject(subjectId);
  const section = found?.subject.sections.find((s) => s.id === sectionId);
  if (!found || !section) return undefined;
  return { subject: found.subject, section, items: [...section.contentItems].sort(byOrder) };
}

export type SearchEntry = { id: string; name: string; type: ContentItem["type"] };

export async function getSearchIndex(): Promise<SearchEntry[]> {
  return (await loadCatalog()).flatMap((t) =>
    t.subjects.flatMap((s) => s.sections.flatMap((x) => x.contentItems.map((c) => ({ id: c.id, name: c.name, type: c.type }))))
  );
}
