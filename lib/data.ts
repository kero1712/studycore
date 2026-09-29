// طبقة الوصول للبيانات: كل الصفحات تستخدم هذه الدوال فقط.
// الدوال async عمدًا ليسهل استبدال المصدر بـ Supabase لاحقًا دون تغيير الصفحات.
import { catalog } from "../data/catalog";
import type { ContentItem, Section, Subject, Term } from "../data/types";

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export async function getTerms(): Promise<Term[]> {
  return [...catalog].sort(byOrder).map((t) => ({ ...t, subjects: [...t.subjects].sort(byOrder) }));
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
  return catalog.flatMap((t) =>
    t.subjects.flatMap((s) =>
      s.sections.flatMap((x) => x.contentItems.map((c) => ({ id: c.id, name: c.name, type: c.type })))
    )
  );
}
