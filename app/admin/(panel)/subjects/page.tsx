import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import Act from "@/components/admin/Act";
import { SUBJECT_ICONS } from "@/data/section-templates";
import { addSubject, updateSubject, deleteSubject, moveSubject, toggleSubject } from "@/app/admin/actions";

const IconSelect = ({ def }: { def?: string }) => (
  <select name="icon" defaultValue={def ?? "book"}>{SUBJECT_ICONS.map((i) => <option key={i} value={i}>{i}</option>)}</select>
);

export default async function AdminSubjects() {
  const sb = await requireAdmin();
  const { data: terms } = await sb.from("terms").select("id,name,sort_order,subjects(id,name,icon,sort_order,is_published)").order("sort_order");
  return (
    <>
      <h2 style={{ marginTop: 14 }}>المواد</h2>
      {(terms ?? []).map((t: any) => (
        <section key={t.id}>
          <h3 style={{ fontSize: 28, margin: "22px 0 10px" }}>{t.name}</h3>
          <div className="list">
            {[...t.subjects].sort((a: any, b: any) => a.sort_order - b.sort_order).map((s: any) => (
              <div className="ar" key={s.id}>
                <div className="arow">
                  <b dir="auto" style={{ flex: 1 }}>{s.name}</b>
                  {!s.is_published && <span className="tag">مخفية</span>}
                  <Link className="btn sm" href={`/admin/subjects/${s.id}`}>المحتوى</Link>
                  <Act action={moveSubject} fields={{ id: s.id, term_id: t.id, dir: "up" }} label="↑" cls="gh" />
                  <Act action={moveSubject} fields={{ id: s.id, term_id: t.id, dir: "down" }} label="↓" cls="gh" />
                  <Act action={toggleSubject} fields={{ id: s.id, published: s.is_published }} label={s.is_published ? "إخفاء" : "نشر"} cls="gh" />
                </div>
                <details>
                  <summary>تعديل</summary>
                  <form action={updateSubject} className="adm">
                    <input type="hidden" name="id" value={s.id} />
                    <input name="name" defaultValue={s.name} required />
                    <IconSelect def={s.icon} />
                    <button className="btn sm">حفظ</button>
                  </form>
                </details>
                <details>
                  <summary>حذف</summary>
                  <p>سيُحذف كل ما بداخل المادة.</p>
                  <Act action={deleteSubject} fields={{ id: s.id }} label="تأكيد الحذف" cls="dg" />
                </details>
              </div>
            ))}
          </div>
          <form action={addSubject} className="box">
            <input type="hidden" name="term_id" value={t.id} />
            <input name="name" placeholder="اسم مادة جديدة" required />
            <IconSelect />
            <button className="btn">إضافة مادة</button>
          </form>
        </section>
      ))}
    </>
  );
}
