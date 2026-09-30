import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import Act from "@/components/admin/Act";
import { addContent, updateContent, deleteContent, moveContent, toggleContent } from "@/app/admin/actions";

const TYPE_LABEL: Record<string, string> = { pdf: "PDF", video: "فيديو", link: "رابط" };
const TypeSelect = ({ def }: { def?: string }) => (
  <select name="type" defaultValue={def ?? "pdf"}>{Object.entries(TYPE_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
);

export default async function AdminContent({ params }: { params: { sectionId: string } }) {
  const sb = await requireAdmin();
  const { data: sec } = await sb.from("sections").select("id,name,subjects(id,name)").eq("id", params.sectionId).maybeSingle();
  if (!sec) notFound();
  const { data: items } = await sb.from("content_items").select("*").eq("section_id", sec.id).order("sort_order").order("created_at");
  const subject: any = sec.subjects;
  return (
    <>
      <Link href={`/admin/subjects/${subject.id}`} className="crumb">{subject.name}</Link>
      <h2 style={{ marginTop: 8 }}>{sec.name}</h2>
      <form action={addContent} className="box">
        <input type="hidden" name="section_id" value={sec.id} />
        <input name="name" placeholder="اسم المحتوى" required />
        <TypeSelect />
        <input name="url" dir="ltr" placeholder="رابط Google Drive (للـPDF) أو رابط الفيديو / الرابط" required />
        <button className="btn">إضافة</button>
      </form>
      <div className="list">
        {(items ?? []).length === 0 && <div className="empty">لا يوجد محتوى في هذا القسم بعد.</div>}
        {(items ?? []).map((c: any) => (
          <div className="ar" key={c.id}>
            <div className="arow">
              <b style={{ flex: 1 }}>{c.name}</b>
              <span className="tag">{TYPE_LABEL[c.type]}</span>
              {!c.is_published && <span className="tag">مخفي</span>}
              <Act action={moveContent} fields={{ id: c.id, section_id: sec.id, dir: "up" }} label="↑" cls="gh" />
              <Act action={moveContent} fields={{ id: c.id, section_id: sec.id, dir: "down" }} label="↓" cls="gh" />
              <Act action={toggleContent} fields={{ id: c.id, published: c.is_published }} label={c.is_published ? "إخفاء" : "نشر"} cls="gh" />
            </div>
            <details>
              <summary>تعديل</summary>
              <form action={updateContent} className="adm">
                <input type="hidden" name="id" value={c.id} />
                <input name="name" defaultValue={c.name} required />
                <TypeSelect def={c.type} />
                <input name="url" dir="ltr" defaultValue={c.url} required />
                <button className="btn sm">حفظ</button>
              </form>
            </details>
            <details>
              <summary>حذف</summary>
              <Act action={deleteContent} fields={{ id: c.id }} label="تأكيد الحذف" cls="dg" />
            </details>
          </div>
        ))}
      </div>
    </>
  );
}
