import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { ar } from "@/lib/ar";

export default async function AdminSubject({ params }: { params: { id: string } }) {
  const sb = await requireAdmin();
  const { data: sub } = await sb.from("subjects").select("id,name,sections(id,name,sort_order,content_items(id))").eq("id", params.id).maybeSingle();
  if (!sub) notFound();
  return (
    <>
      <Link href="/admin/subjects" className="crumb">المواد</Link>
      <h2 dir="auto" style={{ marginTop: 8 }}>{sub.name}</h2>
      <div className="list">
        {[...sub.sections].sort((a: any, b: any) => a.sort_order - b.sort_order).map((x: any) => (
          <Link key={x.id} href={`/admin/content/${x.id}`} className="row">
            <b>{x.name}</b><small>{ar(x.content_items.length)} عناصر</small>
          </Link>
        ))}
      </div>
    </>
  );
}
