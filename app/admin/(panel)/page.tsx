import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { ar } from "@/lib/ar";

export default async function Dashboard() {
  const sb = await requireAdmin();
  const count = async (t: string) => (await sb.from(t).select("id", { count: "exact", head: true })).count ?? 0;
  const [terms, subjects, items] = await Promise.all([count("terms"), count("subjects"), count("content_items")]);
  const stats: [string, number][] = [["الترمات", terms], ["المواد", subjects], ["عناصر المحتوى", items]];
  return (
    <>
      <h2 style={{ marginTop: 14 }}>لوحة التحكم</h2>
      <div className="adm g3">
        {stats.map(([l, n]) => <div key={l} className="box"><small style={{ color: "var(--mu)" }}>{l}</small><h3 style={{ fontSize: 40 }}>{ar(n)}</h3></div>)}
      </div>
      <p style={{ marginTop: 18 }}><Link href="/admin/subjects" className="btn">إدارة المواد والمحتوى</Link></p>
    </>
  );
}
